import React, { useState } from 'react';
import { CATALOG_PRODUCTS } from '../services/api';
import {
  DollarSign,
  Truck,
  Activity,
  Tag,
} from 'lucide-react';

export const SupplyChainPage: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState<string>('FOODS_1_001');
  const [promoDiscount, setPromoDiscount] = useState<number>(20);
  const [showBullwhipMore, setShowBullwhipMore] = useState<boolean>(false);
  const [showPromoMore, setShowPromoMore] = useState<boolean>(false);

  const selectedProd = CATALOG_PRODUCTS.find((p) => p.id === selectedProductId) || CATALOG_PRODUCTS[0];

  // Category price elasticity:
  // - Groceries/Foods: highly elastic (-1.65), shoppers notice price cuts immediately
  // - Household essentials: moderately elastic (-1.20)
  // - Hobbies: less elastic (-0.95), demand is niche / hobby driven
  const elasticityMap = {
    FOODS: 1.65,
    HOUSEHOLD: 1.20,
    HOBBIES: 0.95,
  };
  const elasticity = elasticityMap[selectedProd.category] || 1.35;

  // Cannibalization rate across category aisles:
  // Groceries have high store-brand/alternative substitution (74%)
  // Household has 52% substitution
  // Hobbies have low substitution (28%)
  const cannibalizationMap = {
    FOODS: 74,
    HOUSEHOLD: 52,
    HOBBIES: 28,
  };
  const cannibalizationRate = cannibalizationMap[selectedProd.category] || 50;

  // Real calculations:
  // Volume Lift % = discount % * elasticity
  const volumeUplift = Math.round(promoDiscount * elasticity);
  
  // Baseline monthly metrics
  const baseMonthlyUnits = selectedProd.avgMonthlySales;
  const basePrice = selectedProd.basePrice;
  const promoPrice = Math.round(basePrice * (1 - promoDiscount / 100) * 100) / 100;
  
  // Promoted units
  const promoUnits = Math.round(baseMonthlyUnits * (1 + volumeUplift / 100));
  const additionalUnits = promoUnits - baseMonthlyUnits;
  
  // Cannibalized units from neighbor aisle SKUs
  const cannibalizedUnits = Math.round(additionalUnits * (cannibalizationRate / 100));
  const netNewUnits = additionalUnits - cannibalizedUnits;
  
  // Net Aisle Volume Lift %
  const netAisleLiftPercent = Math.round((netNewUnits / baseMonthlyUnits) * 100);

  // Revenue comparison
  const baseRevenue = Math.round(baseMonthlyUnits * basePrice);
  const promoRevenue = Math.round(promoUnits * promoPrice);
  const revenueDifference = promoRevenue - baseRevenue;
  const revenueDiffPercent = baseRevenue > 0 ? Math.round((revenueDifference / baseRevenue) * 100) : 0;

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
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Tag size={16} color="var(--accent-blue)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Retail Promotion & Discount Calculator
              </h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Simulate price markdowns and evaluate category cannibalization risk.
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
              padding: '0.75rem',
              background: 'var(--bg-surface-subtle)',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}>
              <strong>Understanding Price Elasticity & Cannibalization:</strong>
              <div style={{ marginTop: '0.25rem' }}>
                • <strong>Groceries (Elasticity: 1.65×):</strong> Customers respond aggressively to discounts, but up to 74% of the volume lift substitutes adjacent brands in the same aisle rather than creating net new shoppers.
              </div>
              <div>
                • <strong>Household Goods (Elasticity: 1.20×):</strong> Moderate response with ~52% category substitution.
              </div>
              <div>
                • <strong>Hobbies & Leisure (Elasticity: 0.95×):</strong> Less price sensitive; promotions generate primarily genuine incremental interest.
              </div>
            </div>
          )}

          {/* Product Selector */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>
              Select Item to Discount
            </label>
            <select
              className="form-select"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              style={{ fontSize: '0.8125rem' }}
            >
              {CATALOG_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} (${prod.basePrice.toFixed(2)}) — {prod.category}
                </option>
              ))}
            </select>
          </div>

          {/* Discount Slider */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ fontWeight: 600 }}>Discount Percentage</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${basePrice.toFixed(2)}
                </span>
                <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#047857' }}>
                  ${promoPrice.toFixed(2)}
                </span>
                <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                  {promoDiscount}% Off
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={promoDiscount}
              onChange={(e) => setPromoDiscount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-blue)', marginTop: '0.3rem' }}
            />
          </div>

          {/* 3 Outcome Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            textAlign: 'center',
          }}>
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Item Volume Boost</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#047857', marginTop: '0.1rem' }}>
                +{volumeUplift}%
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {baseMonthlyUnits} → {promoUnits} units
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Aisle Cannibalized</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#991B1B', marginTop: '0.1rem' }}>
                {cannibalizationRate}%
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                ~{cannibalizedUnits} units stolen
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Net Aisle Lift</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '0.1rem' }}>
                +{netAisleLiftPercent}%
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                +{netNewUnits} net new units
              </div>
            </div>
          </div>

          {/* Financial Summary Pill */}
          <div style={{
            padding: '0.65rem 0.85rem',
            background: revenueDifference >= 0 ? 'var(--status-ok-bg)' : 'var(--status-warning-bg)',
            border: `1px solid ${revenueDifference >= 0 ? 'var(--status-ok-border)' : 'var(--status-warning-border)'}`,
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: revenueDifference >= 0 ? 'var(--status-ok-text)' : 'var(--status-warning-text)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.4rem',
          }}>
            <div>
              <strong>Monthly Revenue Impact:</strong>{' '}
              ${baseRevenue} → ${promoRevenue}{' '}
              ({revenueDifference >= 0 ? `+$${revenueDifference}` : `-$${Math.abs(revenueDifference)}`} / {revenueDiffPercent > 0 ? `+${revenueDiffPercent}%` : `${revenueDiffPercent}%`})
            </div>
            <span style={{ fontWeight: 600 }}>
              {promoDiscount === 0 ? 'Regular Baseline' : revenueDifference >= 0 ? 'Volume-Accretive' : 'Margin Margin Risk'}
            </span>
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
