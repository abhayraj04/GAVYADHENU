import React from 'react';
import { Award, Heart, Leaf, Users } from 'lucide-react';

export default function About() {
  return (
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Our Heritage of Wellness</h1>
          <p>Bringing 5000+ years of Ayurvedic wisdom and traditional farming practices to modern families across India.</p>
        </div>
        <div className="about-hero-stats">
          <div className="stat">
            <h3>Trusted</h3>
            <p>by families everywhere</p>
          </div>
          <div className="stat">
            <h3>100%</h3>
            <p>Natural Products</p>
          </div>
        <div className="stat">
            <h3>1000+</h3>
            <p>Daily Orders</p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-story">
        <div className="story-left">
          <h2>Our Story</h2>
          <p>Gavyadhenu was born from a simple belief: that traditional, natural products are not a luxury—they are a necessity for true wellness.</p>
          <p>Inspired by India's ancient agricultural heritage and Ayurvedic principles, our founders started this journey to bridge the gap between traditional farming practices and modern wellness needs.</p>
          <p>Today, Gavyadhenu works directly with farming communities across India to source pure, chemical-free products including A2 Ghee, Cold Pressed Oils, Organic Grains, and Herbal Products.</p>
        </div>
        <div className="story-right">
          <img src="/Logo.png" alt="Gavyadhenu Heritage" />
          <div className="story-badge">Est. 2022</div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="about-values">
        <h2>Why Gavyadhenu?</h2>
        <div className="values-grid">
          <div className="value-card">
            <Leaf size={40} />
            <h3>100% Natural</h3>
            <p>No synthetic chemicals, no additives, no preservatives. Pure nature in every product.</p>
          </div>
          <div className="value-card">
            <Heart size={40} />
            <h3>Traditional Methods</h3>
            <p>Using time-tested Ayurvedic and traditional farming practices that have nourished families for generations.</p>
          </div>
          <div className="value-card">
            <Award size={40} />
            <h3>Quality Assured</h3>
            <p>Every batch is lab-tested and verified to meet strict purity and nutritional standards.</p>
          </div>
          <div className="value-card">
            <Users size={40} />
            <h3>Community Focused</h3>
            <p>We partner directly with farmers, ensuring fair prices and sustainable livelihoods for agricultural communities.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <h2>Meet Our Founders</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">😊</div>
            <h3>Rajesh Kumar</h3>
            <p className="member-role">Founder & CEO</p>
            <p className="member-bio">Former dairy farmer turned entrepreneur. Passionate about reviving traditional A2 Gir cow breeds and their health benefits.</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👩‍⚕️</div>
            <h3>Dr. Priya Sharma</h3>
            <p className="member-role">Chief Wellness Officer</p>
            <p className="member-bio">Ayurvedic practitioner and nutritionist. Advocates for farm-to-table wellness and natural disease prevention.</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">🌾</div>
            <h3>Amit Patel</h3>
            <p className="member-role">Sourcing Director</p>
            <p className="member-bio">Works with 500+ organic farmers across Maharashtra, Rajasthan, and Punjab to ensure supply of premium products.</p>
          </div>
        </div>
      </section>

      {/* Certifications & Trust Section */}
      <section className="about-trust">
        <h2>Certified & Trusted</h2>
        <div className="trust-badges">
          <div className="badge-item">
            <div className="badge-icon">🏅</div>
            <p>FSSAI Certified</p>
          </div>
          <div className="badge-item">
            <div className="badge-icon">🌿</div>
            <p>Organic Certified</p>
          </div>
          <div className="badge-item">
            <div className="badge-icon">🧪</div>
            <p>Lab Tested</p>
          </div>
          <div className="badge-item">
            <div className="badge-icon">⭐</div>
            <p>GMP Certified</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <h2>Join Our Wellness Community</h2>
        <p>Experience the purity and tradition that has nourished families for generations.</p>
        <a href="/shop" className="btn">Explore Our Products</a>
      </section>
    </main>
  );
}
