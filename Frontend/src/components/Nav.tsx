'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function Nav() {
  const router = useRouter();
  const { currentUser, cartItems, logout } = useApp();
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const isAuthenticated = !!currentUser;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 1.5rem',
      background: '#2c3e50',
      color: '#fff',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>Handicraft Store</span>
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/products">Products</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/cart">Cart ({cartCount})</Link>
        {isAuthenticated ? (
          <>
            <Link href="/profile">Profile</Link>
            <Link href="/admin">Admin</Link>
            <button onClick={handleLogout} style={{
              background: 'transparent',
              border: '1px solid #fff',
              color: '#fff',
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
