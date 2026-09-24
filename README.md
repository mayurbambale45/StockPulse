# Forecast Engine

A demand forecasting service for Walmart M5 product sales. Given a product and store, it predicts monthly unit sales up to 12 months ahead.

Built with FastAPI and LightGBM. Trained on the real Walmart M5 dataset, aggregated to monthly granularity.

---

## What it does

Send a product ID and store ID. Get back monthly sales forecasts with confidence tiers.

```json
POST /predict
{"productId": "FOODS_1_001", "storeId": "CA_1", "horizon": 6}
```

Response:

```json
{
  "productId": "FOODS_1_001",
  "storeId": "CA_1",
  "horizon": 6,
  "forecast": [
    {"date": "2016-07-31", "predictedSales": 22.14, "confidence": "high"},
    {"date": "2016-08-31", "predictedSales": 18.63, "confidence": "high"},
    {"date": "2016-09-30", "predictedSales": 17.92, "confidence": "high"},
    {"date": "2016-10-31", "predictedSales": 19.04, "confidence": "medium"},
    {"date": "2016-11-30", "predictedSales": 19.87, "confidence": "medium"},
    {"date": "2016-12-31", "predictedSales": 18.62, "confidence": "medium"}
  ]
}
```

---

## Architecture

```
┌──────────────────┐
│  Express / Client│
└────────┬─────────┘
         │  POST /predict
         │  {"productId", "storeId", "horizon"}
         ▼
┌──────────────────────────────────────┐
│  FastAPI Server  (main.py)           │
│                                      │
│  ├─ Loads artifacts/model.pkl        │
│  ├─ Indexes data/sales_real.parquet  │
│  ├─ Looks up series history          │
│  ├─ Builds 31 features per horizon   │
│  └─ Runs 12 LightGBM models          │
└──────────────────────────────────────┘
```

**12 per-horizon models.** Model 1 predicts month+1. Model 12 predicts month+12. No recursion, no feedback loop.

---

## Project structure

```
forecast-engine/
├── main.py                    # FastAPI server (the running service)
├── train.py                   # trains 12 models, saves to artifacts/
├── features.py                # feature engineering (lags, rolling, calendar, events)
├── test_multi.py              # accuracy benchmark across random series
├── smoke_test.py              # endpoint health checks (optional)
├── requirements.txt
├── artifacts/
│   ├── model.pkl              # trained models + encoders + correction factors
│   └── metadata.json          # WAPE per horizon
└── data/
    └── sales_real.parquet     # monthly M5, ~1.98M rows, 30,490 series
```

---

## Requirements

```
fastapi
uvicorn[standard]
pydantic
pandas
numpy
lightgbm
scikit-learn
joblib
pyarrow
python-dateutil
```

Install:

```bash
pip install -r requirements.txt
```

---

## Setup

### 1. Get the data

The training data comes from the Walmart M5 Forecasting competition. Download from Kaggle:

```bash
kaggle competitions download -c m5-forecasting-accuracy
unzip m5-forecasting-accuracy.zip -d m5_daily/
```

You'll need to accept the competition rules on Kaggle first.

### 2. Build the daily parquet

Save as `prep_daily.py` and run once (~5–10 min, ~500 MB output):

Reads `m5_daily/*.csv`, melts wide→long, joins calendar + prices, writes `data/daily.parquet` with ~59M rows.

### 3. Build the monthly parquet

Save as `prep_monthly_real.py` and run once (~2–3 min, ~30 MB output):

Reads `data/daily.parquet`, aggregates daily→monthly per series, writes `data/sales_real.parquet` with ~1.98M rows and 30,490 series × ~65 months.

### 4. Train the model

```bash
python train.py
```

Trains 12 horizons. Expected runtime: **30–45 minutes** on a typical laptop.

Output:

