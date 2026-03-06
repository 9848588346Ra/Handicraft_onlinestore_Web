'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { getProductById } from '@/shared/productsData';
import { api } from '@/infrastructure/api';
import '@/styles/checkoutscreen.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function imageUrl(path: string): string {
  if (path.startsWith('/uploads/')) return `${API_BASE}${path}`;
  return path;
}

const PAYMENT_OPTIONS = [
  { value: 'cash', label: 'Cash on delivery', icon: '💵' },
  { value: 'card', label: 'Card / Online payment', icon: '💳' },
  { value: 'bank', label: 'Bank transfer', icon: '🏦' },
];

export default function CheckoutPage() {
  const { placeOrder, cartItems, currentUser } = useApp();
  const router = useRouter();
  const [apiProducts, setApiProducts] = useState<{ id: string; name: string; price: number; image: string; category: string }[]>([]);
  const [form, setForm] = useState({
    receiverName: '',
    phone: '',
    address: '',
    paymentMethod: PAYMENT_OPTIONS[0].value,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isPlacing, setIsPlacing] = useState(false);

  const getProduct = (productId: string) => {
    const staticProduct = getProductById(productId);
    if (staticProduct) return { ...staticProduct, image: staticProduct.image };
    const apiProduct = apiProducts.find((p) => p.id === productId);
    if (apiProduct) return { id: apiProduct.id, name: apiProduct.name, price: apiProduct.price, image: imageUrl(apiProduct.image), category: apiProduct.category };
    return null;
  };

  const lineItems = cartItems
    .map((item) => {
      const product = getProduct(item.productId);
      if (!product) return null;
      return { ...item, product, total: product.price * item.quantity };
    })
    .filter(Boolean) as { productId: string; quantity: number; product: { id: string; name: string; price: number; image: string; category: string }; total: number }[];

  const subtotal = lineItems.reduce((sum, line) => sum + line.total, 0);

  useEffect(() => {
    api.products.getAll().then((res) => {
      if (res.success && res.products.length > 0) setApiProducts(res.products);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        receiverName: currentUser.name,
        phone: currentUser.phone || prev.phone,
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    document.title = 'Checkout - Handicraft Online Store';
    return () => { document.title = 'Handicraft Online Store'; };
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace('/cart');
    }
  }, [cartItems.length, router]);

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <main className="checkout-main checkout-main--redirect">
          <p className="checkout-redirect">Your cart is empty. Redirecting...</p>
        </main>
      </div>
    );
  }

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.receiverName.trim()) next.receiverName = 'Enter receiver name';
    if (!form.phone.trim()) next.phone = 'Enter phone number';
    else if (!/^[0-9+\s-]{8,16}$/.test(form.phone)) next.phone = 'Enter a valid phone number';
    if (!form.address.trim()) next.address = 'Enter delivery address';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsPlacing(true);
    try {
      await placeOrder(form);
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <Link href="/" className="checkout-logo-wrap">
            <img src="/images/logo.png" alt="Handicraft Online Store" className="checkout-logo" />
            <span className="checkout-brand">Checkout</span>
          </Link>
          <nav className="checkout-stepper" aria-label="Checkout progress">
            <div className="checkout-step done">
              <span className="checkout-step-icon">✓</span>
              <span className="checkout-step-label">Shopping cart</span>
            </div>
            <div className="checkout-step active">
              <span className="checkout-step-icon">2</span>
              <span className="checkout-step-label">Checkout</span>
            </div>
            <div className="checkout-step">
              <span className="checkout-step-icon">3</span>
              <span className="checkout-step-label">Finish</span>
            </div>
          </nav>
          <button type="button" className="checkout-header-continue" onClick={() => router.push('/products')}>
            Continue Shopping
          </button>
        </div>
      </header>

      <main className="checkout-main">
        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-form-card">
              <h2 className="checkout-section-title">Delivery details</h2>
              <p className="checkout-section-desc">Enter the address where you&apos;d like to receive your order</p>
              <div className="checkout-field">
                <label htmlFor="checkout-receiverName">Receiver name *</label>
                <input id="checkout-receiverName" name="receiverName" type="text" value={form.receiverName} onChange={handleChange} placeholder="e.g. Azam Shaikh" className={errors.receiverName ? 'checkout-input-error' : ''} autoComplete="name" />
                {errors.receiverName && <span className="checkout-error">{errors.receiverName}</span>}
              </div>
              <div className="checkout-field">
                <label htmlFor="checkout-phone">Contact number *</label>
                <input id="checkout-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="e.g. +977 98XXXXXXXX" className={errors.phone ? 'checkout-input-error' : ''} autoComplete="tel" />
                {errors.phone && <span className="checkout-error">{errors.phone}</span>}
              </div>
              <div className="checkout-field">
                <label htmlFor="checkout-address">Delivery address *</label>
                <textarea id="checkout-address" name="address" value={form.address} onChange={handleChange} placeholder="Street, city, state, zip code" rows={3} className={errors.address ? 'checkout-input-error' : ''} autoComplete="street-address" />
                {errors.address && <span className="checkout-error">{errors.address}</span>}
              </div>
            </div>

            <div className="checkout-form-card">
              <h2 className="checkout-section-title">Payment method</h2>
              <p className="checkout-section-desc">Choose how you&apos;d like to pay</p>
              <div className="checkout-payment-options">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label key={opt.value} className={`checkout-payment-option ${form.paymentMethod === opt.value ? 'checkout-payment-option--selected' : ''}`}>
                    <input type="radio" name="paymentMethod" value={opt.value} checked={form.paymentMethod === opt.value} onChange={handleChange} className="checkout-payment-radio" />
                    <span className="checkout-payment-icon">{opt.icon}</span>
                    <span className="checkout-payment-label">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="checkout-actions">
              <button type="button" className="checkout-btn-back" onClick={() => router.push('/cart')} disabled={isPlacing}>← Back to cart</button>
              <button type="submit" className="checkout-btn-place" disabled={isPlacing}>
                {isPlacing ? 'Placing order...' : 'Place order'}
              </button>
            </div>
          </form>

          <aside className="checkout-summary">
            <div className="checkout-summary-card">
              <h3 className="checkout-summary-title">Order summary</h3>
              <ul className="checkout-summary-list">
                {lineItems.map((line) => (
                  <li key={line.productId} className="checkout-summary-item">
                    <div className="checkout-summary-item-img">
                      <img src={line.product.image} alt={line.product.name} />
                    </div>
                    <div className="checkout-summary-item-details">
                      <span className="checkout-summary-item-name">{line.product.name}</span>
                      <span className="checkout-summary-item-qty">Qty: {line.quantity}</span>
                    </div>
                    <span className="checkout-summary-item-price">Rs {line.total}</span>
                  </li>
                ))}
              </ul>
              <div className="checkout-summary-total">
                <span>Subtotal</span>
                <span>Rs {subtotal}</span>
              </div>
              <p className="checkout-summary-note">Shipping and taxes calculated at confirmation.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
