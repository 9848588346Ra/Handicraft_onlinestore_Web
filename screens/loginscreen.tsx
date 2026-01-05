import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginData, loginSchema } from './schema';
import './loginscreen.css';

interface LoginScreenProps {
  onNavigateToSignup?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToSignup }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  });

  const submit = async (values: LoginData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('login', values);
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Log in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit(submit)} className="auth-form">
            <div className="form-field">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="form-input"
                {...register('email')}
                placeholder="you@example.com"
              />
              {errors.email?.message && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="form-input"
                {...register('password')}
                placeholder="••••••"
              />
              {errors.password?.message && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="form-button"
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </button>

            <div className="form-footer">
              Don't have an account?{' '}
              <a
                href="#"
                className="form-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToSignup?.();
                }}
              >
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
