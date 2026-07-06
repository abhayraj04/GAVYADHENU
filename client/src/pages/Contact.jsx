import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Heart, Share2, MessageCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send data to backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <h1>Get in Touch</h1>
        <p>Have questions about our products? We'd love to hear from you. Reach out anytime!</p>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info">
        <div className="info-card">
          <Phone size={32} />
          <h3>Call Us</h3>
          <p className="highlight">+91 98765 43210</p>
          <p>Mon-Fri: 9:00 AM - 6:00 PM IST</p>
        </div>
        <div className="info-card">
          <Mail size={32} />
          <h3>Email Us</h3>
          <p className="highlight">support@gavyadhenu.com</p>
          <p>We respond within 24 hours</p>
        </div>
        <div className="info-card">
          <MapPin size={32} />
          <h3>Visit Us</h3>
          <p className="highlight">Pune, Maharashtra</p>
          <p>India's Heart of Wellness</p>
        </div>
        <div className="info-card">
          <Clock size={32} />
          <h3>Business Hours</h3>
          <p className="highlight">Mon-Sat: 9 AM - 9 PM</p>
          <p>Sunday: 10 AM - 8 PM</p>
        </div>
      </section>

      <div className="contact-container">
        {/* Contact Form */}
        <section className="contact-form-section">
          <h2>Send us a Message</h2>
          {submitted && (
            <div className="success-message">
              ✓ Thank you! We'll get back to you soon.
            </div>
          )}
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                rows="6"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn full">Send Message</button>
          </form>
        </section>

        {/* Map & Social Section */}
        <section className="contact-side">
          {/* Simple Map Placeholder */}
          <div className="contact-map">
            <iframe
              title="Gavyadhenu Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.2603643656974!2d73.8567!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c051e5e5e5e5%3A0x5e5e5e5e5e5e5e5e!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1623456789"
              style={{ border: 0, width: '100%', height: '300px', borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          {/* Social Links */}
          <div className="social-section">
            <h3>Follow Us</h3>
            <p>Stay updated with wellness tips and exclusive offers</p>
            <div className="social-links">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social-btn">
                <Share2 size={20} /> Instagram
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social-btn">
                <Heart size={20} /> Facebook
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="social-btn">
                <MessageCircle size={20} /> WhatsApp
              </a>
            </div>
          </div>

          {/* FAQ Quick Links */}
          <div className="faq-section">
            <h3>Common Questions?</h3>
            <ul className="faq-links">
              <li><a href="/shop">Browse Our Products</a></li>
              <li><a href="#faq">View FAQ</a></li>
              <li><a href="#shipping">Shipping Information</a></li>
              <li><a href="#returns">Return Policy</a></li>
            </ul>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="contact-cta">
        <h2>Can't find what you're looking for?</h2>
        <p>Visit our FAQ page or browse our complete product collection.</p>
        <div className="cta-buttons">
          <a href="/shop" className="btn">Shop Now</a>
          <a href="#faq" className="btn outline">View FAQ</a>
        </div>
      </section>
    </main>
  );
}
