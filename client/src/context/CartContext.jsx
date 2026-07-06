import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const loadCart = async () => {
    try {
      const token = localStorage.getItem('gavyadhenu_token');
      if (!token) return;
      const { data } = await API.get('/cart');
      setItems(data.items || []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await API.post('/cart/add', { productId, quantity });
    setItems(data.items);
  };

  const updateCart = async (productId, quantity) => {
    const { data } = await API.put('/cart/update', { productId, quantity });
    setItems(data.items);
  };

  const removeFromCart = async (productId) => {
    const { data } = await API.delete(`/cart/remove/${productId}`);
    setItems(data.items);
  };

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.product?.price || item.price || 0) * item.quantity, 0);

  return <CartContext.Provider value={{ items, count, total, loadCart, addToCart, updateCart, removeFromCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
