import React, { useState } from 'react';
import {
  getInitialInventoryItems,
  calculateDynamicROP,
  classifyStockAlert,
} from '../services/api';
import type { InventoryItem, AlertTier } from '../types';
import { POModal } from '../components/POModal';
import {
  Sliders,
  Search,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const InventoryAlertsPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(() => getInitialInventoryItems());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPOItem, setSelectedPOItem] = useState<InventoryItem | null>(null);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [sortByUrgency, setSortByUrgency] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  // Live Simulator state
  const [simDemand, setSimDemand] = useState<number>(30);
  const [simLeadTime, setSimLeadTime] = useState<number>(7);
  const [simZAlpha, setSimZAlpha] = useState<number>(2.054);
  const [simCurrentStock, setSimCurrentStock] = useState<number>(18);

  const simCalc = calculateDynamicROP(simDemand, simLeadTime, simZAlpha);
  const simMaxStock = Math.round(simCalc.rop * 2.8);
  const simAlert = classifyStockAlert(simCurrentStock, simCalc.rop, simMaxStock);

  const handleConfirmOrder = (itemId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          const newStock = it.currentStock + quantity;
          const { tier, action } = classifyStockAlert(newStock, it.rop, it.maxStock);
          return {
            ...it,
            currentStock: newStock,
            status: tier,
            triggeredAction: action,
            recommendedOrder: 0,
            orderCalculationExplanation: `Replenished +${quantity} units via simulated PO. Stock is now healthy.`,
          };
        }
        return it;
      })
    );
  };

  const filteredItems = items
    .filter((item) => {
      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesTier = selectedTier === 'ALL' || item.status === selectedTier;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.storeId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesTier && matchesSearch;
    })
    .sort((a, b) => {
      if (!sortByUrgency) return 0;
      const rank: Record<AlertTier, number> = { CRITICAL: 0, WARNING: 1, OVERSTOCK: 2, OK: 3 };
      return rank[a.status] - rank[b.status];
    });

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const criticalCount = items.filter((i) => i.status === 'CRITICAL').length;
  const warningCount = items.filter((i) => i.status === 'WARNING').length;
  const okCount = items.filter((i) => i.status === 'OK').length;
  const overstockCount = items.filter((i) => i.status === 'OVERSTOCK').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Stock & Reorder Alerts
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Monitor inventory levels and place replenishment orders.
          </p>
        </div>

        <button
          onClick={() => setShowSimulator(!showSimulator)}
          className="btn btn-secondary btn-sm"
        >
          <Sliders size={14} />
          {showSimulator ? 'Hide Reorder Calculator' : 'Reorder Calculator'}
          {showSimulator ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Filter Tabs / Quick Counts */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        flexWrap: 'wrap',
      }}>
        {[
          { id: 'ALL', label: 'All', count: items.length },
          { id: 'CRITICAL', label: 'Urgent', count: criticalCount },
          { id: 'WARNING', label: 'Low Stock', count: warningCount },
          { id: 'OK', label: 'Healthy', count: okCount },
          { id: 'OVERSTOCK', label: 'Overstock', count: overstockCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTier(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              border: selectedTier === tab.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              background: selectedTier === tab.id ? 'var(--primary)' : 'var(--bg-surface)',
              color: selectedTier === tab.id ? 'var(--primary-btn-text)' : 'var(--text-main)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.12s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{tab.label}</span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.05rem 0.35rem',
              borderRadius: '4px',
              background: selectedTier === tab.id ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-surface-subtle)',
              color: selectedTier === tab.id ? 'var(--primary-btn-text)' : 'var(--text-secondary)',
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Reorder Calculator (Collapsible) */}
      {showSimulator && (
        <div className="card">
          <div style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Reorder Point (ROP) Calculator
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Test how delivery speed and sales demand change when you need to reorder.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">Monthly Demand</label>
                <span className="font-mono" style={{ fontWeight: 600 }}>{simDemand} units</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={simDemand}
                onChange={(e) => setSimDemand(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">Supplier Delivery Time</label>
                <span className="font-mono" style={{ fontWeight: 600 }}>{simLeadTime} days</span>
              </div>
              <input
                type="range"
                min="2"
                max="21"
                value={simLeadTime}
                onChange={(e) => setSimLeadTime(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Customer In-Stock Target</label>
              <select
                className="form-select"
                value={simZAlpha}
                onChange={(e) => setSimZAlpha(parseFloat(e.target.value))}
              >
                <option value="1.645">95% Availability</option>
                <option value="2.054">98% Standard Target</option>
                <option value="2.326">99% High Priority</option>
              </select>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">Current Stock on Shelf</label>
                <span className="font-mono" style={{ fontWeight: 600 }}>{simCurrentStock} units</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={simCurrentStock}
                onChange={(e) => setSimCurrentStock(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
              />
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '0.75rem 0.85rem',
            borderRadius: '6px',
            background: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`badge badge-${simAlert.tier.toLowerCase()}`}>
                {simAlert.tier}
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Order Point: {simCalc.rop} units (Buffer: {simCalc.safetyStock} units)
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <strong>Status:</strong> {simAlert.action}
            </div>
          </div>
        </div>
      )}

      {/* Main Stock Table */}
      <div className="card">
        {/* Search & Filter Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, maxWidth: '320px', minWidth: '200px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search product or store..."
                className="form-input"
                style={{ paddingLeft: '28px', fontSize: '0.8125rem', width: '100%', height: '34px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setSortByUrgency(!sortByUrgency);
                setCurrentPage(1);
              }}
              className={`btn btn-sm ${sortByUrgency ? 'btn-primary' : 'btn-secondary'}`}
              title="Click to toggle sorting by risk severity"
            >
              {sortByUrgency ? '✓ Sorted: Urgent First' : 'Sort: Product Order'}
            </button>
            <select
              className="form-select"
              style={{ fontSize: '0.8125rem', height: '34px' }}
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Departments</option>
              <option value="FOODS">Groceries</option>
              <option value="HOUSEHOLD">Household</option>
              <option value="HOBBIES">Hobbies</option>
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {filteredItems.length} items
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table" style={{ minWidth: '850px' }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Store</th>
                <th>Current Stock</th>
                <th>Reorder Threshold</th>
                <th>Lead-Time Demand</th>
                <th>Safety Buffer</th>
                <th>Status</th>
                <th>Order Calculation & Action</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No products match the selected filter.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.productId}</div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                        {item.storeId}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        color: item.status === 'CRITICAL' ? 'var(--status-critical-text)' : item.status === 'WARNING' ? 'var(--status-warning-text)' : 'var(--text-main)',
                      }}>
                        {item.currentStock} units
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.rop}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.leadTimeDemand}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{item.safetyStock}</td>
                    <td>
                      <span className={`badge badge-${item.status.toLowerCase()}`}>
                        {item.status === 'CRITICAL' ? 'Urgent' : item.status === 'WARNING' ? 'Low' : item.status === 'OK' ? 'Healthy' : 'Overstock'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.1rem' }}>
                        {item.recommendedOrder > 0 ? `Order ${item.recommendedOrder} units` : 'No order needed'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {item.orderCalculationExplanation}
                      </div>
                    </td>
                    <td>
                      {item.currentStock < item.rop ? (
                        <button
                          onClick={() => setSelectedPOItem(item)}
                          className="btn btn-primary btn-sm"
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          <ShoppingCart size={12} />
                          Order ({item.recommendedOrder})
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 500 }}>
                          Adequate
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.85rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.8125rem',
          }}>
            <span style={{ color: 'var(--text-muted)' }}>
              Page {currentPage} of {totalPages} ({filteredItems.length} total SKUs)
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simple Order Modal */}
      <POModal
        item={selectedPOItem}
        onClose={() => setSelectedPOItem(null)}
        onConfirmOrder={handleConfirmOrder}
      />
    </div>
  );
};
