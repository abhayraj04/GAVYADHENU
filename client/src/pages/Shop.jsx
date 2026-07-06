import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const categories = [
  '',
  'Ghee',
  'Cold Pressed Oils',
  'Honey',
  'Organic Atta',
  'Superfoods',
  'Dry Fruits',
  'Herbal Products',
  'Combos',
  'Immunity Boosters',
  'Spices'
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProducts = async (query = keyword, selectedCategory = category) => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (query?.trim()) params.keyword = query.trim();
      if (selectedCategory?.trim()) params.category = selectedCategory.trim();
      const { data } = await API.get('/products', { params });
      setProducts(data.products || []);
      if (!data.products?.length) {
        setError('No products matched your search. Try another keyword or category.');
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
      const serverMessage = err?.response?.data?.message;
      const status = err?.response?.status;
      setError(serverMessage || (status ? `Server returned ${status}` : err.message) || 'Unable to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentKeyword = searchParams.get('keyword') || '';
    const currentCategory = searchParams.get('category') || '';
    setKeyword(currentKeyword);
    setCategory(currentCategory);
    loadProducts(currentKeyword, currentCategory);
  }, [searchParams]);

  const updateSearchParams = (newKeyword, newCategory) => {
    const params = {};
    if (newKeyword.trim()) params.keyword = newKeyword.trim();
    if (newCategory.trim()) params.category = newCategory.trim();
    setSearchParams(params);
  };

  const handleSearchKey = (e) => {
    if (e.key === 'Enter') {
      updateSearchParams(keyword, category);
    }
  };

  const handleSearchClick = () => {
    updateSearchParams(keyword, category);
    loadProducts(keyword, category);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    updateSearchParams(keyword, value);
    loadProducts(keyword, value);
  };

  return (
    <main className="section">
      <h1>Shop Gavyadhenu Products</h1>
      <div className="filters">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleSearchKey}
          placeholder="Search products..."
        />
        <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat || 'All Categories'}</option>
          ))}
        </select>
        <button className="btn" onClick={handleSearchClick}>Search</button>
      </div>
      {loading && <p>Loading products…</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="product-grid">
        {products.map(p => <ProductCard product={p} key={p._id}/>)}
      </div>
    </main>
  );
}
