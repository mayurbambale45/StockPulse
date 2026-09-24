import requests
import pandas as pd
import numpy as np
import random

BASE = "http://127.0.0.1:8000"
PARQUET = "data/sales_real.parquet"
HORIZON = 6  # change to 12 to test year-ahead
N_SAMPLE = 30
SEED = 0

print(f"Loading {PARQUET}...")
df = pd.read_parquet(PARQUET)
print("Rows:", len(df))

full = df.groupby("series_id").size()
eligible = full[full >= 60].index.tolist()
random.seed(SEED)
sample = random.sample(eligible, min(N_SAMPLE, len(eligible)))
print(f"Sampled {len(sample)} series, horizon={HORIZON}")

wapes = []
signed_num = 0.0
signed_den = 0.0

for sid in sample:
    s = df[df["series_id"] == sid].sort_values("date").reset_index(drop=True)

    parts = sid.split("_")
    product_id = "_".join(parts[:-2])
    store_id = "_".join(parts[-2:])

    cut = s["date"].max() - pd.DateOffset(months=HORIZON)
    hist = s[s["date"] <= cut]
    fut = s[s["date"] > cut].reset_index(drop=True)
    if len(fut) < HORIZON:
        continue

    payload = {
        "productId": product_id,
        "storeId": store_id,
        "horizon": HORIZON,
    }

    resp = requests.post(f"{BASE}/predict", json=payload)
    if resp.status_code != 200:
        print(f"{sid:30s}  ERROR {resp.status_code}  {resp.text[:80]}")
        continue

    preds = np.array([p["predictedSales"] for p in resp.json()["forecast"]])
    actuals = fut["sales"].to_numpy()[: len(preds)]

    denom = np.sum(np.abs(actuals)) or 1.0
    w = np.sum(np.abs(preds - actuals)) / denom
    wapes.append(w)
    signed_num += np.sum(preds - actuals)
    signed_den += np.sum(actuals)

    print(f"{sid:30s}  WAPE={w:.3f}  mean_actual={actuals.mean():.2f}")

print(f"\nN = {len(wapes)}")
print(f"Mean WAPE:    {np.mean(wapes):.3f}")
print(f"Median WAPE:  {np.median(wapes):.3f}")
print(f"Signed bias:  {signed_num / signed_den:+.3f}")
