import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../services/api';

export default function Cart() {
  const { items, total, updateCart, removeFromCart } = useCart();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const applyCoupon = async () => {
    try {
      const { data } = await API.post('/coupons/apply', { code: coupon, totalAmount: total });
      setDiscount(data.discountAmount);
    } catch {
      alert('Invalid coupon');
    }
  };

  return (
    <main className="section">
      <h1>Your Cart</h1>
      {items.length === 0 ? <p>Cart is empty.</p> : items.map(item => (
        <div className="cart-item" key={item.product._id}>
          <img src={item.product.images?.[0]} />
          <div><b>{item.product.name}</b><p>₹{item.product.price}</p></div>
          <input type="number" min="1" value={item.quantity} onChange={e => updateCart(item.product._id, Number(e.target.value))}/>
          <button onClick={() => removeFromCart(item.product._id)}>Remove</button>
        </div>
      ))}
      <div className="cart-summary">
        <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code PURE20" />
        <button onClick={applyCoupon}>Apply</button>
        <h2>Total: ₹{total - discount}</h2>
        <p>Discount: ₹{discount}</p>
        <Link className="btn" to="/checkout">Checkout</Link>
      </div>
    </main>
  );
}
