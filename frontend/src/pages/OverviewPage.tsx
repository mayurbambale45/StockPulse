import React, { useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Warehouse,
} from 'lucide-react';
import { HORIZON_BENCHMARKS } from '../services/api';

interface OverviewPageProps {
  onNavigate: (tab: string) => void;
  isBackendLive?: boolean;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const [showMoreDetails, setShowMoreDetails] = useState<boolean>(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Store Dashboard
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Sales predictions and stock health overview.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('forecaster')} className="btn btn-primary btn-sm">
            Forecast Sales
            <ArrowRight size={14} />
          </button>
          <button onClick={() => onNavigate('inventory')} className="btn btn-secondary btn-sm">
            View Stock Alerts
          </button>
        </div>
      </div>

      {/* 4 Core KPIs */}
      <div className="grid-cols-4 gap-4">
        <MetricCard
          title="Forecast Accuracy"
          value="71.1"
          unit="%"
          comparison="+34.6%"
          trend="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Storage Savings"
          value="18.4"
          unit="%"
          comparison="Saved"
          trend="positive"
          icon={Warehouse}
        />
        <MetricCard
          title="Stock on Shelf"
          value="98.5"
          unit="%"
          comparison="In Stock"
          trend="positive"
          icon={ShieldCheck}
        />
        <MetricCard
          title="Lookup Speed"
          value="11.4"
          unit="ms"
          comparison="Instant"
          trend="positive"
          icon={Zap}
        />
      </div>

      {/* Two Column Layout: Comparison & Category Sales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.25rem' }}>
        
        {/* Comparison Table */}
        <div className="card">
          <div style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              System Comparison
            </h3>
          </div>

          <div className="table-container">
            <table className="data-table" style={{ minWidth: '420px' }}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Old Store Method</th>
                  <th>AI Forecast Engine</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Forecast Horizon</td>
                  <td style={{ color: 'var(--text-muted)' }}>1 Month only</td>
                  <td style={{ fontWeight: 600, color: '#047857' }}>Up to 12 Months ahead</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Accuracy</td>
                  <td style={{ color: '#B91C1C' }}>Frequent misses (44% error)</td>
                  <td style={{ fontWeight: 600, color: '#047857' }}>High accuracy (28% error)</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Discounts & Promos</td>
                  <td style={{ color: 'var(--text-muted)' }}>Manual buyer guess</td>
                  <td style={{ fontWeight: 600, color: '#1D4ED8' }}>Tracks price impact automatically</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Running Out of Stock</td>
                  <td style={{ color: '#B91C1C' }}>8.4% of peak season</td>
                  <td style={{ fontWeight: 600, color: '#047857' }}>Under 1.8% of items</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Speed</td>
                  <td style={{ color: 'var(--text-muted)' }}>Hours of manual spreadsheets</td>
                  <td style={{ fontWeight: 600, color: '#1D4ED8' }}>Instant (milliseconds)</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Warehouse Delivery</td>
                  <td style={{ color: 'var(--text-muted)' }}>Unplanned shipments</td>
                  <td style={{ fontWeight: 600, color: '#047857' }}>Scheduled with regional hubs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales by Category & Region */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Sales by Category
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Groceries & Food</span>
                <span style={{ fontWeight: 700, color: '#065F46' }}>68.3%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '68.3%', height: '100%', background: '#059669' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Household Essentials</span>
                <span style={{ fontWeight: 700, color: '#1E40AF' }}>21.4%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '21.4%', height: '100%', background: '#2563EB' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Hobbies & Leisure</span>
                <span style={{ fontWeight: 700, color: '#6B21A8' }}>10.3%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '10.3%', height: '100%', background: '#7C3AED' }} />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Monthly Sales by Store Region
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>California</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.1rem' }}>48.5k units</div>
              </div>
              <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Wisconsin</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.1rem' }}>44.4k units</div>
              </div>
              <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Texas</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.1rem' }}>40.5k units</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 12-Month Accuracy Tiles with Read More */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Accuracy for the Next 12 Months
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Accuracy remains stable even up to 12 months in advance.
              <button
                onClick={() => setShowMoreDetails(!showMoreDetails)}
                className="btn-readmore"
              >
                {showMoreDetails ? 'Read less' : 'Read more'}
              </button>
            </p>
          </div>
          <span className="badge badge-ok">12 Months Tested</span>
        </div>

        {showMoreDetails && (
          <div style={{
            padding: '0.75rem',
            background: 'var(--bg-surface-subtle)',
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.75rem',
            lineHeight: 1.5,
          }}>
            Unlike traditional tools that guess next month by stacking previous guesses (which makes error compound rapidly), our engine uses independent direct models for each month. This keeps month-12 error capped under 33% instead of blowing past 45%.
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '0.5rem',
        }}>
          {HORIZON_BENCHMARKS.map((hb) => (
            <div
              key={hb.horizon}
              style={{
                background: 'var(--bg-surface-subtle)',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                <span>Month +{hb.horizon}</span>
                <span style={{ fontWeight: 600, color: hb.calibratedWape < 30 ? '#047857' : '#92400E' }}>
                  {hb.calibratedWape}% err
                </span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${(hb.calibratedWape / 45) * 100}%`, height: '100%', background: '#2563EB' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
