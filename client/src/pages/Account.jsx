import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, loading } = useAuth();

  if (loading) return <main className="section center">Loading account...</main>;

  return (
    <main className="section account-page">
      <div className="account-hero">
        <div>
          <span className="badge">Your Account</span>
          <h1>Welcome back, {user?.name || 'Gavyadhenu User'}</h1>
          <p>
            Manage your orders, wishlist, and profile information from one place.
          </p>
        </div>
        <div className="account-summary">
          <div>
            <p>Name</p>
            <strong>{user?.name || '—'}</strong>
          </div>
          <div>
            <p>Email</p>
            <strong>{user?.email || '—'}</strong>
          </div>
          <div>
            <p>Role</p>
            <strong>{user?.role === 'admin' ? 'Admin' : 'Customer'}</strong>
          </div>
        </div>
      </div>

      <section className="account-grid">
        <Link to="/orders" className="account-card">
          <h2>Track Orders</h2>
          <p>See your order status and history.</p>
        </Link>

        <Link to="/wishlist" className="account-card">
          <h2>Wishlist</h2>
          <p>View saved items and favorite products.</p>
        </Link>

        <Link to="/cart" className="account-card">
          <h2>My Cart</h2>
          <p>Open your cart and continue shopping.</p>
        </Link>

        <Link to="/orders" className="account-card">
          <h2>Order Tracking</h2>
          <p>Track any active order from checkout to delivery.</p>
        </Link>
      </section>
    </main>
  );
}
