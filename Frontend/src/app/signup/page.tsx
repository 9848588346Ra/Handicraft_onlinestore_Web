'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterData, registerSchema } from '@/shared/schema';
import { useApp } from '@/context/AppContext';
import '@/styles/signupscreen.css';

export default function SignupPage() {
  const { registerUser } = useApp();
  const router = useRouter();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    document.title = 'Signup - Handicraft Online Store';
    return () => { document.title = 'Handicraft Online Store'; };
  }, []);

  const submit = async (values: RegisterData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const result = await registerUser(
      values.name,
      values.email,
      values.password,
      values.phone ?? '',
      values.confirmPassword
    );
    if (result?.success) {
      router.push('/login');
    } else if (result && !result.success) {
      setError('root', { type: 'manual', message: result.message || 'Registration failed.' });
    }
  };

  return (
    <div className="signup-page">
      <header className="signup-header">
        <button type="button" className="signup-header-brand" onClick={() => router.push('/')} aria-label="Go to home">
          <span className="signup-header-logo">
            <img src="/images/logo.png" alt="" className="signup-logo" />
          </span>
          <span className="signup-header-store-name">Handicraft Online Store</span>
        </button>
        <button type="button" className="signup-header-login" onClick={() => router.push('/login')}>Login</button>
      </header>

      <main className="signup-main">
        <div className="signup-form-wrapper">
          <h2 className="signup-heading">Sign up with us</h2>
          <form onSubmit={handleSubmit(submit)} className="signup-form">
            <div className="signup-field">
              <label className="signup-label" htmlFor="name">Full name</label>
              <input id="name" type="text" autoComplete="name" className="signup-input" {...register('name')} placeholder="Enter your full name" />
              {errors.name?.message && <p className="signup-error">{errors.name.message}</p>}
            </div>
            <div className="signup-field">
              <label className="signup-label" htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="email" className="signup-input" {...register('email')} placeholder="Enter your email" />
              {errors.email?.message && <p className="signup-error">{errors.email.message}</p>}
            </div>
            <div className="signup-field">
              <label className="signup-label" htmlFor="password">Password</label>
              <input id="password" type="password" autoComplete="new-password" className="signup-input" {...register('password')} placeholder="Create a password" />
              {errors.password?.message && <p className="signup-error">{errors.password.message}</p>}
            </div>
            <div className="signup-field">
              <label className="signup-label" htmlFor="phone">Phone (optional)</label>
              <input id="phone" type="tel" autoComplete="tel" className="signup-input" {...register('phone')} placeholder="Enter your phone number" />
            </div>
            <div className="signup-field signup-field-confirm">
              <label className="signup-label" htmlFor="confirmPassword">Confirm password</label>
              <input id="confirmPassword" type="password" autoComplete="new-password" className="signup-input" {...register('confirmPassword')} placeholder="Confirm your password" />
              {errors.confirmPassword?.message && <p className="signup-error">{errors.confirmPassword.message}</p>}
            </div>
            <div className="signup-terms">
              <label className="signup-terms-label">
                <input type="checkbox" className="signup-terms-checkbox" {...register('acceptTerms')} />
                <span>I agree to the terms and conditions</span>
              </label>
              {errors.acceptTerms?.message && <p className="signup-error">{errors.acceptTerms.message}</p>}
            </div>
            {errors.root?.message && <p className="signup-error">{errors.root.message}</p>}
            <button type="submit" disabled={isSubmitting} className="signup-button">
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
            <p className="signup-footer-text">
              Already have an account?{' '}
              <a href="#" className="signup-footer-link" onClick={(e) => { e.preventDefault(); router.push('/login'); }}>Login here</a>
            </p>
          </form>
          <p className="signup-branding">
            <span className="signup-brand-1">Handicraft</span>{' '}
            <span className="signup-brand-2">Online Store</span>
          </p>
        </div>
      </main>
    </div>
  );
}
