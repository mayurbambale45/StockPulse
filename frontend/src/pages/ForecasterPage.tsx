import React, { useState, useEffect } from 'react';
import {
  CATALOG_PRODUCTS,
  STORES,
  fetchForecast,
  calculateDynamicROP,
} from '../services/api';
import type { ForecastResponse } from '../types';
import { ForecastChart } from '../components/ForecastChart';
import { FeatureCatalogDrawer } from '../components/FeatureCatalogDrawer';
import {
  TrendingUp,
  Sliders,
  Download,
  AlertCircle,
  Package,
} from 'lucide-react';

export const ForecasterPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('FOODS_1_001');
  const [selectedStore, setSelectedStore] = useState<string>('CA_1');
  const [horizon, setHorizon] = useState<number>(6);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [forecastResult, setForecastResult] = useState<ForecastResponse | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);
  const [isFeatureDrawerOpen, setIsFeatureDrawerOpen] = useState<boolean>(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  const currentProd = CATALOG_PRODUCTS.find((p) => p.id === selectedProduct) || CATALOG_PRODUCTS[0];
  const currentStore = STORES.find((s) => s.id === selectedStore) || STORES[0];

  const handlePredict = async () => {
    setIsLoading(true);
    try {
      const { data, isFallback } = await fetchForecast(selectedProduct, selectedStore, horizon);
      setForecastResult(data);
      setIsFallbackMode(isFallback);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handlePredict();
  }, [selectedProduct, selectedStore, horizon]);

  // Quick ROP calculation
  const month1Sales = forecastResult?.forecast[0]?.predictedSales || currentProd.avgMonthlySales;
  const { rop, safetyStock } = calculateDynamicROP(month1Sales, currentStore.leadTimeDays);

  const exportForecastCSV = () => {
    if (!forecastResult) return;
    const headers = 'Horizon,Target_Date,Predicted_Sales_Units,Confidence_Tier\n';
    const rows = forecastResult.forecast
      .map((p, idx) => `H${idx + 1},${p.date},${p.predictedSales},${p.confidence}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_forecast_${selectedProduct}_${selectedStore}.csv`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Sales Forecast
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Choose a product and store to see predicted customer demand.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsFeatureDrawerOpen(true)}
            className="btn btn-secondary btn-sm"
          >
            <Sliders size={14} />
            Demand Factors
          </button>
          <button
            onClick={exportForecastCSV}
            className="btn btn-secondary btn-sm"
            disabled={!forecastResult}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Control Panel: Product, Store, Horizon */}
      <div className="card">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: '1rem',
          alignItems: 'flex-end',
        }}>
          {/* Product Selector */}
          <div className="form-group">
            <label className="form-label">Product</label>
            <select
              className="form-select"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {CATALOG_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} (${prod.basePrice.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Store Location */}
          <div className="form-group">
            <label className="form-label">Store Location</label>
            <select
              className="form-select"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
            >
              {STORES.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} ({store.id})
                </option>
              ))}
            </select>
          </div>

          {/* Horizon Selection */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Forecast Period</label>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-blue)' }}>
                {horizon} Months
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {[1, 3, 6, 12].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizon(h)}
                  className={`btn btn-sm ${horizon === h ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '0.35rem 0.45rem' }}
                >
                  {h}M
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div>
            <button
              onClick={handlePredict}
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', height: '36px' }}
            >
              <TrendingUp size={15} />
              {isLoading ? 'Calculating...' : 'Forecast Sales'}
            </button>
          </div>
        </div>

        {/* Item Metadata */}
        <div style={{
          marginTop: '0.85rem',
          paddingTop: '0.65rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span>Category: <strong style={{ color: 'var(--text-main)' }}>{currentProd.category}</strong></span>
            <span>Retail Price: <strong style={{ color: 'var(--text-main)' }}>${currentProd.basePrice.toFixed(2)}</strong></span>
            <span>Delivery Time: <strong style={{ color: 'var(--text-main)' }}>{currentStore.leadTimeDays} days</strong></span>
          </div>

          {isFallbackMode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#D97706' }}>
              <AlertCircle size={13} />
              <span>Offline Demo Data</span>
            </div>
          )}
        </div>
      </div>

      {/* Time Series Chart */}
      {forecastResult && (
        <ForecastChart
          productId={selectedProduct}
          storeId={selectedStore}
          points={forecastResult.forecast}
          basePrice={currentProd.basePrice}
        />
      )}

      {/* Results Grid: Predictions Table + Simple Stock Impact */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.25rem' }}>
        
        {/* Predictions Table */}
        <div className="card">
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Monthly Expected Sales
              </h3>
            </div>
            <span className="badge badge-info">{horizon} Months</span>
          </div>

          <div className="table-container">
            <table className="data-table" style={{ minWidth: '450px' }}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Date</th>
                  <th>Expected Sales</th>
                  <th>Confidence</th>
                  <th>Est. Revenue</th>
                </tr>
              </thead>
              <tbody>
                {forecastResult?.forecast.map((pt, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>Month +{idx + 1}</td>
                    <td className="font-mono" style={{ color: 'var(--text-muted)' }}>{pt.date}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {pt.predictedSales} units
                    </td>
                    <td>
                      <span className={`badge ${
                        pt.confidence === 'high' ? 'badge-ok' : pt.confidence === 'medium' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {pt.confidence}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                      ${(pt.predictedSales * currentProd.basePrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Reorder Level & Safety Buffer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
              <Package size={16} color="var(--accent-blue)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Reorder Recommendation
              </h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Automatically calculated minimum shelf quantities for this item.
              <button
                onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                className="btn-readmore"
              >
                {showFormulaDetails ? 'Hide calculation' : 'How is this calculated?'}
              </button>
            </p>
          </div>

          {showFormulaDetails && (
            <div style={{
              background: 'var(--bg-surface-subtle)',
              padding: '0.65rem 0.85rem',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
            }}>
              Reorder Point = (Daily Sales × Delivery Days) + Safety Buffer
              <br />
              Safety Buffer = 2.054 × √(Lead Time Variance + Sales Variance)
            </div>
          )}

          <div className="grid-cols-2 gap-4">
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reorder When Stock Reaches</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                {rop} <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: 'var(--text-muted)' }}>units</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Emergency Safety Buffer</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#047857', marginTop: '0.15rem' }}>
                {safetyStock} <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: 'var(--text-muted)' }}>units</span>
              </div>
            </div>
          </div>

          <div style={{
            padding: '0.75rem 0.85rem',
            background: 'var(--status-info-bg)',
            border: '1px solid var(--status-info-border)',
            borderRadius: '4px',
            fontSize: '0.75rem',
            color: 'var(--status-info-text)',
            lineHeight: 1.4,
          }}>
            <strong>Recommendation:</strong> When on-hand inventory drops to <strong>{rop} units</strong>, place an order with your supplier to prevent stockout while order is in transit ({currentStore.leadTimeDays} days).
          </div>
        </div>

      </div>

      {/* Feature Catalog Inspector Drawer */}
      <FeatureCatalogDrawer
        isOpen={isFeatureDrawerOpen}
        onClose={() => setIsFeatureDrawerOpen(false)}
        productId={selectedProduct}
        storeId={selectedStore}
        price={currentProd.basePrice}
      />
    </div>
  );
};
