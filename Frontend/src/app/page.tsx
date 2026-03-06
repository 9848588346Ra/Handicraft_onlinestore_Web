'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Footer from '@/components/Footer';
import '@/styles/homescreen.css';

/* Images from project folders (dist/assets) */
const IMG = {
  hero: '/images/Factory.jpg',
  owl: '/images/owl.jpg',
  fabric: '/images/Rugrool.jpeg',
  angel: '/images/angel.jpeg',
  leafPurse: '/images/LEafpurse.jpeg',
  shoes: '/images/Shoes.jpeg',
  rug: '/images/Rug.jpeg',
};

const CATEGORIES = [
  { label: 'Ball Mat', img: '/images/Ballmat.jpeg' },
  { label: 'Shoes', img: '/images/Shoes.jpeg' },
  { label: 'Hat', img: '/images/GreeenHat.jpeg' },
  { label: 'Purses', img: '/images/LEafpurse.jpeg' },
  { label: 'Pump Pump Ball', img: '/images/PumpBall.jpeg' },
  { label: 'Bowls', img: '/images/Bowl.jpeg' },
];

const DISCOVER_CARDS = [
  { img: IMG.owl, title: 'Handicraft Store' },
  { img: IMG.fabric, title: 'Handicraft Store' },
  { img: IMG.angel, title: 'Handicraft Store' },
];

const GOODNESS_ITEMS = [
  { img: IMG.rug },
  { img: IMG.leafPurse },
  { img: IMG.shoes },
  { img: IMG.leafPurse },
  { img: IMG.rug },
  { img: IMG.rug },
];

const TESTIMONIAL_TEXT =
  "I recently tried placing my orders through the Country Delight app. Being only a whatsapp user. The App is easy to use and place order! I m loving it...";

const CATEGORY_TO_PRODUCTS_MAP: Record<string, string> = {
  'Pump Pump Ball': 'Pump Ball',
};

export default function HomePage() {
  const { currentUser, cartItems, setSignInWarning } = useApp();
  const router = useRouter();
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleNavigateToCart = () => {
    if (!currentUser) {
      setSignInWarning('Please sign in first to view your cart.');
      return;
    }
    router.push('/cart');
  };

  useEffect(() => {
    document.title = 'Home - Handicraft Online Store';
    return () => { document.title = 'Handicraft Online Store'; };
  }, []);

  const goToProducts = (category?: string) => {
    if (category) router.push(`/products?category=${encodeURIComponent(category)}`);
    else router.push('/products');
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-header-left">
          <Link href="/" className="home-logo-wrap">
            <img src="/images/logo.png" alt="Handicraft Online Store" className="home-logo" />
          </Link>
          <nav className="home-nav">
            <span className="home-nav-link active">Home</span>
            <button type="button" className="home-nav-link" onClick={() => router.push('/about')}>About us</button>
            <div className="home-nav-dropdown">
              <button type="button" className="home-nav-link" onClick={() => router.push('/products')}>Products</button>
              <span className="home-nav-arrow">▼</span>
            </div>
            <button type="button" className="home-nav-link" onClick={() => router.push('/contact')}>Contact</button>
          </nav>
        </div>
        <div className="home-header-right">
          <button type="button" className="home-cart-btn" aria-label="Cart" onClick={handleNavigateToCart}>
            <span className="home-cart-icon">🛒</span>
            {cartCount > 0 && <span className="home-cart-badge">{cartCount}</span>}
          </button>
          {currentUser ? (
            <button type="button" className="home-header-cta" onClick={() => router.push('/profile')}>
              Profile
            </button>
          ) : (
            <button type="button" className="home-header-cta" onClick={() => router.push('/login')}>
              Login
            </button>
          )}
        </div>
      </header>

      <section className="home-hero">
        <img src={IMG.hero} alt="Handicraft workshop" className="home-hero-img" />
      </section>

      <section className="home-section home-categories">
        <h2 className="home-section-title">Explore Categories</h2>
        <div className="home-categories-grid">
          {CATEGORIES.map((cat, i) => {
            const productsCategory = CATEGORY_TO_PRODUCTS_MAP[cat.label] ?? cat.label;
            return (
              <button
                key={i}
                type="button"
                className="home-category-item"
                onClick={() => goToProducts(productsCategory)}
              >
                <div className="home-category-circle">
                  <img src={cat.img} alt={cat.label} />
                </div>
                <span className="home-category-label">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="home-section home-discover">
        <h2 className="home-section-title home-section-title--large">
          Discover the Finest Handicraft Products for a Decoration
        </h2>
        <div className="home-discover-grid">
          {DISCOVER_CARDS.map((card, i) => (
            <div key={i} className="home-discover-card">
              <div className="home-discover-card-img">
                <img src={card.img} alt={card.title} />
              </div>
              <p className="home-discover-card-title">{card.title}</p>
              <p className="home-discover-card-title">{card.title}</p>
              <button type="button" className="home-shop-link" onClick={() => router.push('/products')}>Shop &gt;</button>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section home-goodness">
        <h2 className="home-section-title home-section-title--large">Our Goodness</h2>
        <p className="home-goodness-tagline">Comes in many types!</p>
        <div className="home-goodness-grid">
          {GOODNESS_ITEMS.map((item, i) => (
            <div key={i} className="home-goodness-card">
              <div className="home-goodness-card-img">
                <img src={item.img} alt="" />
              </div>
              <button type="button" className="home-view-all-btn" onClick={() => router.push('/products')}>View All &gt;</button>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section home-cta-row">
        <h2 className="home-cta-title">Discover the Handicraft Products</h2>
        <div className="home-cta-right">
          <p className="home-cta-store">Handicraft Store</p>
          <div className="home-cta-buttons">
            <button type="button" className="home-btn-primary" onClick={() => router.push('/products')}>Shop Now</button>
            <button type="button" className="home-btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      <section className="home-section home-testimonials">
        <h2 className="home-section-title">Testimonial</h2>
        <div className="home-testimonials-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="home-testimonial-card">
              <p className="home-testimonial-text">{TESTIMONIAL_TEXT}</p>
              <a href="#" className="home-testimonial-link">facebook</a>
              <div className="home-testimonial-author">
                <span className="home-testimonial-name">Raju Ratsoji</span>
                <div className="home-testimonial-avatar" aria-hidden />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
