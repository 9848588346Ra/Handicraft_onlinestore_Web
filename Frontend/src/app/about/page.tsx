'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Footer from '@/components/Footer';
import '@/styles/aboutusscreen.css';

const ABOUT_TEXT = (
  <>
    <strong>Handicraft Online Store</strong> is a digital marketplace that connects you with
    authentic handmade products crafted by skilled artisans. We offer a wide range of items
    including home décor, accessories, traditional crafts, and personalized gifts.
    <br /><br />
    Our platform features easy navigation, secure payments, and detailed product information.
    We are committed to empowering local artisans and providing you with a smooth, trustworthy
    shopping experience.
  </>
);

export default function AboutPage() {
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
    document.title = 'About us - Handicraft Online Store';
    return () => { document.title = 'Handicraft Online Store'; };
  }, []);

  return (
    <div className="about-page">
      <header className="about-header">
        <div className="about-header-left">
          <Link href="/" className="about-logo-wrap">
            <img src="/images/logo.png" alt="Handicraft Online Store" className="about-logo" />
          </Link>
          <nav className="about-nav">
            <button type="button" className="about-nav-link" onClick={() => router.push('/')}>Home</button>
            <span className="about-nav-link active">About us</span>
            <div className="about-nav-dropdown">
              <button type="button" className="about-nav-link" onClick={() => router.push('/products')}>Products</button>
              <span className="about-nav-arrow">▼</span>
            </div>
            <button type="button" className="about-nav-link" onClick={() => router.push('/contact')}>Contact</button>
          </nav>
        </div>
        <div className="about-header-right">
          <button type="button" className="about-cart-btn" aria-label="Cart" onClick={handleNavigateToCart}>
            <span className="about-cart-icon">🛒</span>
            {cartCount > 0 && <span className="about-cart-badge">{cartCount}</span>}
          </button>
          {currentUser ? (
            <button type="button" className="about-header-cta" onClick={() => router.push('/profile')}>Profile</button>
          ) : (
            <button type="button" className="about-header-cta" onClick={() => router.push('/login')}>Login</button>
          )}
        </div>
      </header>

      <section className="about-hero">
        <img src="/images/Factory.jpg" alt="Handicraft workshop" className="about-hero-img" />
        <h1 className="about-hero-title">WHO WE ARE?</h1>
      </section>

      <section className="about-section about-content">
        <div className="about-content-block">
          <div className="about-content-image">
            <img src="/images/angel.jpeg" alt="Handcrafted items" />
          </div>
          <div className="about-content-text">
            <p className="about-paragraph">{ABOUT_TEXT}</p>
          </div>
        </div>
      </section>

      <section className="about-section about-content about-content--reverse">
        <div className="about-content-block">
          <div className="about-content-text">
            <p className="about-paragraph">{ABOUT_TEXT}</p>
          </div>
          <div className="about-content-image">
            <img src="/images/Rugrool.jpeg" alt="Fabric rolls" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
