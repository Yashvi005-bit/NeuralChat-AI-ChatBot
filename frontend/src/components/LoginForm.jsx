import { useState } from 'react';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function LoginForm({ onSwitchToSignup, onClose }) {
  const { setIsAuth, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email.';
    if (!password) errs.password = 'Password is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setToast(null);

    try {
      const data = await loginUser(email, password);
      // Update auth context so App routes to ChatPage
      setUser({ name: data?.name || '', email });
      setIsAuth(true);
      setToast({ type: 'success', message: '✓ Welcome back! You\'re signed in.' });
      setTimeout(() => onClose?.(), 1800);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate aria-label="Login form">
      <h2 className="auth-form__title">Welcome back</h2>
      <p className="auth-form__subtitle">Sign in to your NeuralChat account.</p>

      <div className="auth-form__fields">
        {/* Email */}
        <div className="auth-field">
          <label className="auth-field__label" htmlFor="login-email">Email</label>
          <div className="auth-field__input-wrap">
            <input
              id="login-email"
              className={`auth-field__input ${errors.email ? 'auth-field__input--error' : ''}`}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
              required
              autoComplete="email"
              aria-describedby={errors.email ? 'login-email-error' : undefined}
            />
          </div>
          {errors.email && <span id="login-email-error" className="auth-field__error" role="alert">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="auth-field">
          <label className="auth-field__label" htmlFor="login-password">Password</label>
          <div className="auth-field__input-wrap">
            <input
              id="login-password"
              className={`auth-field__input ${errors.password ? 'auth-field__input--error' : ''}`}
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
              required
              autoComplete="current-password"
              aria-describedby={errors.password ? 'login-pw-error' : undefined}
            />
            <button
              type="button"
              className="auth-field__toggle"
              onClick={() => setShowPw(!showPw)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPw} />
            </button>
          </div>
          {errors.password && <span id="login-pw-error" className="auth-field__error" role="alert">{errors.password}</span>}
          <button type="button" className="auth-form__forgot">Forgot password?</button>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary auth-form__submit"
        disabled={loading}
        id="login-submit-btn"
      >
        {loading ? (
          <>
            <span className="auth-form__spinner" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          'Log In'
        )}
      </button>

      {toast && (
        <div className={`auth-toast auth-toast--${toast.type}`} role="alert" aria-live="polite">
          {toast.message}
        </div>
      )}

      <p className="auth-form__footer">
        Don't have an account?{' '}
        <button type="button" className="auth-form__footer-link" onClick={onSwitchToSignup}>
          Sign Up
        </button>
      </p>
    </form>
  );
}
