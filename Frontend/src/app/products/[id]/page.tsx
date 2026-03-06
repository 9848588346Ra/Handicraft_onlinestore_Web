'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  getProductById,
  getRelatedProducts,
  getRelatedProductsFallback,
  type Product,
} from '@/shared/productsData';
import { api } from '@/infrastructure/api';
import Footer from '@/components/Footer';
import '@/styles/productdetailscreen.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function imageUrl(path: string): string {
  if (path.startsWith('/uploads/')) return `${API_BASE}${path}`;
  return path;
}

const SAMPLE_REVIEWS = [
  { id: '1', name: 'John Smith', rating: 9, title: 'Amazing product.', body: 'The quality is outstanding and exactly as described. Fast delivery and carefully packaged. Will order again!', avatar: 'J' },
  { id: '2', name: 'Debra Anderson', rating: 8, title: 'Highly recommended!', body: 'Beautiful handicraft and great value. The colors are vibrant and the craftsmanship is evident. Very happy with my purchase.', avatar: 'D' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { currentUser, addToCart, setSignInWarning, cartItems } = useApp();
  const router = useRouter();

  const staticProduct = getProductById(productId);
  const [apiProduct, setApiProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!staticProduct);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (staticProduct) {
      setLoading(false);
      return;
    }
    api.products.getById(productId).then((res) => {
      if (res.success) {
        const p = res.product;
        setApiProduct({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          category: p.category,
          description: p.description,
          longDescription: p.longDescription,
          tag: p.tag,
          inStock: p.inStock,
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [productId, staticProduct]);

  const product = staticProduct || apiProduct;
  const images = product ? [product.image, ...(product.images || [])] : [];
  const related = product
    ? getRelatedProducts(productId, product.category).length > 0
      ? getRelatedProducts(productId, product.category)
      : getRelatedProductsFallback(productId)
    : [];

  useEffect(() => {
    if (product) document.title = `${product.name} - Handicraft Online Store`;
    return () => { document.title = 'Handicraft Online Store'; };
  }, [product]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating > 0 && reviewName.trim() && reviewEmail.trim() && reviewMessage.trim()) {
      setReviewSubmitted(true);
      setReviewRating(0);
      setReviewName('');
      setReviewEmail('');
      setReviewMessage('');
    }
  };

  const maxQty = product?.inStock ?? 99;
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleAddToCart = () => {
    if (!currentUser) {
      setSignInWarning('Please sign in first to add items to your cart.');
      return;
    }
    addToCart(product!.id, quantity);
  };

  const handleNavigateToCart = () => {
    if (!currentUser) {
      setSignInWarning('Please sign in first to view your cart.');
      return;
    }
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="pdp-page">
        <div className="pdp-top-bar">Single item</div>
        <header className="pdp-header">
          <div className="pdp-header-left">
            <Link href="/" className="pdp-logo-wrap">
              <img src="/images/logo.png" alt="Handicraft Online Store" className="pdp-logo" />
            </Link>
            <nav className="pdp-nav">
              <button type="button" className="pdp-nav-link" onClick={() => router.push('/')}>Home</button>
              <button type="button" className="pdp-nav-link" onClick={() => router.push('/about')}>About us</button>
              <div className="pdp-nav-dropdown">
                <button type="button" className="pdp-nav-link" onClick={() => router.push('/products')}>Products</button>
                <span className="pdp-nav-arrow">▼</span>
              </div>
              <button type="button" className="pdp-nav-link" onClick={() => router.push('/contact')}>Contact</button>
            </nav>
          </div>
          <div className="pdp-header-right">
            <button type="button" className="pdp-header-continue" onClick={() => router.push('/products')}>Continue Shopping</button>
            <button type="button" className="pdp-cart-btn" aria-label="Cart" onClick={handleNavigateToCart}>
              <span className="pdp-cart-icon">🛒</span>
              {cartCount > 0 && <span className="pdp-cart-badge">{cartCount}</span>}
            </button>
            {currentUser ? (
              <button type="button" className="pdp-header-cta" onClick={() => router.push('/profile')}>Profile</button>
            ) : (
              <button type="button" className="pdp-header-cta" onClick={() => router.push('/login')}>Sign Up</button>
            )}
          </div>
        </header>
        <main className="pdp-main">
          <div className="pdp-not-found"><p>Loading product...</p></div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pdp-page">
        <div className="pdp-top-bar">Single item</div>
        <header className="pdp-header">
          <div className="pdp-header-left">
            <Link href="/" className="pdp-logo-wrap">
              <img src="/images/logo.png" alt="Handicraft Online Store" className="pdp-logo" />
            </Link>
            <nav className="pdp-nav">
              <button type="button" className="pdp-nav-link" onClick={() => router.push('/')}>Home</button>
              <button type="button" className="pdp-nav-link" onClick={() => router.push('/about')}>About us</button>
              <div className="pdp-nav-dropdown">
                <button type="button" className="pdp-nav-link" onClick={() => router.push('/products')}>Products</button>
                <span className="pdp-nav-arrow">▼</span>
              </div>
              <button type="button" className="pdp-nav-link" onClick={() => router.push('/contact')}>Contact</button>
            </nav>
          </div>
          <div className="pdp-header-right">
            <button type="button" className="pdp-header-continue" onClick={() => router.push('/products')}>Continue Shopping</button>
            <button type="button" className="pdp-cart-btn" aria-label="Cart" onClick={handleNavigateToCart}>
              <span className="pdp-cart-icon">🛒</span>
              {cartCount > 0 && <span className="pdp-cart-badge">{cartCount}</span>}
            </button>
            {currentUser ? (
              <button type="button" className="pdp-header-cta" onClick={() => router.push('/profile')}>Profile</button>
            ) : (
              <button type="button" className="pdp-header-cta" onClick={() => router.push('/login')}>Sign Up</button>
            )}
          </div>
        </header>
        <main className="pdp-main">
          <div className="pdp-not-found">
            <p>Product not found.</p>
            <button type="button" className="pdp-btn-primary" onClick={() => router.push('/products')}>Back to Products</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pdp-page">
      <div className="pdp-top-bar">Single item</div>
      <header className="pdp-header">
        <div className="pdp-header-left">
          <Link href="/" className="pdp-logo-wrap">
            <img src="/images/logo.png" alt="Handicraft Online Store" className="pdp-logo" />
          </Link>
          <nav className="pdp-nav">
            <button type="button" className="pdp-nav-link" onClick={() => router.push('/')}>Home</button>
            <button type="button" className="pdp-nav-link" onClick={() => router.push('/about')}>About us</button>
            <div className="pdp-nav-dropdown">
              <button type="button" className="pdp-nav-link" onClick={() => router.push('/products')}>Products</button>
              <span className="pdp-nav-arrow">▼</span>
            </div>
            <button type="button" className="pdp-nav-link" onClick={() => router.push('/contact')}>Contact</button>
          </nav>
        </div>
        <div className="pdp-header-right">
          <button type="button" className="pdp-header-continue" onClick={() => router.push('/products')}>Continue Shopping</button>
          <button type="button" className="pdp-cart-btn" aria-label="Cart" onClick={handleNavigateToCart}>
            <span className="pdp-cart-icon">🛒</span>
            {cartCount > 0 && <span className="pdp-cart-badge">{cartCount}</span>}
          </button>
          {currentUser ? (
            <button type="button" className="pdp-header-cta" onClick={() => router.push('/profile')}>Profile</button>
          ) : (
            <button type="button" className="pdp-header-cta" onClick={() => router.push('/login')}>Sign Up</button>
          )}
        </div>
      </header>

      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <button type="button" className="pdp-breadcrumb-link" onClick={() => router.push('/')}>Home</button>
        <span className="pdp-breadcrumb-sep">&gt;</span>
        <button type="button" className="pdp-breadcrumb-link" onClick={() => router.push('/products')}>Product</button>
        <span className="pdp-breadcrumb-sep">&gt;</span>
        <span className="pdp-breadcrumb-link pdp-breadcrumb-current">{product.category}</span>
        <span className="pdp-breadcrumb-sep">&gt;</span>
        <span className="pdp-breadcrumb-link pdp-breadcrumb-current">{product.name}</span>
      </nav>

      <main className="pdp-main">
        <section className="pdp-product">
          <div className="pdp-gallery">
            <div className="pdp-thumbnails">
              {images.map((img, i) => (
                <button key={i} type="button" className={`pdp-thumb ${selectedImage === i ? 'active' : ''}`} onClick={() => setSelectedImage(i)} aria-pressed={selectedImage === i}>
                  <img src={imageUrl(img)} alt="" />
                </button>
              ))}
            </div>
            <div className="pdp-main-image">
              <img src={imageUrl(images[selectedImage])} alt={product.name} />
              {product.tag && <span className="pdp-tag">{product.tag}</span>}
            </div>
          </div>

          <div className="pdp-details">
            <h1 className="pdp-title">{product.name}</h1>
            <div className="pdp-price-row">
              <span className="pdp-price">Rs {product.price}</span>
              {product.tag && <span className="pdp-volume">{product.tag}</span>}
            </div>
            <p className="pdp-stock">In stock — {maxQty} available</p>

            <div className="pdp-options">
              <label className="pdp-option-label">Quantity</label>
              <div className="pdp-quantity">
                <button type="button" className="pdp-qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <input type="number" min={1} max={maxQty} value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(maxQty, parseInt(e.target.value, 10) || 1)))} className="pdp-qty-input" aria-label="Quantity" />
                <button type="button" className="pdp-qty-btn" onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))} aria-label="Increase quantity">+</button>
              </div>
            </div>

            <div className="pdp-description-block">
              <h2 className="pdp-description-title">Product Description</h2>
              <p className="pdp-description-text">{product.longDescription || product.description}</p>
            </div>

            <div className="pdp-actions">
              <button type="button" className="pdp-btn-primary pdp-btn-buy" onClick={handleAddToCart}>Buy Now</button>
              <button type="button" className="pdp-btn-secondary pdp-btn-cart" onClick={handleAddToCart}>Add to Cart</button>
            </div>
          </div>
        </section>

        <section className="pdp-reviews-section">
          <div className="pdp-write-review">
            <h3 className="pdp-reviews-heading">Write a Review</h3>
            {reviewSubmitted ? (
              <p className="pdp-review-success">Thank you! Your review has been submitted.</p>
            ) : (
              <form onSubmit={handleSubmitReview} className="pdp-review-form">
                <div className="pdp-review-field pdp-review-rating-row">
                  <label htmlFor="pdp-review-rating" className="pdp-review-label">Rating</label>
                  <select id="pdp-review-rating" value={reviewRating} onChange={(e) => setReviewRating(parseInt(e.target.value, 10))} className="pdp-review-select" required>
                    <option value={0}>Select rating</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>{n}/10</option>
                    ))}
                  </select>
                </div>
                <div className="pdp-review-field">
                  <label htmlFor="pdp-review-msg" className="pdp-review-label">Your Message</label>
                  <textarea id="pdp-review-msg" value={reviewMessage} onChange={(e) => setReviewMessage(e.target.value)} placeholder="Share your experience with this product" rows={4} className="pdp-review-textarea" required />
                </div>
                <div className="pdp-review-row">
                  <div className="pdp-review-field">
                    <label htmlFor="pdp-review-name" className="pdp-review-label">Your Name</label>
                    <input id="pdp-review-name" type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Your name" className="pdp-review-input" required />
                  </div>
                  <div className="pdp-review-field">
                    <label htmlFor="pdp-review-email" className="pdp-review-label">Your Email</label>
                    <input id="pdp-review-email" type="email" value={reviewEmail} onChange={(e) => setReviewEmail(e.target.value)} placeholder="your@email.com" className="pdp-review-input" required />
                  </div>
                </div>
                <button type="submit" className="pdp-review-submit">Submit</button>
              </form>
            )}
          </div>

          <div className="pdp-reviews-list">
            <h3 className="pdp-reviews-heading">Reviews</h3>
            {SAMPLE_REVIEWS.map((r) => (
              <div key={r.id} className="pdp-review-card">
                <div className="pdp-review-card-header">
                  <div className="pdp-review-avatar">{r.avatar}</div>
                  <div>
                    <p className="pdp-review-author">{r.name}</p>
                    <span className="pdp-review-badge">{r.rating}/10</span>
                  </div>
                </div>
                <p className="pdp-review-card-title">{r.title}</p>
                <p className="pdp-review-card-body">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="pdp-related">
            <h2 className="pdp-related-title">Related Products</h2>
            <div className="pdp-related-grid">
              {related.map((p) => (
                <article key={p.id} className="pdp-related-card">
                  <button type="button" className="pdp-related-image" onClick={() => router.push(`/products/${p.id}`)}>
                    <img src={imageUrl(p.image)} alt={p.name} />
                  </button>
                  <p className="pdp-related-name">{p.name}</p>
                  <button type="button" className="pdp-related-shop" onClick={() => router.push(`/products/${p.id}`)}>Shop &gt;</button>
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
