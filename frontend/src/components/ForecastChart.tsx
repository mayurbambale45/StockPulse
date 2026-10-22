import React, { useState } from 'react';
import type { ForecastPoint } from '../types';

interface ForecastChartProps {
  productId: string;
  storeId: string;
  points: ForecastPoint[];
  historicalSales?: number[];
  basePrice?: number;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  productId,
  storeId,
  points,
  historicalSales = [18.2, 19.5, 21.0, 22.4, 20.1, 23.8, 25.4, 22.1, 21.5, 28.9, 34.2, 23.0],
  basePrice = 3.48,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Combine historical and forecast points into one coherent timeline
  const histPoints = historicalSales.map((val, idx) => ({
    label: `M-${12 - idx}`,
    date: `2015-${String(idx + 1).padStart(2, '0')}-28`,
    value: val,
    isForecast: false,
    confidence: 'observed' as const,
  }));

  const forePoints = points.map((p, idx) => ({
    label: `M+${idx + 1}`,
    date: p.date,
    value: p.predictedSales,
    isForecast: true,
    confidence: p.confidence,
  }));

  const allPoints = [...histPoints, ...forePoints];

  // SVG dimensions
  const width = 840;
  const height = 300;
  const padding = { top: 25, right: 35, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...allPoints.map((p) => p.value), 40) * 1.15;
  const minVal = 0;

  const getX = (index: number) => padding.left + (index / (allPoints.length - 1)) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;

  // Paths
  const histPathD = histPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.value)}`)
    .join(' ');

  const bridgeIndex = histPoints.length - 1;
  const forecastPathD = [
    `M ${getX(bridgeIndex)} ${getY(histPoints[bridgeIndex].value)}`,
    ...forePoints.map((p, i) => `L ${getX(histPoints.length + i)} ${getY(p.value)}`),
  ].join(' ');

  // Shaded area for forecast uncertainty bounds
  const upperBounds = forePoints.map((p, i) => {
    const errorMargin = p.confidence === 'high' ? 0.08 : p.confidence === 'medium' ? 0.14 : 0.22;
    return { x: getX(histPoints.length + i), y: getY(p.value * (1 + errorMargin)) };
  });

  const lowerBounds = forePoints.map((p, i) => {
    const errorMargin = p.confidence === 'high' ? 0.08 : p.confidence === 'medium' ? 0.14 : 0.22;
    return { x: getX(histPoints.length + i), y: getY(Math.max(0, p.value * (1 - errorMargin))) };
  });

  const boundsAreaD = [
    `M ${upperBounds[0].x} ${upperBounds[0].y}`,
    ...upperBounds.map((pt) => `L ${pt.x} ${pt.y}`),
    ...lowerBounds.reverse().map((pt) => `L ${pt.x} ${pt.y}`),
    'Z',
  ].join(' ');

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Sales Trajectory & Forecast Horizon ({productId} @ {storeId})
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            12-month observed historical demand followed by {points.length}-month LightGBM model prediction
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '2px', background: '#94A3B8' }} />
            <span style={{ color: 'var(--text-muted)' }}>Observed Sales</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '2px', background: '#2563EB' }} />
            <span style={{ color: '#2563EB', fontWeight: 600 }}>Calibrated Forecast</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '8px', background: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.3)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Confidence Interval</span>
          </div>
        </div>
      </div>

      {/* SVG Time Series */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', minWidth: '640px', display: 'block' }}
        >
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padding.top + chartHeight * (1 - pct);
            const val = Math.round(minVal + pct * (maxVal - minVal));
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="var(--chart-grid)"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  fill="var(--text-muted)"
                  fontSize="11"
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Forecast separation line */}
          <line
            x1={getX(bridgeIndex)}
            y1={padding.top}
            x2={getX(bridgeIndex)}
            y2={height - padding.bottom}
            stroke="var(--border-strong)"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <text
            x={getX(bridgeIndex) + 6}
            y={padding.top + 10}
            fill="var(--text-muted)"
            fontSize="10"
            fontWeight="600"
            letterSpacing="0.04em"
          >
            FORECAST ORIGIN
          </text>

          {/* Uncertainty bounds */}
          {upperBounds.length > 0 && (
            <path d={boundsAreaD} fill="var(--accent-blue-subtle)" />
          )}

          {/* Historical line */}
          <path
            d={histPathD}
            fill="none"
            stroke="var(--chart-hist-line)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Forecast line */}
          <path
            d={forecastPathD}
            fill="none"
            stroke="var(--accent-blue)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Node points */}
          {allPoints.map((pt, i) => {
            const cx = getX(i);
            const cy = getY(pt.value);
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : pt.isForecast ? 4 : 3}
                  fill={pt.isForecast ? 'var(--accent-blue)' : 'var(--chart-hist-line)'}
                  stroke="var(--bg-surface)"
                  strokeWidth="1.5"
                />

                {(i % 2 === 0 || i === allPoints.length - 1) && (
                  <text
                    x={cx}
                    y={height - padding.bottom + 16}
                    fill={pt.isForecast ? 'var(--accent-blue)' : 'var(--text-muted)'}
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontWeight={pt.isForecast ? '600' : '400'}
                  >
                    {pt.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && allPoints[hoveredIndex] && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: `${Math.min(75, Math.max(15, (hoveredIndex / allPoints.length) * 100))}%`,
              transform: 'translateX(-50%)',
              background: 'var(--chart-tooltip-bg)',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--card-shadow)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.75rem',
              pointerEvents: 'none',
              zIndex: 10,
              fontSize: '0.8125rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.2rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{allPoints[hoveredIndex].date}</span>
              <span
                className={`badge ${allPoints[hoveredIndex].isForecast ? 'badge-ok' : 'badge-info'}`}
                style={{ fontSize: '0.65rem' }}
              >
                {allPoints[hoveredIndex].isForecast ? `Horizon ${allPoints[hoveredIndex].label}` : 'Observed'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                {allPoints[hoveredIndex].value}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>units / month</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Est. Gross Revenue: ${(allPoints[hoveredIndex].value * basePrice).toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
