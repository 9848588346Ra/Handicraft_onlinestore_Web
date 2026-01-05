import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterData, registerSchema } from './schema';
import './singnupscreen.css';

interface SignupScreenProps {
  onNavigateToLogin?: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigateToLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
  });

  const submit = async (values: RegisterData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('register', values);
    // Navigate to login after successful registration
    onNavigateToLogin?.();
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Sign up to get started</p>
          </div>
          
          <form onSubmit={handleSubmit(submit)} className="auth-form">
            <div className="form-field">
              <label className="form-label" htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className="form-input"
                {...register('name')}
                placeholder="Jane Doe"
              />
              {errors.name?.message && (
                <p className="form-error">{errors.name.message}</p>
              )}
            </div>

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
                autoComplete="new-password"
                className="form-input"
                {...register('password')}
                placeholder="••••••"
              />
              {errors.password?.message && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="form-input"
                {...register('confirmPassword')}
                placeholder="••••••"
              />
              {errors.confirmPassword?.message && (
                <p className="form-error">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="form-button"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>

            <div className="form-footer">
              Already have an account?{' '}
              <a
                href="#"
                className="form-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToLogin?.();
                }}
              >
                Log in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
