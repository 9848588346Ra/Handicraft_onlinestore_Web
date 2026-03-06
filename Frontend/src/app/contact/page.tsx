'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Footer from '@/components/Footer';
import '@/styles/contactusscreen.css';

const TOLL_FREE = '1800 120 4777';
const CONTACT_EMAIL = 'info@handicraftonlinestore.com';
const ADDRESS = 'Handicraft Online Store, Kathmandu, Nepal';

interface ContactFormData {
  fullName: string;
  mobile: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const { currentUser, setSignInWarning, cartItems } = useApp();
  const router = useRouter();
  const [form, setForm] = useState<ContactFormData>({
    fullName: '',
    mobile: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Contact us - Handicraft Online Store';
    return () => { document.title = 'Handicraft Online Store'; };
  }, []);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.fullName.trim()) next.fullName = 'Please enter your name';
    if (!form.mobile.trim()) next.mobile = 'Please enter your mobile number';
    else if (!/^[0-9+\s-]{8,16}$/.test(form.mobile)) next.mobile = 'Enter a valid number';
    if (!form.email.trim()) next.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.message.trim()) next.message = 'Please enter your message';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setForm({ fullName: '', mobile: '', email: '', message: '' });
  };

  const handleNavigateToCart = () => {
    if (!currentUser) {
      setSignInWarning('Please sign in first to view your cart.');
      return;
    }
    router.push('/cart');
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <div className="contact-header-left">
          <Link href="/" className="contact-logo-wrap">
            <img src="/images/logo.png" alt="Handicraft Online Store" className="contact-logo" />
          </Link>
          <nav className="contact-nav">
            <button type="button" className="contact-nav-link" onClick={() => router.push('/')}>Home</button>
            <button type="button" className="contact-nav-link" onClick={() => router.push('/about')}>About us</button>
            <div className="contact-nav-dropdown">
              <button type="button" className="contact-nav-link" onClick={() => router.push('/products')}>Products</button>
              <span className="contact-nav-arrow">▼</span>
            </div>
            <span className="contact-nav-link active">Contact</span>
          </nav>
        </div>
        <div className="contact-header-right">
          <button type="button" className="contact-cart-btn" aria-label="Cart" onClick={handleNavigateToCart}>
            <span className="contact-cart-icon">🛒</span>
            {cartCount > 0 && <span className="contact-cart-badge">{cartCount}</span>}
          </button>
          {currentUser ? (
            <button type="button" className="contact-header-cta" onClick={() => router.push('/profile')}>Profile</button>
          ) : (
            <button type="button" className="contact-header-cta" onClick={() => router.push('/login')}>Login</button>
          )}
        </div>
      </header>

      <main className="contact-main">
        <div className="contact-layout">
          <aside className="contact-info">
            <h2 className="contact-info-title">LETS GET Contact Us</h2>
            <p className="contact-info-availability">We are available between 10AM-6PM, Feel free to contact.</p>
            <div className="contact-info-card">
              <h3 className="contact-info-card-title">For Overseas Enquiry</h3>
              <p className="contact-info-item">
                Toll Free No : <a href={`tel:${TOLL_FREE.replace(/\s/g, '')}`} className="contact-info-link">{TOLL_FREE}</a>
              </p>
              <p className="contact-info-item">
                E-Mail id : <a href={`mailto:${CONTACT_EMAIL}`} className="contact-info-link">{CONTACT_EMAIL}</a>
              </p>
            </div>
            <div className="contact-info-card contact-info-address">
              <h3 className="contact-info-card-title">Visit us</h3>
              <p className="contact-info-card-text">{ADDRESS}</p>
            </div>
          </aside>

          <section className="contact-form-section">
            <h2 className="contact-form-title">Contact us</h2>
            <p className="contact-form-subtitle">We&apos;d Love to Hear From You, Get In Touch With Us!</p>

            {submitted ? (
              <div className="contact-success" role="status">
                <p className="contact-success-title">Message sent</p>
                <p className="contact-success-text">Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.</p>
                <button type="button" className="contact-success-again" onClick={() => setSubmitted(false)}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="contact-fullName" className="contact-label">Full name</label>
                    <input id="contact-fullName" name="fullName" type="text" value={form.fullName} onChange={handleChange} placeholder="Jane" className={`contact-input ${errors.fullName ? 'contact-input--error' : ''}`} autoComplete="name" aria-invalid={!!errors.fullName} />
                    {errors.fullName && <span className="contact-error" role="alert">{errors.fullName}</span>}
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-mobile" className="contact-label">Mobile number</label>
                    <input id="contact-mobile" name="mobile" type="tel" value={form.mobile} onChange={handleChange} placeholder="+977 98XXXXXXXX" className={`contact-input ${errors.mobile ? 'contact-input--error' : ''}`} autoComplete="tel" aria-invalid={!!errors.mobile} />
                    {errors.mobile && <span className="contact-error" role="alert">{errors.mobile}</span>}
                  </div>
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-email" className="contact-label">Email address</label>
                  <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" className={`contact-input ${errors.email ? 'contact-input--error' : ''}`} autoComplete="email" aria-invalid={!!errors.email} />
                  {errors.email && <span className="contact-error" role="alert">{errors.email}</span>}
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-message" className="contact-label">Your message</label>
                  <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} placeholder="Enter your question or message" rows={4} className={`contact-textarea ${errors.message ? 'contact-input--error' : ''}`} aria-invalid={!!errors.message} />
                  {errors.message && <span className="contact-error" role="alert">{errors.message}</span>}
                </div>
                <button type="submit" className="contact-submit">Submit</button>
              </form>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
