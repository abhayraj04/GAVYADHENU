import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const { addToCart } = useCart();

  useEffect(() => {
    API.get(`/products/${slug}`).then(res => setProduct(res.data));
  }, [slug]);

  const submitReview = async () => {
    await API.post('/reviews', { productId: product._id, rating, comment });
    alert('Review submitted');
    setComment('');
  };

  if (!product) return <p className="center">Loading...</p>;

  return (
    <main className="details">
      <div className="details-img">
        <img src={product.images?.[0]} alt={product.name} />
      </div>
      <div>
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>

        <div className="big-price">₹{product.price} <del>₹{product.mrp}</del></div>
        <p>{product.description}</p>
        <h3>Benefits</h3>
        <ul>{product.benefits?.map(b => <li key={b}>{b}</li>)}</ul>
        <button className="btn" onClick={() => addToCart(product._id)}>Add to Cart</button>

        <div className="review-box">
          <h3>Write a Review</h3>
          <select value={rating} onChange={e => setRating(e.target.value)}>
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star</option>)}
          </select>
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Your review"></textarea>
          <button onClick={submitReview}>Submit</button>
        </div>
      </div>
    </main>
  );
}
