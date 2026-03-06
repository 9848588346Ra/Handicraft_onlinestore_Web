'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import type { OrderConfirmation } from '@/context/AppContext';
import '@/styles/confirmationscreen.css';

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Cash on delivery',
  card: 'Card / Online payment',
  bank: 'Bank transfer',
};

function getStoredOrder(): OrderConfirmation | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('handicraft_last_order');
    if (!raw) return null;
    const order = JSON.parse(raw) as OrderConfirmation;
    if (order?.orderId && order?.receiverName) return order;
    return null;
  } catch {
    return null;
  }
}

export default function ConfirmationPage() {
  const { lastOrder, clearCart } = useApp();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const order = lastOrder ?? getStoredOrder();

  useEffect(() => {
    if (order) {
      document.title = 'Order Placed - Handicraft Online Store';
    }
    return () => { document.title = 'Handicraft Online Store'; };
  }, [order]);

  useEffect(() => {
    if (!order) {
      router.replace('/products');
    } else {
      clearCart();
    }
  }, [order, router, clearCart]);

  useEffect(() => {
    if (!order || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          sessionStorage.removeItem('handicraft_last_order');
          router.push('/products');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [order, countdown, router]);

  if (!order) {
    return (
      <div className="confirmation-page">
        <main className="confirmation-main confirmation-main--redirect">
          <p className="confirmation-redirect">No order found. Redirecting...</p>
        </main>
      </div>
    );
  }

  const paymentLabel = PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod;

  const goToProducts = () => {
    sessionStorage.removeItem('handicraft_last_order');
    router.push('/products');
  };

  return (
    <div className="confirmation-page">
      <header className="confirmation-header">
        <div className="confirmation-header-inner">
          <Link href="/" className="confirmation-logo-wrap">
            <img src="/images/logo.png" alt="Handicraft Online Store" className="confirmation-logo" />
            <span className="confirmation-brand">Order Confirmed</span>
          </Link>
          <button type="button" className="confirmation-header-continue" onClick={goToProducts}>
            Back to Products
          </button>
        </div>
      </header>

      <main className="confirmation-main">
        <div className="confirmation-content">
          <div className="confirmation-success-icon" aria-hidden>
            <span className="confirmation-check">✓</span>
          </div>
          <h1 className="confirmation-title">Your order is placed!</h1>
          <p className="confirmation-subtext">
            Thank you for your order, {order.receiverName}. We&apos;ll send you a confirmation email soon.
          </p>
          <div className="confirmation-order-number">Order # {order.orderId}</div>

          <div className="confirmation-details">
            <div className="confirmation-detail-row">
              <span className="confirmation-detail-label">Payment</span>
              <span className="confirmation-detail-value">{paymentLabel}</span>
            </div>
            <div className="confirmation-detail-row">
              <span className="confirmation-detail-label">Delivery to</span>
              <span className="confirmation-detail-value">{order.receiverName}, {order.phone}</span>
            </div>
          </div>

          <div className="confirmation-actions">
            <button type="button" className="confirmation-btn-primary" onClick={goToProducts}>
              Back to Products
            </button>
            {countdown > 0 && (
              <p className="confirmation-countdown">
                Redirecting to products in {countdown} second{countdown !== 1 ? 's' : ''}...
              </p>
            )}
          </div>

          <p className="confirmation-note">
            View your orders in your <Link href="/profile" className="confirmation-link">Profile</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
