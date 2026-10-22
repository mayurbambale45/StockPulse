import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OverviewPage } from './pages/OverviewPage';
import { ForecasterPage } from './pages/ForecasterPage';
import { InventoryAlertsPage } from './pages/InventoryAlertsPage';
import { SupplyChainPage } from './pages/SupplyChainPage';
import { ModelBenchmarkPage } from './pages/ModelBenchmarkPage';
import { BatchForecastPage } from './pages/BatchForecastPage';
import { checkBackendHealth } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isBackendLive, setIsBackendLive] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('forecast_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('forecast_theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const refreshHealth = async () => {
    const { isOnline } = await checkBackendHealth();
    setIsBackendLive(isOnline);
  };

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendLive={isBackendLive}
        onRefreshHealth={refreshHealth}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'overview' && (
          <OverviewPage onNavigate={(tab) => setActiveTab(tab)} isBackendLive={isBackendLive} />
        )}
        {activeTab === 'forecaster' && <ForecasterPage />}
        {activeTab === 'inventory' && <InventoryAlertsPage />}
        {activeTab === 'supplychain' && <SupplyChainPage />}
        {activeTab === 'benchmarks' && <ModelBenchmarkPage />}
        {activeTab === 'batch' && <BatchForecastPage />}
      </main>

      {/* Clean Enterprise Footer */}
      <footer className="app-footer">
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              Forecast Engine
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {' '}— Multi-Horizon Demand Prediction & Dynamic Inventory Replenishment Platform
            </span>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Enterprise Microservice Architecture · Sub-15ms Multi-Horizon Inference
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
