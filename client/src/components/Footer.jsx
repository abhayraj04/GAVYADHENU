import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <h2>Gavyadhenu</h2>
        <p>Purity, Tradition & Natural Wellness.</p>
      </div>
      <div>
        <h3>Quick Links</h3>
        <p>About | Contact | Privacy Policy | Refund Policy</p>
      </div>
      <div>
        <h3>Newsletter</h3>
        <div className="newsletter">
          <input placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </div>
    </footer>
  );
}
