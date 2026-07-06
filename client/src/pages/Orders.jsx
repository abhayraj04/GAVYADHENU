import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { API.get('/orders/my-orders').then(res => setOrders(res.data)); }, []);
  return (
    <main className="section">
      <h1>My Orders</h1>
      {orders.map(o => (
        <div className="order-card" key={o._id}>
          <h3>Order #{o._id.slice(-6)}</h3>
          <p>Status: {o.orderStatus}</p>
          <p>Payment: {o.paymentStatus}</p>
          <b>Total: ₹{o.totalAmount}</b>
        </div>
      ))}
    </main>
  );
}
