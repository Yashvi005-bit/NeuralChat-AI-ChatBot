import { useState } from 'react';
import { signupUser } from '../api/auth';

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

function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: 'Too short', color: '#FF4444', pct: '10%' },
    { label: 'Weak', color: '#FF4444', pct: '30%' },
    { label: 'Fair', color: '#FFAA00', pct: '55%' },
    { label: 'Good', color: '#00FF94', pct: '80%' },
    { label: 'Strong', color: '#00FF94', pct: '100%' },
  ];
  return map[score] || map[0];
}

export default function SignupForm({ onSwitchToLogin, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const strength = getStrength(password);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 6) errs.password = 'Must be at least 6 characters.';
    if (!confirm) errs.confirm = 'Please confirm your password.';
    else if (confirm !== password) errs.confirm = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setToast(null);

    try {
      await signupUser(name, email, password);
      setToast({ type: 'success', message: '✓ Account created! Welcome to NeuralChat.' });
      setTimeout(() => {
        onClose?.();
        onSwitchToLogin?.(); // optionally switch to login immediately
      }, 2000);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate aria-label="Sign up form">
      <h2 className="auth-form__title">Create account</h2>
      <p className="auth-form__subtitle">Join 50,000+ teams building with NeuralChat.</p>

      <div className="auth-form__fields">
        {/* Name */}
        <div className="auth-field">
          <label className="auth-field__label" htmlFor="signup-name">Full Name</label>
          <div className="auth-field__input-wrap">
            <input
              id="signup-name"
              className={`auth-field__input ${errors.name ? 'auth-field__input--error' : ''}`}
              type="text"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
              required
              autoComplete="name"
            />
          </div>
          {errors.name && <span className="auth-field__error" role="alert">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="auth-field">
          <label className="auth-field__label" htmlFor="signup-email">Email</label>
          <div className="auth-field__input-wrap">
            <input
              id="signup-email"
              className={`auth-field__input ${errors.email ? 'auth-field__input--error' : ''}`}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
              required
              autoComplete="email"
            />
          </div>
          {errors.email && <span className="auth-field__error" role="alert">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="auth-field">
          <label className="auth-field__label" htmlFor="signup-password">Password</label>
          <div className="auth-field__input-wrap">
            <input
              id="signup-password"
              className={`auth-field__input ${errors.password ? 'auth-field__input--error' : ''}`}
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
              required
              autoComplete="new-password"
              aria-describedby="pw-strength-label"
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
          {errors.password && <span className="auth-field__error" role="alert">{errors.password}</span>}
          {password && (
            <div className="password-strength" aria-live="polite">
              <div className="password-strength__bar">
                <div
                  className="password-strength__fill"
                  style={{ width: strength.pct, background: strength.color }}
                />
              </div>
              <span
                id="pw-strength-label"
                className="password-strength__label"
                style={{ color: strength.color }}
              >
                {strength.label}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="auth-field">
          <label className="auth-field__label" htmlFor="signup-confirm">Confirm Password</label>
          <div className="auth-field__input-wrap">
            <input
              id="signup-confirm"
              className={`auth-field__input ${errors.confirm ? 'auth-field__input--error' : ''}`}
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: '' })); }}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-field__toggle"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {errors.confirm && <span className="auth-field__error" role="alert">{errors.confirm}</span>}
          {confirm && !errors.confirm && confirm === password && (
            <span className="auth-field__error" style={{ color: '#4ade80' }} role="status">✓ Passwords match</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary auth-form__submit"
        disabled={loading}
        id="signup-submit-btn"
      >
        {loading ? (
          <>
            <span className="auth-form__spinner" aria-hidden="true" />
            Creating account…
          </>
        ) : (
          'Create Account'
        )}
      </button>

      {toast && (
        <div className={`auth-toast auth-toast--${toast.type}`} role="alert" aria-live="polite">
          {toast.message}
        </div>
      )}

      <p className="auth-form__footer">
        Already have an account?{' '}
        <button type="button" className="auth-form__footer-link" onClick={onSwitchToLogin}>
          Log In
        </button>
      </p>
    </form>
  );
}