```
=== Training horizon 1 ===
train=... valid=...
horizon 1 WAPE: 0.3129
horizon 1 correction factor: 1.2841
horizon 1 WAPE (corrected): 0.2891
...
Saved to artifacts/model.pkl
WAPE (corrected): {...}
```

### 5. Start the server

```bash
uvicorn main:app --reload --port 8000
```

Startup log:

```
Loading model...
Indexing data/sales_real.parquet...
Indexed 30490 series.
INFO:     Application startup complete.
```

Startup time: ~10 seconds. Memory: ~250 MB idle.

---

## API Reference

Base URL: `http://localhost:8000`

Interactive docs: `http://localhost:8000/docs`

### `GET /health`

Service status.

```bash
curl http://localhost:8000/health
```

```json
{
  "status": "ok",
  "model_loaded": true,
  "series_indexed": 30490,
  "horizons": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}
```

### `GET /series?limit=20`

List available series IDs. Useful for discovery and validation.

```bash
curl http://localhost:8000/series
```

```json
{
  "total": 30490,
  "sample": ["FOODS_1_001_CA_1", "FOODS_1_001_CA_2", ...]
}
```

### `POST /predict`

Single series forecast.

**Request:**

```json
{
  "productId": "FOODS_1_001",
  "storeId": "CA_1",
  "horizon": 6
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `productId` | string | yes | e.g. `FOODS_1_001` |
| `storeId` | string | yes | e.g. `CA_1` |
| `horizon` | int | no | 1–12, default 6 |
| `history` | array | no | Optional override for new products |

**Response:**

```json
{
  "productId": "FOODS_1_001",
  "storeId": "CA_1",
  "horizon": 6,
  "forecast": [
    {"date": "2016-07-31", "predictedSales": 22.14, "confidence": "high"},
    ...
  ]
}
```

**Confidence tiers:**

| Value | Horizon | Meaning |
|---|---|---|
| `high` | 1–3 | Reliable for automated ordering |
| `medium` | 4–6 | Directionally useful |
| `low` | 7–9 | Rough estimate |
| `very_low` | 10–12 | ~Seasonal-naive quality |

**Errors:** `400` if series not found, horizon > 12, or history invalid.

### `POST /predict/batch`

Multiple series in one request. Never fails on a single bad item.

**Request:**

```json
{
  "items": [
    {"productId": "FOODS_1_001", "storeId": "CA_1", "horizon": 6},
    {"productId": "FOODS_1_002", "storeId": "CA_2"},
    {"productId": "BOGUS_999", "storeId": "XX_1"}
  ]
}
```

**Response:**

```json
{
  "forecasts": [
    {"productId": "FOODS_1_001", "storeId": "CA_1", "horizon": 6, "forecast": [...]},
    {"productId": "FOODS_1_002", "storeId": "CA_2", "horizon": 6, "forecast": [...]}
  ],
  "errors": [
    {"productId": "BOGUS_999", "storeId": "XX_1", "error": "series BOGUS_999_XX_1 not found..."}
  ]
}
```

---

## Model details

### Inputs per forecast

For a series forecast at month T+h:

- **12 sales lags** — last 12 months of observed sales
- **6 rolling stats** — 3/6/12-month mean and std of sales
- **4 calendar** — target month, quarter, sin/cos encoding
- **2 price** — last sell_price, price change
- **3 SNAP** — snap_ca, snap_tx, snap_wi flags
- **4 events** — cultural, national, religious, sporting flags
- **4 categorical** — dept_id, cat_id, store_id, state_id

Total: **31 features + 1 correction factor**.

### Training

- Objective: L2 on `log1p(sales)`
- 12 independent models (one per horizon)
- 1500 estimators, early stopping at 50 rounds
- Time-based split: last 6 months held out for validation
- Per-horizon bias correction computed on validation set

### Bias correction

Training on log-transformed targets produces a systematic under-prediction (geometric mean vs. arithmetic mean). We compute a per-horizon correction factor:

```
correction[h] = sum(actual_valid) / sum(predicted_valid)
```

Applied at inference: `pred_final = pred_raw * correction[h]`

This reduced signed bias from **−24.8%** to **+1.4%**.

---

## Accuracy

Benchmark: `python test_multi.py` — 30 random series, 6-month horizon.

| Metric | Value |
|---|---|
| Median WAPE | **0.415** |
| Mean WAPE | 0.542 |
| Signed bias | +0.014 |

### Accuracy by volume

| Series volume | Typical WAPE | Usable? |
|---|---|---|
| > 100 units/month | 0.10 – 0.25 | Yes — automated ordering |
| 20 – 100 | 0.25 – 0.50 | Yes — planning with buffer |
| 5 – 20 | 0.40 – 0.70 | Marginal — sanity check only |
| < 5 | 0.50 – 1.50 | No — too noisy |

### Accuracy by horizon

| Horizon | Expected WAPE |
|---|---|
| Month 1 | ~0.30 |
| Month 3 | ~0.35 |
| Month 6 | ~0.42 |
| Month 9 | ~0.48 |
| Month 12 | ~0.52 |

---

## Known limitations

1. **Low-volume series are noisy.** Series selling < 5 units/month have WAPE > 0.5. This is a property of daily retail demand, not a model bug.

2. **Regime changes cannot be predicted.** If a series doubles in the forecast window, the model has no way to know. Trees cannot extrapolate beyond training distribution.

3. **Monthly granularity loses daily patterns.** Weekday effects, exact holiday timing, and SNAP-day patterns are averaged away. We tested daily and it performed worse (see below).

4. **Global model for all series.** One set of trees handles 30,490 series. Per-category or per-store models would improve accuracy at the cost of training time.

5. **Exogenous features are frozen at inference.** Price, SNAP, and events are carried forward from the last observed value. If the actual future differs (planned promo, price change), predictions will be off.

---

## What we tested and rejected

| Approach | Median WAPE | Verdict |
|---|---|---|
| Monthly on AutoGluon `m5_1M` benchmark | 0.455 | Superseded |
| **Monthly on real Kaggle M5** | **0.415** | ✅ Shipping |
| Daily (Tweedie) on real Kaggle M5 | 0.755 | Rejected |

**Why daily lost:** store-item daily demand is dominated by low-count noise (many 0s, occasional 1s and 2s). Aggregating to monthly removes noise and exposes signal. Trees can't learn "the customer walks in tomorrow instead of today."

This finding is documented as a valid engineering outcome, not a failure.

---

## Testing

### Smoke test

```bash
python smoke_test.py
```

Hits every endpoint, verifies response shape, checks error handling. Should print `All smoke tests passed.`

### Accuracy benchmark

```bash
python test_multi.py
```

Runs 30 random series through the API and reports per-series WAPE plus aggregate mean/median/signed-bias.

Change `HORIZON` at the top to test longer horizons.

---

## Deployment notes

- **Memory:** ~250 MB idle after startup
- **Startup time:** ~10 seconds (loads model + indexes 30,490 series)
- **Throughput:** single prediction ~5 ms; batch of 100 ~400 ms
- **No database required.** Everything is in-memory + parquet on disk.

To expose externally behind Express:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Integration example

Express side:

```javascript
const res = await fetch("http://localhost:8000/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    productId: "FOODS_1_001",
    storeId: "CA_1",
    horizon: 6,
  }),
});
const data = await res.json();
// data.forecast = [{date, predictedSales, confidence}, ...]
```

---

## Data attribution

Trained on the [Walmart M5 Forecasting Dataset](https://www.kaggle.com/c/m5-forecasting-accuracy) (Kaggle, 2020). Aggregated from daily to monthly granularity.

30,490 product-store series across 3 states (CA, TX, WI), 3 categories (FOODS, HOBBIES, HOUSEHOLD), and 10 stores.

---

## License

Internal bootcamp project. Dataset usage governed by the M5 competition terms.