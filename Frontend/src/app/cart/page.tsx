'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { getProductById, PRODUCTS } from '@/shared/productsData';
import { api } from '@/infrastructure/api';
import Footer from '@/components/Footer';
import '@/styles/cartscreen.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function imageUrl(path: string): string {
  if (path.startsWith('/uploads/')) return `${API_BASE}${path}`;
  return path;
}

const RELATED_ON_CART = PRODUCTS.slice(0, 3);

export default function CartPage() {
  const { cartItems, updateCartQuantity, removeFromCart, currentUser } = useApp();
  const router = useRouter();
  const [apiProducts, setApiProducts] = useState<{ id: string; name: string; price: number; image: string; category: string }[]>([]);

  useEffect(() => {
    document.title = 'Cart - Handicraft Online Store';
    return () => { document.title = 'Handicraft Online Store'; };
  }, []);

  useEffect(() => {
    api.products.getAll().then((res) => {
      if (res.success && res.products.length > 0) setApiProducts(res.products);
    }).catch(() => {});
  }, []);

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
  const itemCount = lineItems.reduce((sum, line) => sum + line.quantity, 0);

  const handleNavigateToCheckout = () => {
    if (cartItems.length > 0) {
      router.push('/checkout');
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-top-bar">{lineItems.length === 0 ? 'Empty-cart' : 'Cart'}</div>
      <header className="cart-header">
        <div className="cart-header-left">
          <button type="button" className="cart-logo-wrap" onClick={() => router.push('/')} aria-label="Home">
            <img src="/images/logo.png" alt="" className="cart-logo" />
          </button>
          <nav className="cart-nav">
            <button type="button" className="cart-nav-link" onClick={() => router.push('/')}>Home</button>
            <button type="button" className="cart-nav-link" onClick={() => router.push('/about')}>About us</button>
            <div className="cart-nav-dropdown">
              <button type="button" className="cart-nav-link" onClick={() => router.push('/products')}>Products</button>
              <span className="cart-nav-arrow">▼</span>
            </div>
            <button type="button" className="cart-nav-link" onClick={() => router.push('/contact')}>Contact</button>
          </nav>
        </div>
        <div className="cart-header-right">
          <button type="button" className="cart-cart-btn active" aria-label="Cart">
            <span className="cart-cart-icon">🛒</span>
            {itemCount > 0 && <span className="cart-cart-badge">{itemCount}</span>}
          </button>
          {currentUser ? (
            <button type="button" className="cart-header-cta" onClick={() => router.push('/profile')}>Profile</button>
          ) : (
            <button type="button" className="cart-header-cta" onClick={() => router.push('/login')}>Sign Up</button>
          )}
        </div>
      </header>

      <main className="cart-main">
        {lineItems.length > 0 && <h1 className="cart-title">Cart</h1>}

        {lineItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon" aria-hidden>
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h2 className="cart-empty-title">Cart is empty</h2>
            <p className="cart-empty-text">Add some item to the cart</p>
            <button type="button" className="cart-btn-primary" onClick={() => router.push('/products')}>View all Products</button>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {lineItems.map((line) => (
                <div key={line.productId} className="cart-item">
                  <div className="cart-item-image">
                    <img src={line.product.image} alt={line.product.name} />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{line.product.name}</h3>
                    <p className="cart-item-category">{line.product.category}</p>
                    <div className="cart-item-quantity">
                      <button type="button" className="cart-qty-btn cart-qty-minus" onClick={() => updateCartQuantity(line.productId, Math.max(0, line.quantity - 1))} aria-label="Decrease quantity">−</button>
                      <span className="cart-qty-value">{line.quantity}</span>
                      <button type="button" className="cart-qty-btn cart-qty-plus" onClick={() => updateCartQuantity(line.productId, line.quantity + 1)} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                  <div className="cart-item-price">Rs {line.total}</div>
                  <button type="button" className="cart-item-remove" onClick={() => removeFromCart(line.productId)} aria-label="Remove from cart" title="Remove">×</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-subtotal-row">
                <span className="cart-subtotal-label">Subtotal</span>
                <span className="cart-subtotal-value">Rs {subtotal}</span>
              </div>
              <p className="cart-summary-note">Shipping and taxes calculated at checkout.</p>
              <button type="button" className="cart-btn-checkout" onClick={handleNavigateToCheckout}>Checkout</button>
            </div>
          </>
        )}

        {RELATED_ON_CART.length > 0 && (
          <section className="cart-related">
            <h2 className="cart-related-title">Related Products</h2>
            <div className="cart-related-grid">
              {RELATED_ON_CART.map((product) => (
                <article key={product.id} className="cart-related-card">
                  <button type="button" className="cart-related-image" onClick={() => router.push(`/products/${product.id}`)}>
                    <img src={product.image} alt={product.name} />
                  </button>
                  <h3 className="cart-related-name">{product.name}</h3>
                  <p className="cart-related-category">{product.category}</p>
                  <button type="button" className="cart-related-shop" onClick={() => router.push(`/products/${product.id}`)}>Shop &gt;</button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
