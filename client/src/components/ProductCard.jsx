import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../services/api';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const addWishlist = async () => {
    try {
      await API.post('/wishlist/add', { productId: product._id });
      alert('Added to wishlist');
    } catch {
      alert('Please login first');
    }
  };

  const imageSrc = product.images?.[0] || '/Logo.png';
  const productImage = imageSrc.startsWith('http') || imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;

  return (
    <div className="product-card">
      {product.badges?.[0] && <span className="badge">{product.badges[0]}</span>}
      <button className="heart" onClick={addWishlist}><Heart size={18}/></button>
      <Link to={`/product/${product.slug}`}>
        <img
          src={productImage}
          alt={product.name}
          onError={(e) => { if (e.target.src !== '/Logo.png') e.target.src = '/Logo.png'; }}
        />
      </Link>
      <div className="product-info">
        <p className="small">{product.category}</p>
        <Link to={`/product/${product.slug}`} className="product-title">{product.name}</Link>

        <div className="price-row">
          <b>₹{product.price}</b>
          <del>₹{product.mrp}</del>
        </div>
        <p className="best-price">Best price with coupon: ₹{Math.max(product.price - 50, 1)}</p>
        <button className="btn full" onClick={() => addToCart(product._id)}>Add to Cart</button>
      </div>
    </div>
  );
}
