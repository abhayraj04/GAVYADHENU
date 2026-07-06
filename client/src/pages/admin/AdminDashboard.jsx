import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  useEffect(() => { API.get('/admin/dashboard').then(res => setStats(res.data)); }, []);
  return (
    <main className="section">
      <h1>Admin Dashboard</h1>
      <div className="stats">
        <div><h2>{stats.products || 0}</h2><p>Products</p></div>
        <div><h2>{stats.orders || 0}</h2><p>Orders</p></div>
        <div><h2>{stats.users || 0}</h2><p>Users</p></div>
        <div><h2>₹{stats.revenue || 0}</h2><p>Revenue</p></div>
      </div>
      <div className="admin-links">
        <Link className="btn" to="/admin/products">Manage Products</Link>
        <Link className="btn" to="/admin/orders">Manage Orders</Link>
      </div>
    </main>
  );
}
