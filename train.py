import os
import json
import gc
import joblib
import numpy as np
import pandas as pd
import lightgbm as lgb
from features import (
    FEATURES,
    CAT_FEATURES,
    build_features,
    build_encoders,
    apply_encoders,
)

DATA_DIR = "data"
ARTIFACT_DIR = "artifacts"
PARQUET_PATH = os.path.join(DATA_DIR, "sales_real.parquet")
MODEL_PATH = os.path.join(ARTIFACT_DIR, "model.pkl")

HORIZONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(ARTIFACT_DIR, exist_ok=True)


def load_data():
    if not os.path.exists(PARQUET_PATH):
        raise SystemExit(f"{PARQUET_PATH} not found.")
    print(f"Loading {PARQUET_PATH}...")
    df = pd.read_parquet(PARQUET_PATH)
    print("Rows:", len(df))

    df["sales"] = df["sales"].astype("float32")
    df["sell_price"] = df["sell_price"].astype("float32")
    for c in [
        "snap_ca",
        "snap_tx",
        "snap_wi",
        "event_cultural",
        "event_national",
        "event_religious",
        "event_sporting",
    ]:
        df[c] = df[c].astype("float32")
    for c in ["series_id", "dept_id", "cat_id", "store_id", "state_id"]:
        df[c] = df[c].astype(str).astype("category")

    return df


def main():
    df = load_data()

    print("Building features...")
    df = build_features(df)
    df = df.dropna(subset=["sales_lag_12"]).reset_index(drop=True)
    df = df.sort_values(["series_id", "date"]).reset_index(drop=True)
    print("Feature rows:", len(df))
    print("Series:", df["series_id"].nunique())

    max_date = df["date"].max()
    split_date = max_date - pd.DateOffset(months=6)
    print(f"Split date: {split_date.date()}")

    encoders = build_encoders(df)
    models = {}
    metrics = {}

    for h in HORIZONS:
        print(f"\n=== Training horizon {h} ===")

        target_date = df.groupby("series_id")["date"].shift(-(h - 1))
        target_sales = df.groupby("series_id")["sales"].shift(-(h - 1))

        sub = df.copy()
        sub["y"] = np.log1p(target_sales)

        tgt_month = target_date.dt.month
        sub["month"] = tgt_month
        sub["quarter"] = ((tgt_month - 1) // 3) + 1
        sub["month_sin"] = np.sin(2 * np.pi * sub["month"] / 12)
        sub["month_cos"] = np.cos(2 * np.pi * sub["month"] / 12)

        sub = sub.dropna(subset=["y", "month"]).reset_index(drop=True)

        train = sub[sub["date"] <= split_date].copy()
        valid = sub[sub["date"] > split_date].copy()
        print(f"train={len(train)} valid={len(valid)}")

        train = apply_encoders(train, encoders)
        valid = apply_encoders(valid, encoders)

        X_train = train[FEATURES]
        y_train = train["y"].to_numpy()
        X_valid = valid[FEATURES]
        y_valid = valid["y"].to_numpy()

        del sub, train, valid
        gc.collect()

        model = lgb.LGBMRegressor(
            n_estimators=1500,
            learning_rate=0.05,
            num_leaves=63,
            min_child_samples=20,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
        )

        callbacks = [lgb.log_evaluation(100)]
        if len(X_valid) > 0:
            callbacks.append(lgb.early_stopping(50))

        model.fit(
            X_train,
            y_train,
            eval_X=X_valid if len(X_valid) > 0 else None,
            eval_y=y_valid if len(y_valid) > 0 else None,
            eval_metric="l1",
            categorical_feature=CAT_FEATURES,
            callbacks=callbacks,
        )

        correction = 1.0
        if len(X_valid) > 0:
            pred = np.clip(np.expm1(model.predict(X_valid)), 0, None)
            actual = np.expm1(y_valid)
            wape = float(np.sum(np.abs(pred - actual)) / np.sum(np.abs(actual)))
            print(f"horizon {h} WAPE: {wape:.4f}")

            sum_pred = float(np.sum(pred))
            sum_actual = float(np.sum(actual))
            correction = sum_actual / sum_pred if sum_pred > 0 else 1.0
            print(f"horizon {h} correction factor: {correction:.4f}")

            pred_corr = pred * correction
            wape_corr = float(
                np.sum(np.abs(pred_corr - actual)) / np.sum(np.abs(actual))
            )
            print(f"horizon {h} WAPE (corrected): {wape_corr:.4f}")
            metrics[f"h{h}"] = wape_corr
        else:
            metrics[f"h{h}"] = None

        models[h] = {
            "model": model,
            "features": FEATURES,
            "correction": correction,
        }

        del X_train, X_valid, y_train, y_valid
        gc.collect()

    joblib.dump(
        {"models": models, "encoders": encoders, "horizons": HORIZONS},
        MODEL_PATH,
    )
    with open(os.path.join(ARTIFACT_DIR, "metadata.json"), "w") as f:
        json.dump({"wape": metrics, "horizons": HORIZONS}, f, indent=2)

    print(f"\nSaved to {MODEL_PATH}")
    print("WAPE (corrected):", metrics)


if __name__ == "__main__":
    main()
