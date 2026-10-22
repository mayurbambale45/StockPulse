import React from 'react';
import { Database, Calendar, Tag, DollarSign, Users, Award, X } from 'lucide-react';

interface FeatureCatalogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  storeId: string;
  price?: number;
}

export const FeatureCatalogDrawer: React.FC<FeatureCatalogDrawerProps> = ({
  isOpen,
  onClose,
  productId,
  storeId,
  price = 3.48,
}) => {
  if (!isOpen) return null;

  const featureGroups = [
    {
      category: 'Store & Department Hierarchy',
      icon: Database,
      count: 4,
      description: 'Identifies store location and merchandise department.',
      features: [
        { name: 'Department', val: productId.split('_').slice(0, 2).join('_') },
        { name: 'Category', val: productId.split('_')[0] },
        { name: 'Store ID', val: storeId },
        { name: 'State', val: storeId.split('_')[0] },
      ],
    },
    {
      category: 'Calendar & Seasonality',
      icon: Calendar,
      count: 4,
      description: 'Tracks month-to-month changes and holiday shopping rhythms.',
      features: [
        { name: 'Target Month', val: 'July' },
        { name: 'Quarter', val: 'Q3' },
        { name: 'Cycle Sin', val: '-0.50' },
        { name: 'Cycle Cos', val: '-0.86' },
      ],
    },
    {
      category: 'Recent Sales Velocity',
      icon: Tag,
      count: 12,
      description: 'Past sales from 1 month ago up to 12 months ago to spot trends.',
      features: [
        { name: 'Last Month', val: '24 units' },
        { name: '2 Months Ago', val: '23 units' },
        { name: '3 Months Ago', val: '25 units' },
        { name: '6 Months Ago', val: '21 units' },
        { name: '1 Year Ago', val: '29 units' },
      ],
    },
    {
      category: 'Moving Averages & Fluctuations',
      icon: Award,
      count: 6,
      description: 'Smooths out temporary random spikes to find normal steady demand.',
      features: [
        { name: '3-Mo Avg', val: '23.9 units' },
        { name: '6-Mo Avg', val: '22.8 units' },
        { name: '12-Mo Avg', val: '23.4 units' },
        { name: 'Variation', val: '±3.8 units' },
      ],
    },
    {
      category: 'Price & Markdown Signals',
      icon: DollarSign,
      count: 2,
      description: 'Measures how discounts boost sales volume.',
      features: [
        { name: 'Shelf Price', val: `$${price.toFixed(2)}` },
        { name: 'Discount Status', val: 'Regular Price' },
      ],
    },
    {
      category: 'Welfare Benefit Days',
      icon: Users,
      count: 3,
      description: 'Detects state food stamp disbursement days that drive grocery rushes.',
      features: [
        { name: 'California Cycle', val: storeId.startsWith('CA') ? 'Active (Day 1-10)' : 'Inactive' },
        { name: 'Texas Cycle', val: storeId.startsWith('TX') ? 'Active (Day 1-15)' : 'Inactive' },
        { name: 'Wisconsin Cycle', val: storeId.startsWith('WI') ? 'Active (Day 2-15)' : 'Inactive' },
      ],
    },
    {
      category: 'Holidays & Events',
      icon: Calendar,
      count: 4,
      description: 'Flags major holidays and sporting events.',
      features: [
        { name: 'Cultural Event', val: 'None' },
        { name: 'National Holiday', val: 'July 4th Window' },
        { name: 'Religious Event', val: 'None' },
        { name: 'Sporting Event', val: 'None' },
      ],
    },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '480px',
      maxWidth: '92vw',
      background: 'var(--bg-surface)',
      borderLeft: '1px solid var(--border-medium)',
      boxShadow: 'var(--card-shadow)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-surface-subtle)',
      }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Demand Factors
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Data points used to predict sales for {productId} @ {storeId}
          </p>
        </div>
        <button
          onClick={onClose}
          className="btn btn-ghost"
          style={{ padding: '0.35rem' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div style={{
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {featureGroups.map((group, idx) => {
          const Icon = group.icon;
          return (
            <div key={idx} style={{
              padding: '0.75rem',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              background: 'var(--bg-surface)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Icon size={14} color="var(--accent-blue)" />
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                    {group.category}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {group.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '0.35rem',
              }}>
                {group.features.map((feat, fIdx) => (
                  <div
                    key={fIdx}
                    style={{
                      background: 'var(--bg-surface-subtle)',
                      padding: '0.35rem 0.5rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {feat.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                      {feat.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
