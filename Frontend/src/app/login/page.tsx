'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginData, loginSchema } from '@/shared/schema';
import { useApp } from '@/context/AppContext';
import '@/styles/loginscreen.css';

export default function LoginPage() {
  const { validateLogin } = useApp();
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    document.title = 'Login - Handicraft Online Store';
    return () => { document.title = 'Handicraft Online Store'; };
  }, []);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  });

  const submit = async (values: LoginData) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const result = await validateLogin(values.email, values.password);
    if (result.success) {
      if (result.isAdmin) router.push('/admin');
      else router.push('/');
    } else {
      setError('root', { type: 'manual', message: 'Invalid email or password. Sign up first if you don\'t have an account.' });
    }
  };

  const openAdminLogin = () => {
    setShowAdminModal(true);
    setAdminError(null);
    setAdminEmail('');
    setAdminPassword('');
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setAdminError(null);
  };

  const submitAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAdminError(null);
    setAdminSubmitting(true);
    const result = await validateLogin(adminEmail, adminPassword);
    setAdminSubmitting(false);
    if (result.success && result.isAdmin) {
      router.push('/admin');
    } else {
      setAdminError('Invalid admin credentials. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <button type="button" className="login-header-brand" onClick={() => router.push('/')} aria-label="Go to home">
          <span className="login-header-logo">
            <img src="/images/logo.png" alt="" className="login-logo" />
          </span>
          <span className="login-header-store-name">Handicraft Online Store</span>
        </button>
        <button type="button" className="login-header-signup" onClick={() => router.push('/signup')}>Sign Up</button>
      </header>

      <main className="login-main">
        <div className="login-bg-logo" aria-hidden>
          <img src="/images/logo.png" alt="" />
        </div>
        <div className="login-form-wrapper">
          <h2 className="login-heading">Login with us</h2>
          <form onSubmit={handleSubmit(submit)} className="login-form">
            <div className="login-field">
              <label className="login-label" htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="email" className="login-input" {...register('email')} placeholder="Enter your email" />
              {errors.email?.message && <p className="login-error">{errors.email.message}</p>}
            </div>
            <div className="login-field">
              <label className="login-label" htmlFor="password">Password</label>
              <input id="password" type="password" autoComplete="current-password" className="login-input" {...register('password')} placeholder="Enter your password" />
              {errors.password?.message && <p className="login-error">{errors.password.message}</p>}
            </div>
            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <button type="button" className="login-forgot" onClick={() => router.push('/forgot-password')}>Forget Password ?</button>
            </div>
            {errors.root?.message && <p className="login-error">{errors.root.message}</p>}
            <button type="submit" disabled={isSubmitting} className="login-button">
              {isSubmitting ? 'Logging in...' : 'LOGIN'}
            </button>
            <p className="login-footer-text login-admin-hint">
              <button type="button" className="login-admin-link" onClick={openAdminLogin}>Login as admin</button>
            </p>
            <p className="login-footer-text">
              Not yet a member??{' '}
              <a href="#" className="login-footer-link" onClick={(e) => { e.preventDefault(); router.push('/signup'); }}>Sign Up</a>
            </p>
          </form>
          <p className="login-branding">
            <span className="login-brand-handicraft">HANDICRAFT</span>{' '}
            <span className="login-brand-store">ONLINE STORE</span>
          </p>
        </div>
      </main>

      <footer className="login-footer" />

      {showAdminModal && (
        <div className="login-admin-overlay" onClick={closeAdminModal} role="presentation">
          <div className="login-admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="login-admin-modal-header">
              <h3 className="login-admin-modal-title">Admin Login</h3>
              <button type="button" className="login-admin-modal-close" onClick={closeAdminModal} aria-label="Close">×</button>
            </div>
            <form onSubmit={submitAdminLogin} className="login-admin-form">
              <div className="login-field">
                <label className="login-label" htmlFor="admin-email">Admin Email</label>
                <input id="admin-email" type="email" className="login-input" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="Enter admin email" />
              </div>
              <div className="login-field">
                <label className="login-label" htmlFor="admin-password">Admin Password</label>
                <input id="admin-password" type="password" className="login-input" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Enter admin password" />
              </div>
              {adminError && <p className="login-error">{adminError}</p>}
              <div className="login-admin-modal-actions">
                <button type="button" className="login-admin-btn-secondary" onClick={closeAdminModal}>Cancel</button>
                <button type="submit" className="login-admin-btn-primary" disabled={adminSubmitting}>
                  {adminSubmitting ? 'Signing in...' : 'Sign in as Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
