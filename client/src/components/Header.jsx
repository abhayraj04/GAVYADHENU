 import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Phone,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API from "../services/api";

export default function Header() {
  const [networkError, setNetworkError] = useState('');
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  const doLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const loadSuggestions = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const { data } = await API.get('/products', { params: { keyword: value.trim() } });
      setSuggestions(data.products?.slice(0, 5) || []);
    } catch {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (q) => {
    const query = (q ?? searchQuery).trim();
    setShowSuggestions(false);
    if (!query) {
      navigate('/shop');
    } else {
      navigate(`/shop?keyword=${encodeURIComponent(query)}`);
    }
    setSearchOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const onError = (e) => setNetworkError(e?.detail?.message || 'Network or server problem');
    const onOk = () => setNetworkError('');
    window.addEventListener('api-network-error', onError);
    window.addEventListener('api-network-ok', onOk);
    return () => {
      window.removeEventListener('api-network-error', onError);
      window.removeEventListener('api-network-ok', onOk);
    };
  }, []);

  return (
    <>
      <div className="gavy-topbar">
          <div>
            {networkError ? (
              <strong className="network-banner">⚠️ {networkError} — trying to reconnect...</strong>
            ) : (
              <>🌿 FREE SHIPPING on orders above ₹999 | 100% Natural & Chemical Free Products</>
            )}
          </div>

        <div className="gavy-top-right">
          <span>Track Order</span>
          <span>Help & Support</span>
          <span className="phone">
            <Phone size={14} /> +91 98765 43210
          </span>
        </div>
      </div>

      <header className="gavy-header">
        <Link to="/" className="gavy-logo" onClick={closeMenu}>
           <img src="/Logo.png" alt="Gavyadhenu" />
          <div>
            <h1>GAVYADHENU</h1>
            <p>Purity. Tradition. Wellness.</p>
          </div>
        </Link>

        <nav className={open ? "gavy-nav open" : "gavy-nav"}>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/shop" onClick={closeMenu}>Shop</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About Us</NavLink>
          <NavLink to="/blogs" onClick={closeMenu}>Blogs</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact Us</NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>
          )}
        </nav>

        <div className="gavy-right">
          <div className="gavy-actions">
            <div className="gavy-search">
              <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
                <Search />
              </button>
              {searchOpen && (
                <div className="search-overlay">
                  <div className="search-wrapper">
                    <input
                      ref={searchInputRef}
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearchQuery(value);
                        if (value.trim()) {
                          setShowSuggestions(true);
                          loadSuggestions(value);
                        } else {
                          setShowSuggestions(false);
                        }
                      }}
                      onFocus={() => {
                        if (searchQuery.trim()) setShowSuggestions(true);
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 150);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearchSubmit();
                        if (e.key === 'Escape') {
                          setSearchOpen(false);
                          setShowSuggestions(false);
                        }
                      }}
                      placeholder="Search products..."
                      aria-label="Search products"
                      autoFocus
                    />
                    <button className="icon-btn" aria-label="Submit search" onClick={() => handleSearchSubmit()}>
                      <Search />
                    </button>
                    <button className="icon-btn" aria-label="Close search" onClick={() => { setSearchOpen(false); setSearchQuery(''); setShowSuggestions(false); }}>
                      <X />
                    </button>
                  </div>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="search-suggestions">
                      {suggestions.map((product) => (
                        <button
                          key={product._id}
                          type="button"
                          className="suggestion-item"
                          onMouseDown={() => handleSearchSubmit(product.name)}
                        >
                          {product.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {user ? (
              <Link to="/account" className="plain-btn" onClick={closeMenu}>
                My Account
              </Link>
            ) : (
              <Link to="/login" className="icon-btn" onClick={closeMenu}>
                <User />
              </Link>
            )}

            <Link to="/wishlist" className="gavy-icon-badge" onClick={closeMenu}>
              <Heart />
              <span>3</span>
            </Link>

            <Link to="/cart" className="gavy-icon-badge" onClick={closeMenu}>
              <ShoppingCart />
              <span>{count}</span>
            </Link>
          </div>

          <button
            className="gavy-menu"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>
    </>
  );
}