'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import '@/styles/forgetpasswordscreen.css';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Forgot Password - Handicraft Online Store';
    return () => { document.title = 'Handicraft Online Store'; };
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (_values: ForgotPasswordData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
  };

  return (
    <div className="forgot-page">
      <header className="forgot-header">
        <div className="forgot-header-left">
          <img src="/images/logo.png" alt="Handicraft Online Store" className="forgot-logo" />
          <span className="forgot-store-name">Handicraft Online Store</span>
        </div>
        <button type="button" className="forgot-header-back" onClick={() => router.push('/login')}>Back to Login</button>
      </header>

      <main className="forgot-main">
        <div className="forgot-bg-logo" aria-hidden>
          <img src="/images/logo.png" alt="" />
        </div>
        <div className="forgot-form-wrapper">
          <h2 className="forgot-heading">Forgot Password</h2>
          <p className="forgot-subtext">
            Enter the email address you used to sign up. We&apos;ll send you a link to reset your password.
          </p>

          {submitted ? (
            <div className="forgot-success">
              <div className="forgot-success-icon" aria-hidden>✓</div>
              <p className="forgot-success-title">Check your email</p>
              <p className="forgot-success-text">
                If an account exists for that email, we&apos;ve sent password reset instructions.
              </p>
              <button type="button" className="forgot-btn-primary" onClick={() => router.push('/login')}>Back to Login</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="forgot-form">
              <div className="forgot-field">
                <label className="forgot-label" htmlFor="forgot-email">Email address</label>
                <input id="forgot-email" type="email" autoComplete="email" className="forgot-input" placeholder="you@example.com" {...register('email')} />
                {errors.email?.message && <p className="forgot-error">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="forgot-btn-submit">
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          )}

          <p className="forgot-footer">
            Remember your password?{' '}
            <button type="button" className="forgot-link" onClick={() => router.push('/login')}>Login</button>
          </p>
        </div>
      </main>
    </div>
  );
}
