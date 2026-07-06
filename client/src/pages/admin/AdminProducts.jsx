import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const categoryOptions = ['Ghee', 'Cold Pressed Oils', 'Honey', 'Organic Atta', 'Dry Fruits', 'Herbal Products', 'Combos'];
const empty = { name: '', description: '', category: 'Ghee', price: 0, mrp: 0, stock: 10, images: '' };

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products');
      const loaded = data.products || [];
      setProducts(loaded);
      setFilteredProducts(loaded);
    } catch (error) {
      setStatus({ type: 'error', message: 'Unable to load products. Please refresh.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
      const matchesSearch = normalizedSearch === '' ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description?.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, filterCategory, products]);

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.images.trim()) {
      setStatus({ type: 'error', message: 'Name, description and image URL are required.' });
      return;
    }

    try {
      setLoading(true);
      const payload = { ...form, images: [form.images.trim()] };
      if (editingId) {
        await API.put(`/admin/products/${editingId}`, payload);
        setStatus({ type: 'success', message: 'Product updated successfully.' });
      } else {
        await API.post('/admin/products', payload);
        setStatus({ type: 'success', message: 'Product added successfully.' });
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Save failed. Check the product data and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product) => {
    setForm({
      name: product.name || '',
      description: product.description || '',
      category: product.category || 'Ghee',
      price: product.price || 0,
      mrp: product.mrp || 0,
      stock: product.stock || 0,
      images: product.images?.[0] || '',
    });
    setEditingId(product._id);
    setStatus({ type: '', message: '' });
  };

  const cancelEdit = () => {
    setForm(empty);
    setEditingId(null);
    setStatus({ type: '', message: '' });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      setLoading(true);
      await API.delete(`/admin/products/${id}`);
      setStatus({ type: 'success', message: 'Product deleted successfully.' });
      load();
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Delete failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section admin-panel">
      <div className="admin-header">
        <div>
          <h1>Manage Products</h1>
          <p>Quickly add, edit, or remove products from your store catalog.</p>
        </div>
        <div className="admin-actions">
          <button className="btn" type="button" onClick={cancelEdit} disabled={!editingId}>
            Clear Form
          </button>
        </div>
      </div>

      {status.message && (
        <div className={`admin-alert ${status.type === 'error' ? 'error' : 'success'}`}>
          {status.message}
        </div>
      )}

      <form className="admin-form" onSubmit={saveProduct}>
        <label>
          Product Name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter product name"
          />
        </label>

        <label>
          Category
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label>
          Price
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            min="0"
          />
        </label>

        <label>
          MRP
          <input
            type="number"
            value={form.mrp}
            onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
            min="0"
          />
        </label>

        <label>
          Stock Quantity
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            min="0"
          />
        </label>

        <label>
          Image URL
          <input
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            placeholder="Paste image URL"
          />
        </label>

        <label className="full-width">
          Description
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Write a short product description"
          />
        </label>

        <div className="admin-form-actions full-width">
          <button className="btn" type="submit" disabled={loading}>
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button className="btn btn-secondary" type="button" onClick={cancelEdit} disabled={loading}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <section className="admin-table-wrap">
        <div className="admin-table-header">
          <div>
            <h2>Product Catalog</h2>
            <p>{filteredProducts.length} of {products.length} items shown</p>
          </div>

          <div className="admin-filter-row">
            <input
              className="admin-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description"
            />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading products…</p>
        ) : products.length === 0 ? (
          <p>No products found. Add a product using the form above.</p>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>MRP</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="admin-product-cell">
                        {product.images?.[0] && <img src={product.images[0]} alt={product.name} />}
                        <div>
                          <strong>{product.name}</strong>
                          <span>{product.description?.slice(0, 60)}{product.description?.length > 60 ? '…' : ''}</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>₹{product.price}</td>
                    <td>₹{product.mrp}</td>
                    <td>{product.stock}</td>
                    <td className="admin-table-actions">
                      <button className="btn btn-secondary" type="button" onClick={() => editProduct(product)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" type="button" onClick={() => deleteProduct(product._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
