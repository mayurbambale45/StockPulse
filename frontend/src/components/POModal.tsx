import React, { useState } from 'react';
import type { InventoryItem } from '../types';
import { ShoppingCart, CheckCircle2, FileText, Send, X } from 'lucide-react';

interface POModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onConfirmOrder: (itemId: string, quantity: number) => void;
}

export const POModal: React.FC<POModalProps> = ({
  item,
  onClose,
  onConfirmOrder,
}) => {
  if (!item) return null;

  const [orderQty, setOrderQty] = useState<number>(item.recommendedOrder || 50);
  const [showEDI, setShowEDI] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const totalCost = (orderQty * item.unitPrice).toFixed(2);
  const poNumber = `PO-${item.storeId}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onConfirmOrder(item.id, orderQty);
      onClose();
    }, 1000);
  };

  const edi850Payload = `ISA*00*          *00*          *ZZ*WALMART_M5     *01*VENDOR_DC      *261022*1812*U*00401*000000001*0*P*>~
GS*PO*WALMART_M5*VENDOR_DC*20261022*1812*1*X*004010~
ST*850*0001~
BEG*00*NE*${poNumber}**20261022~
REF*IA*${item.storeId}~
N1*BY*SUPERCENTER ${item.storeId}~
N1*SE*REGIONAL DISTRIBUTION HUB~
PO1*1*${orderQty}*EA*${item.unitPrice}**VN*${item.productId}*IN*${item.name}~
PID*F****AUTOMATED REPLENISHMENT~
CTT*1~
SE*10*0001~
GE*1*1~
IEA*1*000000001~`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 150,
      padding: '1rem',
    }}>
      <div className="card" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '1.25rem',
        background: 'var(--bg-surface)',
        borderRadius: '8px',
        boxShadow: 'var(--card-shadow)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              background: 'var(--bg-surface-subtle)',
              padding: '0.4rem',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
            }}>
              <ShoppingCart size={16} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Order Restock
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {item.name} ({item.productId})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.3rem' }}>
            <X size={16} />
          </button>
        </div>

        {isSubmitted ? (
          <div style={{ padding: '1.75rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
            <CheckCircle2 size={36} color="#059669" />
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Order Placed Successfully
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Order {poNumber} has been transmitted to warehouse. Delivery in {item.leadTimeDays} days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Summary Details */}
            <div style={{
              background: 'var(--bg-surface-subtle)',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
              fontSize: '0.75rem',
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Destination</span>
                <span style={{ fontWeight: 600 }}>Store {item.storeId}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Unit Price</span>
                <span style={{ fontWeight: 600 }}>${item.unitPrice.toFixed(2)}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Current Stock</span>
                <span style={{ fontWeight: 600, color: item.status === 'CRITICAL' ? 'var(--status-critical-text)' : 'inherit' }}>
                  {item.currentStock} units
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Delivery Time</span>
                <span style={{ fontWeight: 600 }}>{item.leadTimeDays} days</span>
              </div>
            </div>

            {/* Order Quantity Input */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">Units to Order</label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Recommended: {item.recommendedOrder} units
                </span>
              </div>
              <input
                type="number"
                min="1"
                className="form-input"
                value={orderQty}
                onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            {/* Total Cost preview */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0.75rem',
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Cost</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>${totalCost}</span>
            </div>

            {/* Toggle EDI View */}
            <div>
              <button
                type="button"
                onClick={() => setShowEDI(!showEDI)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: 0 }}
              >
                <FileText size={12} />
                {showEDI ? 'Hide Technical EDI Details' : 'View Technical EDI Details'}
              </button>
              {showEDI && (
                <pre style={{
                  marginTop: '0.35rem',
                  padding: '0.5rem',
                  background: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  fontSize: '0.65rem',
                  color: 'var(--text-secondary)',
                  overflowX: 'auto',
                }}>
                  {edi850Payload}
                </pre>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.45rem', marginTop: '0.35rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                <Send size={13} />
                Confirm Order
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
