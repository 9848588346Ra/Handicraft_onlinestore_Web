'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PRODUCTS } from '@/shared/productsData';
import { api } from '@/infrastructure/api';
import Footer from '@/components/Footer';
import '@/styles/productsscreen.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function imageUrl(path: string): string {
  if (path.startsWith('/uploads/')) return `${API_BASE}${path}`;
  return path;
}

const CATEGORIES = [
  'All',
  'Ball Mat',
  'Shoes',
  'Hat',
  'Purses',
  'Pump Ball',
  'Bowls',
  'Decorative',
  'Fabric',
];

function ProductsContent() {
  const { currentUser, addToCart, setSignInWarning, cartItems } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory && CATEGORIES.includes(initialCategory) ? initialCategory : 'All'
  );
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');
  const [products, setProducts] = useState<{ id: string; name: string; price: number; image: string; category: string; description: string; tag?: string; inStock?: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialCategory && CATEGORIES.includes(initialCategory)) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    document.title = 'Products - Handicraft Online Store';
    return () => { document.title = 'Handicraft Online Store'; };
  }, []);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
      setProducts((p) => (p.length === 0 ? PRODUCTS : p));
    }, 4000);

    api.products.getAll().then((res) => {
      clearTimeout(fallbackTimer);
      if (res.success && res.products.length > 0) {
        setProducts(res.products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          category: p.category,
          description: p.description,
          tag: p.tag,
          inStock: p.inStock,
        })));
      } else {
        setProducts(PRODUCTS);
      }
      setLoading(false);
    }).catch(() => {
      clearTimeout(fallbackTimer);
      setProducts(PRODUCTS);
      setLoading(false);
    });
  }, []);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const filteredProducts =
    selectedCategory === 'All'
      ? [...products]
      : products.filter((p) => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  const handleAddToCart = (productId: string) => {
    addToCart(productId);
  };

  const handleNavigateToCart = () => {
    if (!currentUser) {
      setSignInWarning('Please sign in first to view your cart.');
      return;
    }
    router.push('/cart');
  };

  return (
    <div className="products-page">
      <header className="products-header">
        <div className="products-header-left">
          <Link href="/" className="products-logo-wrap">
            <img src="/images/logo.png" alt="Handicraft Online Store" className="products-logo" />
          </Link>
          <nav className="products-nav">
            <button type="button" className="products-nav-link" onClick={() => router.push('/')}>Home</button>
            <button type="button" className="products-nav-link" onClick={() => router.push('/about')}>About us</button>
            <div className="products-nav-dropdown">
              <button type="button" className="products-nav-link active" onClick={() => router.push('/products')}>Products</button>
              <span className="products-nav-arrow">▼</span>
            </div>
            <button type="button" className="products-nav-link" onClick={() => router.push('/contact')}>Contact</button>
          </nav>
        </div>
        <div className="products-header-right">
          <button type="button" className="products-cart-btn" aria-label="Cart" onClick={handleNavigateToCart}>
            <span className="products-cart-icon">🛒</span>
            {cartCount > 0 && (
              <span className="products-cart-badge">{cartCount}</span>
            )}
          </button>
          {currentUser ? (
            <button type="button" className="products-header-cta" onClick={() => router.push('/profile')}>Profile</button>
          ) : (
            <button type="button" className="products-header-cta" onClick={() => router.push('/login')}>Login</button>
          )}
        </div>
      </header>

      <main className="products-main">
        <aside className="products-sidebar">
          <h3 className="products-sidebar-title">Categories</h3>
          <ul className="products-sidebar-list">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  className={`products-sidebar-item ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="products-content">
          <div className="products-content-head">
            <h2 className="products-content-title">Handicraft Products</h2>
            <div className="products-sort">
              <label htmlFor="products-sort-select" className="products-sort-label">Sort by</label>
              <select
                id="products-sort-select"
                className="products-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {loading ? (
              <p className="products-empty">Loading products...</p>
            ) : (
              sortedProducts.map((product) => (
                <article key={product.id} className="product-card">
                  <div className="product-card-image">
                    <img src={imageUrl(product.image)} alt={product.name} />
                    {product.tag && <span className="product-card-tag">{product.tag}</span>}
                  </div>
                  <div className="product-card-body">
                    <h3 className="product-card-name">{product.name}</h3>
                    <p className="product-card-price">Rs {product.price}</p>
                    {product.inStock != null && (
                      <p className="product-card-stock">Quantity: 1/{product.inStock}</p>
                    )}
                    <p className="product-card-desc">{product.description}</p>
                    <div className="product-card-actions">
                      <button
                        type="button"
                        className="product-card-add"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        className="product-card-view"
                        onClick={() => router.push(`/products/${product.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {!loading && sortedProducts.length === 0 && (
            <p className="products-empty">No products in this category yet.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="products-empty">Loading...</p>}>
      <ProductsContent />
    </Suspense>
  );
}
