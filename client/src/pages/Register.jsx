import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      navigate('/');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed. Please check your details and try again.';
      setError(message);
      setLoading(false);
    }
  };

  const updateField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <main className="auth">
      <form onSubmit={submit}>
        <span className="auth-badge">Join Gavyadhenu</span>
        <h1>Create your account</h1>
        <p className="auth-subtitle">Sign up to save favourites, track orders, and checkout faster.</p>

        {error && <div className="auth-error">{error}</div>}

        <label>
          Full name
          <input
            type="text"
            value={form.name}
            onChange={updateField('name')}
            placeholder="Your name"
            autoComplete="name"
          />
        </label>

        <label>
          Email address
          <input
            type="email"
            value={form.email}
            onChange={updateField('email')}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label>
          Phone number
          <input
            type="tel"
            value={form.phone}
            onChange={updateField('phone')}
            placeholder="Phone number"
            autoComplete="tel"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={updateField('password')}
            placeholder="Create a password"
            autoComplete="new-password"
          />
        </label>

        <label>
          Confirm password
          <input
            type="password"
            value={form.confirmPassword}
            onChange={updateField('confirmPassword')}
            placeholder="Repeat password"
            autoComplete="new-password"
          />
        </label>

        <button className="btn full" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
