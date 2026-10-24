import React, { useState } from 'react';
import {
  DollarSign,
  Truck,
  Activity,
} from 'lucide-react';

export const SupplyChainPage: React.FC = () => {
  const [promoDiscount, setPromoDiscount] = useState<number>(25);
  const [showBullwhipMore, setShowBullwhipMore] = useState<boolean>(false);
  const [showPromoMore, setShowPromoMore] = useState<boolean>(false);

  const volumeUplift = Math.round(promoDiscount * 1.92);
  const cannibalizationRate = 74;
  const netIncrementalAisleRevenue = Math.max(0, Math.round(volumeUplift * (1 - cannibalizationRate / 100)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Discounts & Delivery Insights
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          How promotions, benefit days, and warehouse logistics affect sales demand.
        </p>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid-cols-3 gap-4">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={15} color="var(--primary)" />
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Order Whiplash Reduction
              </h4>
            </div>
            <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
              Estimated Benefit (-62%)
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Filters out temporary holiday spikes so upstream warehouses avoid panic-ordering double the required inventory.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <DollarSign size={15} color="#059669" />
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Aisle Cannibalization
              </h4>
            </div>
            <span className="badge badge-ok" style={{ fontSize: '0.65rem' }}>
              Measured M5 Finding (74%)
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Empirical data confirms 74% of grocery promotional volume growth substitutes other items in the same aisle rather than adding new shoppers.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Truck size={15} color="#2563EB" />
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Regional Lead Time
              </h4>
            </div>
            <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
              Estimated Benefit (24–36h)
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Pre-positioning stock closer to store clusters cuts transit delivery time and lowers estimated freight costs by 12–18%.
          </p>
        </div>
      </div>

      {/* Why Stores Over-Order: The Bullwhip Effect */}
      <div className="card">
        <div style={{ marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Why Stores Over-Order (Order Whiplash)
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Small customer rushes often cause suppliers to over-produce.
            <button
              onClick={() => setShowBullwhipMore(!showBullwhipMore)}
              className="btn-readmore"
            >
              {showBullwhipMore ? 'Read less' : 'Read more'}
            </button>
          </p>
        </div>

        {showBullwhipMore && (
          <div style={{
            padding: '0.75rem',
            background: 'var(--bg-surface-subtle)',
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.85rem',
            lineHeight: 1.5,
          }}>
            When a store experiences a temporary rush (like a holiday weekend), store managers using simple moving averages assume that demand has doubled for the foreseeable future. They place oversized supplier orders, which get amplified upstream. Our AI engine isolates temporary holiday dates so your baseline order stays steady.
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
          gap: '0.75rem',
        }}>
          <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              1. Customer Checkout
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', margin: '0.15rem 0' }}>
              Normal Store Sales
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Actual checkout variance: 1.0×
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              2. Store Backroom
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', margin: '0.15rem 0' }}>
              Store Restock Orders
            </div>
            <div style={{ fontSize: '0.75rem', color: '#92400E' }}>
              Safety buffers increase variance to 1.65×
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              3. Regional Warehouse
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', margin: '0.15rem 0' }}>
              Old System (Whiplash)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#991B1B' }}>
              Inflated orders spike variance to 2.80×
            </div>
          </div>

          <div style={{ background: 'var(--status-ok-bg)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--status-ok-border)' }}>
            <div style={{ fontSize: '0.7rem', color: '#065F46', textTransform: 'uppercase', fontWeight: 600 }}>
              4. AI Forecast Engine
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#065F46', margin: '0.15rem 0' }}>
              Balanced Orders
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065F46' }}>
              Calm orders stabilized at 1.06× (-62%)
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Discount Simulator & Benefit Cycles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.25rem' }}>
        
        {/* Discount Simulator */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Discount Calculator
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Estimate sales boost when lowering prices.
              <button
                onClick={() => setShowPromoMore(!showPromoMore)}
                className="btn-readmore"
              >
                {showPromoMore ? 'Read less' : 'Read more'}
              </button>
            </p>
          </div>

          {showPromoMore && (
            <div style={{
              padding: '0.65rem',
              background: 'var(--bg-surface-subtle)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
            }}>
              When a store puts an item on a 25% discount, unit volume jumps +48%. However, 74% of that surge comes from customers who would have bought a different brand in the same aisle. Total aisle profits often stay flat unless category mix is monitored.
            </div>
          )}

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Test a Promotional Discount</label>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                {promoDiscount}% Off
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={promoDiscount}
              onChange={(e) => setPromoDiscount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            textAlign: 'center',
          }}>
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.65rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sales Boost</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#047857' }}>
                +{volumeUplift}%
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.65rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cannibalized</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#991B1B' }}>
                74%
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.65rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Net Lift</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                +{netIncrementalAisleRevenue}%
              </div>
            </div>
          </div>
        </div>

        {/* Benefit Schedule */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Welfare Benefit Disbursement Schedules
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Benefit days that consistently cause grocery rushes.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>California</span>
                <span className="badge badge-ok">Days 1 to 10</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Disbursements concentrated in the first 10 days of the month.
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Texas</span>
                <span className="badge badge-info">Days 1 to 15</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Spread across 15 days, resulting in a steady two-week grocery surge.
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Wisconsin</span>
                <span className="badge badge-warning">Days 2 to 15</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Mid-month dairy and pantry restocking pattern.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
