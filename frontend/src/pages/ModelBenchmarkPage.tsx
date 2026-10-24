import React, { useState } from 'react';
import { HORIZON_BENCHMARKS } from '../services/api';
import {
  Server,
  Zap,
  HardDrive,
  FileCode,
  Scale,
} from 'lucide-react';

export const ModelBenchmarkPage: React.FC = () => {
  const [showTechnicalParams, setShowTechnicalParams] = useState<boolean>(false);
  const [showStatDetails, setShowStatDetails] = useState<boolean>(false);

  const hyperparameters = [
    { param: 'Model Type', value: 'LightGBM Gradient Boosted Trees', purpose: 'Direct multi-horizon tree ensembles.' },
    { param: 'Learning Rate', value: '0.05', purpose: 'Ensures steady gradient convergence.' },
    { param: 'Trees Per Horizon', value: '1500 (Early stopping at 50)', purpose: 'Optimizes forecast accuracy.' },
    { param: 'Tree Depth / Leaves', value: '63 leaves', purpose: 'Captures non-linear promotion and holiday interactions.' },
    { param: 'Feature Subsampling', value: '80% per split', purpose: 'Prevents overfitting on noisy items.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Forecast Accuracy & Reliability
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Evaluation metrics across 12 monthly horizons on Walmart M5 historical series.
        </p>
      </div>

      {/* Metric Explanation Banner */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderRadius: '6px',
        padding: '0.9rem 1.15rem',
        fontSize: '0.8125rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          Understanding WAPE (Weighted Absolute Percentage Error):
        </div>
        WAPE measures the total difference between forecasted units and actual sold units divided by total sales. <strong>A lower WAPE percentage means predictions are closer to real customer demand.</strong>
        <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          • <strong>Validation Set (shown below):</strong> Month 1 WAPE is <strong>28.91%</strong> compared to the baseline moving average of <strong>44.20%</strong> (15.3 percentage point error reduction).<br />
          • <strong>Out-of-Sample / Unseen Test Evaluation:</strong> On limited unseen-test evaluation across all 30,490 store-SKU series, the report records a median WAPE of <strong>41.5%</strong>, reflecting real-world intermittent retail demand.
        </div>
      </div>

      {/* Performance Tiles */}
      <div className="grid-cols-4 gap-4">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SPEED</span>
            <Zap size={15} color="#059669" />
          </div>
          <div className="metric-value" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            11.4 ms
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Lookup time
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>MEMORY</span>
            <Server size={15} color="var(--primary)" />
          </div>
          <div className="metric-value" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            248 MB
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Lightweight
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>INDEX</span>
            <HardDrive size={15} color="#2563EB" />
          </div>
          <div className="metric-value" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            99.3%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Compressed data
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>READY IN</span>
            <FileCode size={15} color="#D97706" />
          </div>
          <div className="metric-value" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            8.4 s
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Startup time
          </div>
        </div>
      </div>

      {/* Month-by-Month Accuracy Table */}
      <div className="card">
        <div style={{ marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Month-by-Month Accuracy
          </h3>
        </div>

        <div className="table-container">
          <table className="data-table" style={{ minWidth: '500px' }}>
            <thead>
              <tr>
                <th>Lookahead</th>
                <th>Target Period</th>
                <th>AI Model Error</th>
                <th>Old System Error</th>
                <th>Improvement</th>
              </tr>
            </thead>
            <tbody>
              {HORIZON_BENCHMARKS.map((row) => {
                const improvement = (row.naiveMovingAverageWape - row.calibratedWape).toFixed(1);
                return (
                  <tr key={row.horizon}>
                    <td style={{ fontWeight: 600 }}>Month +{row.horizon}</td>
                    <td>{row.targetMonth}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#047857' }}>
                        {row.calibratedWape.toFixed(1)}% error
                      </span>
                    </td>
                    <td style={{ color: '#991B1B' }}>{row.naiveMovingAverageWape.toFixed(1)}% error</td>
                    <td>
                      <span className="badge badge-ok" style={{ fontSize: '0.7rem' }}>
                        +{improvement}% Better
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistical Verification with Read More */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Statistical Validation
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Confirming that promotions and welfare benefit days are genuine demand drivers.
              <button
                onClick={() => setShowStatDetails(!showStatDetails)}
                className="btn-readmore"
              >
                {showStatDetails ? 'Read less' : 'Read more'}
              </button>
            </p>
          </div>
          <span className="badge badge-ok">Verified</span>
        </div>

        {showStatDetails && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            padding: '0.75rem',
            background: 'var(--bg-surface-subtle)',
            borderRadius: '4px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}>
            <div>
              <strong>1. Promotional Markdowns (p &lt; 10⁻¹⁵):</strong>
              <div>Welch's t-test score of 14.82 confirms that price cuts generate a real, non-random surge in store unit sales.</div>
            </div>
            <div>
              <strong>2. Welfare Benefit Dates (p &lt; 10⁻¹¹):</strong>
              <div>Welch's t-test score of 9.34 proves that food stamp disbursement days reliably trigger grocery sales rushes.</div>
            </div>
          </div>
        )}

        {/* Technical Parameters toggle */}
        <div style={{ marginTop: '0.75rem' }}>
          <button
            onClick={() => setShowTechnicalParams(!showTechnicalParams)}
            className="btn btn-secondary btn-sm"
          >
            <Scale size={13} />
            {showTechnicalParams ? 'Hide Technical Parameters' : 'View Technical Parameters'}
          </button>

          {showTechnicalParams && (
            <div className="table-container" style={{ marginTop: '0.75rem' }}>
              <table className="data-table" style={{ minWidth: '500px' }}>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {hyperparameters.map((hp, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{hp.param}</td>
                      <td className="font-mono">{hp.value}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{hp.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
