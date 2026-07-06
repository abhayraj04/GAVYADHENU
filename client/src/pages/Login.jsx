import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Invalid email or password. Please try again.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <main className="auth">
      <form onSubmit={submit}>
        <span className="auth-badge">Welcome Back</span>
        <h1>Login to your account</h1>
        <p className="auth-subtitle">Enter your credentials to access your orders, wishlist and checkout faster.</p>

        {error && <div className="auth-error">{error}</div>}

        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </label>

        <button className="btn full" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="auth-footer">
          New user? <Link to="/register">Create account</Link>
        </p>
      </form>
    </main>
  );
}
