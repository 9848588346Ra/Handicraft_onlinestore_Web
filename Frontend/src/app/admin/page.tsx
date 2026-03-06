'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { api } from '@/infrastructure/api';
import '@/styles/admindashboard.css';

const CATEGORIES = ['Ball Mat', 'Shoes', 'Hat', 'Purses', 'Pump Ball', 'Bowls', 'Decorative', 'Fabric'];

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function imageUrl(path: string): string {
  if (path.startsWith('/uploads/')) return `${API_BASE}${path}`;
  return path;
}

export default function AdminPage() {
  const { currentUser, logout } = useApp();
  const router = useRouter();
  const [products, setProducts] = useState<{ id: string; name: string; price: number; image: string; category: string; description: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: CATEGORIES[0],
    description: '',
    longDescription: '',
    tag: '',
    imageFile: null as File | null,
    imageUrl: '',
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
    }
  }, [currentUser, router]);

  const loadProducts = async () => {
    const res = await api.products.getAll();
    if (res.success) setProducts(res.products);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!form.name.trim() || !form.price || !form.category.trim() || !form.description.trim()) {
      setMessage({ type: 'error', text: 'Please fill name, price, category, and description.' });
      return;
    }
    const imageValue = form.imageFile || form.imageUrl.trim();
    if (!imageValue) {
      setMessage({ type: 'error', text: 'Please upload an image or provide an image URL.' });
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    fd.append('name', form.name.trim());
    fd.append('price', String(form.price));
    fd.append('category', form.category);
    fd.append('description', form.description.trim());
    if (form.longDescription.trim()) fd.append('longDescription', form.longDescription.trim());
    if (form.tag.trim()) fd.append('tag', form.tag.trim());
    if (form.imageFile) fd.append('image', form.imageFile);
    else fd.append('image', form.imageUrl.trim());

    const res = await api.products.create(fd);
    setSubmitting(false);
    if (res.success) {
      setMessage({ type: 'success', text: 'Product added successfully!' });
      setForm({ name: '', price: '', category: CATEGORIES[0], description: '', longDescription: '', tag: '', imageFile: null, imageUrl: '' });
      loadProducts();
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to add product' });
    }
  };

  if (!currentUser || currentUser.role !== 'admin') return null;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <button type="button" className="admin-header-brand" onClick={() => router.push('/')} aria-label="Go to store">
          <span className="admin-header-logo">
            <img src="/images/logo.png" alt="" className="admin-logo" />
          </span>
          <span className="admin-header-title">Handicraft Online Store</span>
        </button>
        <div className="admin-header-badge">Admin</div>
        <nav className="admin-nav">
          <button type="button" className="admin-nav-btn admin-nav-store" onClick={() => router.push('/')}>
            View Store
          </button>
          <span className="admin-nav-user">Hi, {currentUser.name}</span>
          <button type="button" className="admin-nav-btn admin-nav-logout" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="admin-main">
        <div className="admin-welcome">
          <h1 className="admin-welcome-title">Admin Dashboard</h1>
          <p className="admin-welcome-text">Manage your products and keep your store up to date.</p>
        </div>

        <section className="admin-add-section">
          <div className="admin-card">
            <h2 className="admin-card-title">Add New Product</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="admin-name">Product Name *</label>
                  <input id="admin-name" type="text" className="admin-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Handmade Felt Ball Mat" required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="admin-price">Price (Rs) *</label>
                  <input id="admin-price" type="number" className="admin-input" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="e.g. 1500" min="0" step="0.01" required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="admin-category">Category *</label>
                  <select id="admin-category" className="admin-select" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="admin-tag">Tag</label>
                  <input id="admin-tag" type="text" className="admin-input" value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))} placeholder="e.g. 100% Pure, Handmade" />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="admin-desc">Short Description *</label>
                <textarea id="admin-desc" className="admin-textarea" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief product description for listing" rows={2} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="admin-longdesc">Long Description</label>
                <textarea id="admin-longdesc" className="admin-textarea" value={form.longDescription} onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))} placeholder="Detailed description (optional)" rows={3} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Product Image *</label>
                <div className="admin-image-options">
                  <div className="admin-image-option">
                    <label className="admin-file-label">
                      <span className="admin-file-btn">Choose file</span>
                      <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/avif" onChange={(e) => setForm((f) => ({ ...f, imageFile: e.target.files?.[0] || null, imageUrl: '' }))} className="admin-file-input" />
                      {form.imageFile ? <span className="admin-file-name">{form.imageFile.name}</span> : null}
                    </label>
                  </div>
                  <span className="admin-image-divider">or</span>
                  <div className="admin-image-option admin-image-url">
                    <input type="url" className="admin-input" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value, imageFile: null }))} placeholder="Paste image URL" />
                  </div>
                </div>
              </div>
              {message && <p className={`admin-message admin-message--${message.type}`}>{message.text}</p>}
              <button type="submit" disabled={submitting} className="admin-submit-btn">
                {submitting ? 'Adding product...' : 'Add Product'}
              </button>
            </form>
          </div>
        </section>

        <section className="admin-products-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Current Products</h2>
            <span className="admin-product-count">{products.length} {products.length === 1 ? 'product' : 'products'}</span>
          </div>
          {loading ? (
            <div className="admin-loading">
              <span className="admin-loading-spinner" aria-hidden />
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="admin-empty">
              <p>No products yet. Add your first product above.</p>
            </div>
          ) : (
            <div className="admin-products-grid">
              {products.map((p) => (
                <article key={p.id} className="admin-product-card">
                  <div className="admin-product-image">
                    <img src={imageUrl(p.image)} alt={p.name} />
                  </div>
                  <div className="admin-product-body">
                    <span className="admin-product-category">{p.category}</span>
                    <h3 className="admin-product-name">{p.name}</h3>
                    <p className="admin-product-price">Rs {typeof p.price === 'number' ? p.price.toLocaleString() : p.price}</p>
                    <p className="admin-product-desc">{p.description}</p>
                    <button type="button" className="admin-product-view" onClick={() => router.push(`/products/${p.id}`)}>
                      View on store →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
