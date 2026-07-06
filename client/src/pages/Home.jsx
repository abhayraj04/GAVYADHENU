 import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const categories = [
  ["🐄", "A2 Ghee", "Ghee"],
  ["🛢️", "Cold Pressed Oils", "Cold Pressed Oils"],
  ["🍯", "Honey", "Honey"],
  ["🌾", "Organic Atta", "Organic Atta"],
  ["🌿", "Superfoods", "Superfoods"],
  ["🥜", "Dry Fruits", "Dry Fruits"],
  ["🥣", "Herbal Products", "Herbal Products"],
  ["🛡️", "Immunity Boosters", "Immunity Boosters"],
  ["🎁", "Healthy Combos", "Combos"],
  ["▦", "View All Products", ""],
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const { data } = await API.get('/products', { params: { featured: 'true' } });
        if (data.products?.length) {
          setProducts(data.products.slice(0, 4));
          return;
        }
        const fallback = await API.get('/products');
        setProducts(fallback.data.products?.slice(0, 4) || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <main className="gavy-home">
      <section className="gavy-hero">
        <div className="gavy-hero-left">
          <h1>
            Pure by Nature, <br />
            <span>Nourishing by Tradition</span>
          </h1>

          <div className="gavy-decor">━ ✦ ━</div>

          <p>
            Experience the goodness of A2 Ghee, Cold Pressed Oils, Natural Honey,
            Organic Grains and more. Made with love, delivered with care.
          </p>

          <div className="gavy-hero-btns">
            <Link to="/shop" className="gavy-btn dark">Shop Now →</Link>
            <Link to="/shop?category=Combos" className="gavy-btn light">Explore Combos 🎁</Link>
          </div>

          <div className="gavy-trust">
            <span>🌿 100% Natural</span>
            <span>🧪 Chemical Free</span>
            <span>⚗️ Lab Tested</span>
            <span>👨‍👩‍👧 Trusted by families nationwide</span>
          </div>
        </div>

        <div className="gavy-hero-right">
          <div className="trusted-seal">
            <small>TRUSTED BY</small>
            <b>25K+</b>
            <small>FAMILIES</small>
          </div>

          <div className="packshot">
            <div className="product honey">Raw Honey</div>
            <div className="product ghee">A2 Cow<br />Ghee</div>
            <div className="product oil">Cold Pressed<br />Oil</div>
            <div className="grain"></div>
          </div>
        </div>
      </section>

      <section className="gavy-categories">
        {categories.map(([icon, label, category]) => (
          <Link key={label} to={category ? `/shop?category=${encodeURIComponent(category)}` : '/shop'}>
            <span>{icon}</span>
            <b>{label}</b>
          </Link>
        ))}
      </section>

      <section className="gavy-content-grid">
        <div className="gavy-best">
          <div className="gavy-title-row">
            <h2>🌿 Best Sellers</h2>
            <Link to="/shop">View All Products →</Link>
          </div>

          <div className="gavy-products">
            {loading ? (
              <p>Loading featured products…</p>
            ) : products.length > 0 ? (
              products.map((p) => <ProductCard product={p} key={p._id} />)
            ) : (
              <p>No products found. Run backend seed first.</p>
            )}
          </div>
        </div>

        <div className="gavy-why">
          <h2>Why Choose Gavyadhenu?</h2>
          <ul>
            <li>Sourced from Trusted Farmers</li>
            <li>No Preservatives or Additives</li>
            <li>Premium Quality Assured</li>
            <li>100% Natural Products</li>
          </ul>
          <div className="cow-bg">🐄</div>
        </div>
      </section>

      {/* ================= PREMIUM STATS ================= */}

<section className="premium-stats">

<div>
<h2>Trusted</h2>
<p>by families nationwide</p>
</div>

<div>
<h2>100+</h2>
<p>Natural Products</p>
</div>

<div>
<h2>1000+</h2>
<p>Daily Orders</p>
</div>

<div>
<h2>99%</h2>
<p>Repeat Customers</p>
</div>

</section>

{/* ================= OUR STORY ================= */}

<section className="our-story">

<div className="story-content">

<span>OUR STORY</span>

<h2>
Ancient Wisdom,
Modern Wellness
</h2>

<p>
Gavyadhenu is inspired by India's
traditional food heritage.
We bring carefully selected natural,
pure and healthy products to modern families.
</p>

<ul>

<li>✓ 100% Natural Products</li>

<li>✓ Trusted by Thousands</li>

<li>✓ Farm Inspired Sourcing</li>

<li>✓ Premium Quality Promise</li>

</ul>

<button className="btn">
Explore Collection
</button>

</div>

<div className="story-image">

<img
src="/Logo.png"
/>

</div>

</section>

{/* ================= HEALTH GOALS ================= */}

<section className="health-goals">

<div className="section-title">

<span>SHOP BY HEALTH GOAL</span>

<h2>Choose Wellness For Your Lifestyle</h2>

</div>

<div className="goal-grid">

<div>
<span>💪</span>
<h3>Energy</h3>
<p>Daily nutrition essentials.</p>
</div>

<div>
<span>🛡</span>
<h3>Immunity</h3>
<p>Stay healthy naturally.</p>
</div>

<div>
<span>❤️</span>
<h3>Heart Care</h3>
<p>Healthy lifestyle choices.</p>
</div>

<div>
<span>⚖</span>
<h3>Weight Control</h3>
<p>Smart nutritional support.</p>
</div>

<div>
<span>👨‍👩‍👧</span>
<h3>Family Wellness</h3>
<p>For complete family care.</p>
</div>

<div>
<span>🌿</span>
<h3>Detox</h3>
<p>Clean and natural living.</p>
</div>

</div>

</section>

{/* ================= WHY US ================= */}

<section className="why-us">

<div className="section-title">

<span>WHY GAVYADHENU</span>

<h2>What Makes Us Different</h2>

</div>

<div className="why-grid">

<div>
<h3>🌿 Natural</h3>
<p>No chemicals or preservatives.</p>
</div>

<div>
<h3>🏆 Premium</h3>
<p>High quality standards.</p>
</div>

<div>
<h3>🚚 Fast Delivery</h3>
<p>Quick shipping nationwide.</p>
</div>

<div>
<h3>🔒 Secure Payments</h3>
<p>Safe checkout experience.</p>
</div>

</div>

</section>

{/* ================= FEATURED PRODUCT ================= */}

<section className="featured-product">

<div>

<span>FEATURED PRODUCT</span>

<h2>
Bilona A2 Cow Ghee
</h2>

<p>
Made using traditional methods.
Rich aroma, authentic taste and premium quality.
</p>

<button className="btn">
Shop Now
</button>

</div>

<div className="featured-product-box">

<div className="ghee-jar">
A2 GHEE
</div>

</div>

</section>

{/* ================= TESTIMONIALS ================= */}

<section className="testimonials">

<div className="section-title">

<span>CUSTOMER REVIEWS</span>

<h2>Trusted By Thousands</h2>

</div>

<div className="testimonial-grid">

<div>
<h3>★★★★★</h3>
<p>
Amazing quality and premium packaging.
</p>
<b>Riya Sharma</b>
</div>

<div>
<h3>★★★★★</h3>
<p>
Best organic products I have used.
</p>
<b>Aman Verma</b>
</div>

<div>
<h3>★★★★★</h3>
<p>
Excellent customer experience.
</p>
<b>Sneha Raj</b>
</div>

</div>

</section>

{/* ================= BLOGS ================= */}

<section className="blogs-preview">

<div className="section-title">

<span>WELLNESS JOURNAL</span>

<h2>Latest Articles</h2>

</div>

<div className="blog-grid">

<article>

<h3>
Benefits Of A2 Ghee
</h3>

<p>
Discover why traditional Bilona Ghee
is becoming popular again.
</p>

</article>

<article>

<h3>
Pure Honey Guide
</h3>

<p>
Learn how to identify genuine honey.
</p>

</article>

<article>

<h3>
Healthy Indian Breakfast
</h3>

<p>
Simple nutrition tips for families.
</p>

</article>

</div>

</section>

{/* ================= NEWSLETTER ================= */}

<section className="newsletter-premium">

<h2>
Join 25,000+ Wellness Enthusiasts
</h2>

<p>
Get recipes, health tips and exclusive offers.
</p>

<div>

<input
type="email"
placeholder="Enter Email"
/>

<button>
Subscribe
</button>

</div>

</section>

      <section className="gavy-promos">
        <div>
          <h3>Healthy Combos</h3>
          <p>Specially Curated for You</p>
          <Link to="/shop?category=Combos">Save More →</Link>
        </div>

        <div>
          <h3>Reward Points</h3>
          <p>Earn Coins on Every Purchase</p>
          <Link to="/shop">Shop & Earn →</Link>
        </div>

        <div>
          <h3>Subscribe & Save</h3>
          <p>Get Exclusive Offers & Updates</p>
          <div className="subscribe-box">
            <input placeholder="Enter your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>

      <section className="gavy-services">
        <div>🚚 <b>Free Shipping</b><span>On orders above ₹999</span></div>
        <div>🔒 <b>Secure Payment</b><span>100% Safe & Secure</span></div>
        <div>🔄 <b>Easy Returns</b><span>7 Days Easy Returns</span></div>
        <div>💵 <b>COD Available</b><span>Cash on Delivery</span></div>
        <div>🎁 <b>Rewards & Offers</b><span>Earn Coins & Save More</span></div>
      </section>
    </main>
  );
}