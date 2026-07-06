import React, { useEffect, useState } from 'react';
import API from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const load = async () => {
    const { data } = await API.get('/admin/orders');
    setOrders(data);
  };
  useEffect(() => { load(); }, []);

  const update = async (id, status) => {
    await API.put(`/admin/orders/${id}/status`, { orderStatus: status });
    load();
  };

  return (
    <main className="section">
      <h1>Manage Orders</h1>
      {orders.map(o => (
        <div className="order-card" key={o._id}>
          <h3>{o.user?.name} - ₹{o.totalAmount}</h3>
          <p>Status: {o.orderStatus}</p>
          <select value={o.orderStatus} onChange={e => update(o._id, e.target.value)}>
            <option>Placed</option><option>Packed</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
          </select>
        </div>
      ))}
    </main>
  );
}
