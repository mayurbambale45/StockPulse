import React from 'react';
import {
  TrendingUp,
  Activity,
  Package,
  Layers,
  FileSpreadsheet,
  Server,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isBackendLive: boolean;
  onRefreshHealth: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isBackendLive,
  onRefreshHealth,
  theme,
  onToggleTheme,
}) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'forecaster', label: 'Sales Forecast', icon: TrendingUp },
    { id: 'inventory', label: 'Stock & Reorder', icon: Package },
    { id: 'supplychain', label: 'Discounts & Delivery', icon: Layers },
    { id: 'benchmarks', label: 'Forecast Accuracy', icon: Sparkles },
    { id: 'batch', label: 'Multi-Item Forecast', icon: FileSpreadsheet },
  ];

  return (
    <header style={{
      background: 'var(--header-bg)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      transition: 'background-color 0.2s ease, border-color 0.2s ease',
    }}>
      {/* Top Bar: Brand, Status, Day/Dark Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'var(--primary)',
            color: 'var(--primary-btn-text)',
            width: '30px',
            height: '30px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <TrendingUp size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em', color: 'var(--text-main)' }}>
                Forecast Engine
              </span>
              <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                Retail Portal
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Connection Status */}
          <button
            onClick={onRefreshHealth}
            title="Click to check connection to backend"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              background: isBackendLive ? 'var(--status-ok-bg)' : 'var(--status-warning-bg)',
              border: `1px solid ${isBackendLive ? 'var(--status-ok-border)' : 'var(--status-warning-border)'}`,
              color: isBackendLive ? 'var(--status-ok-text)' : 'var(--status-warning-text)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            <span className={`pulse-dot ${isBackendLive ? 'online' : 'demo'}`} />
            <Server size={13} />
            <span>{isBackendLive ? 'Online' : 'Demo Mode'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Dark Mode'}
            className="btn btn-secondary"
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
            }}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={14} color="#F59E0B" />
                <span>Day</span>
              </>
            ) : (
              <>
                <Moon size={14} color="#6366F1" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        gap: '0.25rem',
        overflowX: 'auto',
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.75rem 0.9rem',
                border: 'none',
                background: 'transparent',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                borderBottom: isActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'color 0.15s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <Icon size={15} color={isActive ? 'var(--accent-blue)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
