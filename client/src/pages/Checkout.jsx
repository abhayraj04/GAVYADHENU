import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, total, loadCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ fullName:'', phone:'', addressLine:'', city:'', state:'', pincode:'' });

  const placeOrder = async () => {
    try {
      await API.post('/orders', {
        items: items.map(i => ({ productId: i.product._id, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod: 'COD'
      });
      await loadCart();
      navigate('/orders');
    } catch {
      alert('Order failed');
    }
  };

  return (
    <main className="section checkout">
      <h1>Checkout</h1>
      <div className="form-grid">
        {Object.keys(address).map(k => (
          <input key={k} placeholder={k} onChange={e => setAddress({...address, [k]:e.target.value})}/>
        ))}
      </div>
      <h2>Payable Amount: ₹{total}</h2>
      <button className="btn" onClick={placeOrder}>Place COD Order</button>
    </main>
  );
}
