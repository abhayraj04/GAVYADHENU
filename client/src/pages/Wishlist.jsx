import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    API.get('/wishlist').then(res => setProducts(res.data.products || []));
  }, []);
  return <main className="section"><h1>Wishlist</h1><div className="product-grid">{products.map(p => <ProductCard product={p} key={p._id}/>)}</div></main>;
}
