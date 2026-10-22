import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  comparison?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  comparison,
  trend = 'positive',
  icon: Icon,
  subtitle,
}) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </span>
        <Icon size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', flexWrap: 'wrap' }}>
        <span className="metric-value" style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {unit}
          </span>
        )}
      </div>

      {comparison && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '0.1rem 0.35rem',
              borderRadius: '4px',
              fontWeight: 600,
              background: trend === 'positive' ? 'var(--status-ok-bg)' : 'var(--status-critical-bg)',
              color: trend === 'positive' ? 'var(--status-ok-text)' : 'var(--status-critical-text)',
              border: `1px solid ${trend === 'positive' ? 'var(--status-ok-border)' : 'var(--status-critical-border)'}`,
              fontSize: '0.7rem',
            }}
          >
            {comparison}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>vs traditional method</span>
        </div>
      )}

      {subtitle && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.3 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
