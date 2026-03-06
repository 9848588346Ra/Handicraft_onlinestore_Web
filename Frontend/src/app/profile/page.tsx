'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import type { OrderConfirmation } from '@/context/AppContext';
import Footer from '@/components/Footer';
import '@/styles/profilescreen.css';

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Cash on delivery',
  card: 'Card / Online payment',
  bank: 'Bank transfer',
};

const PAYMENT_OPTIONS = [
  { value: 'cash', label: 'Cash on delivery' },
  { value: 'card', label: 'Card / Online payment' },
  { value: 'bank', label: 'Bank transfer' },
];

function ProfileAvatar({ name }: { name: string }) {
  const initial = name.trim() ? name.trim().charAt(0).toUpperCase() : '?';
  return (
    <div className="profile-avatar" aria-hidden>
      <svg viewBox="0 0 100 100" className="profile-avatar-svg">
        <defs>
          <linearGradient id="profile-avatar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#profile-avatar-gradient)" />
        <text x="50" y="50" dominantBaseline="central" textAnchor="middle" fill="#ffffff" fontSize="44" fontWeight="600" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
          {initial}
        </text>
      </svg>
    </div>
  );
}

export default function ProfilePage() {
  const { currentUser, orderHistory, updateOrder, logout, refreshOrderHistory, cartItems } = useApp();
  const router = useRouter();
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ receiverName: '', phone: '', address: '', paymentMethod: 'cash' });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    document.title = 'Profile - Handicraft Online Store';
    return () => { document.title = 'Handicraft Online Store'; };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else {
      refreshOrderHistory();
    }
  }, [currentUser, router, refreshOrderHistory]);

  const startEdit = (order: OrderConfirmation) => {
    setEditingOrderId(order.orderId);
    setEditForm({
      receiverName: order.receiverName,
      phone: order.phone,
      address: order.address,
      paymentMethod: order.paymentMethod || 'cash',
    });
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingOrderId(null);
    setEditError('');
  };

  const saveEdit = async () => {
    if (!editingOrderId || !updateOrder) return;
    setEditError('');
    setEditSaving(true);
    const ok = await updateOrder(editingOrderId, editForm);
    setEditSaving(false);
    if (ok) setEditingOrderId(null);
    else setEditError('Failed to update order. Please try again.');
  };

  if (!currentUser) return null;

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-header-left">
          <button type="button" className="profile-header-brand" onClick={() => router.push('/')}>
            <img src="/images/logo.png" alt="" className="profile-logo" />
            <span className="profile-header-title">Profile</span>
          </button>
          <nav className="profile-nav">
            <button type="button" className="profile-nav-link" onClick={() => router.push('/')}>Home</button>
            <button type="button" className="profile-nav-link" onClick={() => router.push('/about')}>About us</button>
            <div className="profile-nav-dropdown">
              <button type="button" className="profile-nav-link" onClick={() => router.push('/products')}>Products</button>
              <span className="profile-nav-arrow">▼</span>
            </div>
            <button type="button" className="profile-nav-link" onClick={() => router.push('/contact')}>Contact</button>
            <span className="profile-nav-link profile-nav-link-active">Profile</span>
          </nav>
        </div>
        <div className="profile-header-right">
          <button type="button" className="profile-cart-btn" aria-label="Cart" onClick={() => router.push('/cart')}>
            <span className="profile-cart-icon">🛒</span>
            {cartItems.length > 0 && <span className="profile-cart-badge">{cartItems.reduce((s, i) => s + i.quantity, 0)}</span>}
          </button>
          <button type="button" className="profile-header-cta" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="profile-main">
        <div className="profile-hero">
          <div className="profile-hero-pattern" aria-hidden />
          <div className="profile-card profile-card-hero">
            <div className="profile-cover">
              <div className="profile-cover-shine" aria-hidden />
            </div>
            <div className="profile-info">
              <ProfileAvatar name={currentUser.name} />
              <p className="profile-badge">My Account</p>
              <h1 className="profile-name">{currentUser.name}</h1>
              <div className="profile-details">
                <div className="profile-detail-item">
                  <span className="profile-detail-icon" aria-hidden>✉</span>
                  <div className="profile-detail-content">
                    <span className="profile-detail-label">Email</span>
                    <span className="profile-detail-value">{currentUser.email}</span>
                  </div>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-icon" aria-hidden>📞</span>
                  <div className="profile-detail-content">
                    <span className="profile-detail-label">Phone</span>
                    <span className="profile-detail-value">{currentUser.phone || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="profile-section profile-section-orders">
          <div className="profile-section-head">
            <h2 className="profile-section-title">Order History</h2>
            <p className="profile-section-subtitle">View and manage your purchased orders</p>
          </div>
          {orderHistory.length === 0 ? (
            <div className="profile-empty-state">
              <div className="profile-empty-icon" aria-hidden>🛒</div>
              <p className="profile-empty-title">No orders yet</p>
              <p className="profile-empty-orders">Start shopping to see your orders here.</p>
              <button type="button" className="profile-btn-shop" onClick={() => router.push('/products')}>Browse Products</button>
            </div>
          ) : (
            <ul className="profile-orders-list">
              {orderHistory.map((order) => (
                <li key={order.orderId} className="profile-order-item">
                  {editingOrderId === order.orderId ? (
                    <div className="profile-order-edit">
                      <div className="profile-order-edit-header"><strong>Edit Order #{order.orderId}</strong></div>
                      {editError && <p className="profile-order-edit-error">{editError}</p>}
                      <div className="profile-order-edit-fields">
                        <label className="profile-order-edit-label">Ship to</label>
                        <input type="text" className="profile-order-edit-input" value={editForm.receiverName} onChange={(e) => setEditForm((f) => ({ ...f, receiverName: e.target.value }))} placeholder="Receiver name" />
                        <label className="profile-order-edit-label">Phone</label>
                        <input type="text" className="profile-order-edit-input" value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Phone number" />
                        <label className="profile-order-edit-label">Address</label>
                        <textarea className="profile-order-edit-input profile-order-edit-textarea" value={editForm.address} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} placeholder="Delivery address" rows={2} />
                        <label className="profile-order-edit-label">Payment method</label>
                        <select className="profile-order-edit-input" value={editForm.paymentMethod} onChange={(e) => setEditForm((f) => ({ ...f, paymentMethod: e.target.value }))}>
                          {PAYMENT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      </div>
                      <div className="profile-order-edit-actions">
                        <button type="button" className="profile-btn-edit-save" onClick={saveEdit} disabled={editSaving}>{editSaving ? 'Saving...' : 'Save'}</button>
                        <button type="button" className="profile-btn-edit-cancel" onClick={cancelEdit} disabled={editSaving}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="profile-order-header">
                        <span className="profile-order-id">#{order.orderId}</span>
                        <span className="profile-order-payment-tag">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
                      </div>
                      <div className="profile-order-details">
                        <p><span className="profile-order-label">Ship to</span> {order.receiverName}</p>
                        <p><span className="profile-order-label">Phone</span> {order.phone}</p>
                        <p><span className="profile-order-label">Address</span> {order.address}</p>
                      </div>
                      <button type="button" className="profile-btn-edit-order" onClick={() => startEdit(order)}>Edit order</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="profile-actions">
          {currentUser.role === 'admin' && (
            <button type="button" className="profile-btn-admin" onClick={() => router.push('/admin')}>Admin Dashboard</button>
          )}
          <button type="button" className="profile-btn-secondary" onClick={() => router.push('/products')}>Continue Shopping</button>
          <button type="button" className="profile-btn-logout" onClick={logout}>Logout</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
