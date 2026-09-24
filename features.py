import numpy as np
import pandas as pd

CAT_FEATURES = ["dept_id", "cat_id", "store_id", "state_id"]

LAGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

NUM_FEATURES = [
    "month",
    "quarter",
    "month_sin",
    "month_cos",
    "sales_lag_1",
    "sales_lag_2",
    "sales_lag_3",
    "sales_lag_4",
    "sales_lag_5",
    "sales_lag_6",
    "sales_lag_7",
    "sales_lag_8",
    "sales_lag_9",
    "sales_lag_10",
    "sales_lag_11",
    "sales_lag_12",
    "sales_roll_mean_3",
    "sales_roll_std_3",
    "sales_roll_mean_6",
    "sales_roll_std_6",
    "sales_roll_mean_12",
    "sales_roll_std_12",
    "sell_price",
    "price_change",
    "snap_ca",
    "snap_tx",
    "snap_wi",
    "event_cultural",
    "event_national",
    "event_religious",
    "event_sporting",
]

FEATURES = NUM_FEATURES + CAT_FEATURES


def add_calendar(df):
    df = df.copy()
    df["month"] = df["date"].dt.month
    df["quarter"] = df["date"].dt.quarter
    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)
    return df


def add_lags(df):
    df = df.sort_values(["series_id", "date"]).copy()
    g = df.groupby("series_id")["sales"]
    for lag in LAGS:
        df[f"sales_lag_{lag}"] = g.shift(lag)
    for w in (3, 6, 12):
        df[f"sales_roll_mean_{w}"] = g.transform(lambda s: s.shift(1).rolling(w).mean())
        df[f"sales_roll_std_{w}"] = g.transform(lambda s: s.shift(1).rolling(w).std())
    return df


def add_price(df):
    df = df.sort_values(["series_id", "date"]).copy()
    df["price_change"] = df.groupby("series_id")["sell_price"].pct_change().fillna(0.0)
    return df


def build_features(df):
    df = add_calendar(df)
    df = add_lags(df)
    df = add_price(df)
    return df


def build_encoders(df):
    encoders = {}
    for col in CAT_FEATURES:
        values = sorted(df[col].astype(str).dropna().unique())
        encoders[col] = {v: i for i, v in enumerate(values)}
    return encoders


def apply_encoders(df, encoders):
    df = df.copy()
    for col in CAT_FEATURES:
        df[col] = df[col].astype(str).map(encoders[col]).fillna(-1).astype(int)
    return df
