'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export function SignInWarning() {
  const { signInWarning, setSignInWarning } = useApp();
  const router = useRouter();

  if (!signInWarning) return null;

  return (
    <div className="app-signin-warning" role="alert">
      <span className="app-signin-warning-text">{signInWarning}</span>
      <div className="app-signin-warning-actions">
        <button type="button" className="app-signin-warning-btn" onClick={() => setSignInWarning(null)}>Dismiss</button>
        <button
          type="button"
          className="app-signin-warning-btn app-signin-warning-btn-primary"
          onClick={() => { setSignInWarning(null); router.push('/login'); }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
