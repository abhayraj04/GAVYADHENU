import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';

const blogs = [
  {
    id: 1,
    slug: 'a2-ghee-benefits',
    title: '5 Powerful Benefits of A2 Ghee',
    excerpt: 'Discover how authentic A2 Ghee from Gir cows can transform your health and wellness journey with traditional Ayurvedic benefits.',
    content: 'A2 Ghee, sourced from the milk of Gir cows, contains A2 beta-casein which is easier to digest compared to regular A1 ghee. Studies show A2 Ghee helps improve bone strength, supports digestion, and boosts immunity. Regular consumption can also improve skin health and support healthy cholesterol levels.',
    image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=600&h=400',
    category: 'Health Tips',
    author: 'Dr. Priya Sharma',
    date: 'Jun 10, 2026',
    readTime: '5 min read'
  },
  {
    id: 2,
    slug: 'cold-pressed-oils-guide',
    title: 'Why Cold Pressed Oils Are Superior',
    excerpt: 'Learn the difference between cold-pressed and refined oils, and why traditional methods preserve more nutrients for your health.',
    content: 'Cold-pressed oils are extracted at low temperatures without heat or chemicals, preserving all natural antioxidants and vitamins. Unlike refined oils that lose nutritional value through heating, cold-pressed oils retain their natural flavors and health benefits. Perfect for cooking, salads, and wellness.',
    image: 'https://images.unsplash.com/photo-1585518419759-3b7fdf3c09ff?w=600&h=400',
    category: 'Nutrition Guide',
    author: 'Amit Patel',
    date: 'Jun 5, 2026',
    readTime: '6 min read'
  },
  {
    id: 3,
    slug: 'healthy-breakfast-ideas',
    title: '10 Nutritious Breakfast Recipes',
    excerpt: 'Start your day right with these simple, energy-boosting breakfast ideas made with our natural, organic products.',
    content: 'A healthy breakfast sets the tone for your entire day. Try our golden milk with A2 Ghee, organic atta pancakes, honey-drizzled oats, or herbal tea combinations. Each recipe uses minimal ingredients but delivers maximum nutrition and is perfect for busy students and professionals.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400',
    category: 'Recipes',
    author: 'Dr. Priya Sharma',
    date: 'May 28, 2026',
    readTime: '7 min read'
  },
  {
    id: 4,
    slug: 'ayurveda-seasonal-wellness',
    title: 'Seasonal Wellness with Ayurveda',
    excerpt: 'Align your diet and lifestyle with the seasons using ancient Ayurvedic principles for year-round health.',
    content: 'Ayurveda teaches us to adapt our diet based on seasons. During summer, prefer cooling oils and herbs. In winter, warm ghee and warming spices. Spring calls for detoxification. Our seasonal product bundles are curated to support your body through each season naturally.',
    image: 'https://images.unsplash.com/photo-1564629238369-dd7b81c52d10?w=600&h=400',
    category: 'Wellness',
    author: 'Rajesh Kumar',
    date: 'May 15, 2026',
    readTime: '8 min read'
  },
  {
    id: 5,
    slug: 'organic-farming-benefits',
    title: 'Supporting Organic Farmers',
    excerpt: 'How choosing organic products directly supports sustainable farming communities and protects our environment.',
    content: 'When you buy Gavyadhenu products, you support 500+ organic farmers across India. Organic farming practices preserve soil health, reduce chemical pollution, and protect biodiversity. Every purchase helps farming communities earn fair prices and build sustainable livelihoods.',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400',
    category: 'Sustainability',
    author: 'Amit Patel',
    date: 'May 1, 2026',
    readTime: '6 min read'
  },
  {
    id: 6,
    slug: 'immunity-boosting-foods',
    title: 'Build Strong Immunity Naturally',
    excerpt: 'Discover the best natural foods and herbs that strengthen your immune system against seasonal illnesses.',
    content: 'Traditional herbs like Tulsi, Turmeric, Ginger, and Honey are proven immunity boosters. Combine with A2 Ghee for better absorption. Our Immunity Booster Combo contains all these ingredients in balanced proportions for maximum effectiveness. Especially important during seasonal transitions.',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1267ae5b?w=600&h=400',
    category: 'Health Tips',
    author: 'Dr. Priya Sharma',
    date: 'Apr 20, 2026',
    readTime: '5 min read'
  }
];

const categories = ['All', ...new Set(blogs.map(b => b.category))];

export default function Blogs() {
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredBlogs = activeCategory === 'All' 
    ? blogs 
    : blogs.filter(b => b.category === activeCategory);

  return (
    <main className="blogs-page">
      {/* Hero Section */}
      <section className="blogs-hero">
        <h1>Gavyadhenu Blog</h1>
        <p>Tips, recipes, and wellness advice from our community experts</p>
      </section>

      {/* Category Filter */}
      <section className="blogs-filters">
        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="blogs-grid">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map(blog => (
            <article key={blog.id} className="blog-card">
              <div className="blog-image">
                <img src={blog.image} alt={blog.title} />
                <span className="blog-category">{blog.category}</span>
              </div>
              <div className="blog-content">
                <h3>{blog.title}</h3>
                <p className="blog-excerpt">{blog.excerpt}</p>
                
                <div className="blog-meta">
                  <span className="meta-item">
                    <Calendar size={14} /> {blog.date}
                  </span>
                  <span className="meta-item">
                    <Clock size={14} /> {blog.readTime}
                  </span>
                  <span className="meta-item">
                    <User size={14} /> {blog.author}
                  </span>
                </div>
                
                <Link to={`/blogs/${blog.slug}`} className="read-more">
                  Read More →
                </Link>
              </div>
            </article>
          ))
        ) : (
          <p className="no-blogs">No blogs in this category yet.</p>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="blogs-newsletter">
        <h2>Subscribe to Wellness Tips</h2>
        <p>Get weekly recipes, health tips, and exclusive offers delivered to your inbox.</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button className="btn">Subscribe</button>
        </div>
      </section>
    </main>
  );
}
