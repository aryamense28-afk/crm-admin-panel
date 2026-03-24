import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleWatchDemo = () => {
    // You can add a demo video modal or redirect to demo page
    alert('Demo video coming soon!');
  };

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">🚀</span>
          <span className="brand-name">NEXUS CRM</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
          <button className="login-btn" onClick={handleSignIn}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Transform Your Customer
            <span className="gradient-text"> Relationship Management</span>
          </h1>
          <p className="hero-description">
            Streamline your sales, marketing, and customer service with our 
            all-in-one CRM platform. Boost productivity and grow your business.
          </p>
          <div className="hero-buttons">
            <button className="cta-button" onClick={handleGetStarted}>
              Get Started Free
              <span className="arrow">→</span>
            </button>
            <button className="demo-button" onClick={handleWatchDemo}>
              Watch Demo
            </button>
          </div>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">
            <div className="dashboard-preview">
              <div className="preview-bar"></div>
              <div className="preview-card"></div>
              <div className="preview-card"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">Powerful Features for Your Business</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Real-time insights and reports to make data-driven decisions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Contact Management</h3>
            <p>Organize and manage all your customer relationships in one place</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📧</div>
            <h3>Email Integration</h3>
            <p>Connect your email and track all communications seamlessly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Access</h3>
            <p>Access your CRM on the go with our mobile app</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <h2 className="section-title">Choose the Perfect Plan</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Starter</h3>
            <div className="price">
              <span className="currency">$</span>
              <span className="amount">29</span>
              <span className="period">/month</span>
            </div>
            <ul className="features-list">
              <li>✓ Up to 1,000 contacts</li>
              <li>✓ Basic analytics</li>
              <li>✓ Email support</li>
              <li>✓ 5 users included</li>
            </ul>
            <button className="pricing-btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
          <div className="pricing-card popular">
            <div className="popular-badge">Most Popular</div>
            <h3>Professional</h3>
            <div className="price">
              <span className="currency">$</span>
              <span className="amount">79</span>
              <span className="period">/month</span>
            </div>
            <ul className="features-list">
              <li>✓ Up to 10,000 contacts</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Priority support</li>
              <li>✓ 20 users included</li>
              <li>✓ API access</li>
            </ul>
            <button className="pricing-btn popular-btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">
              <span className="currency">$</span>
              <span className="amount">199</span>
              <span className="period">/month</span>
            </div>
            <ul className="features-list">
              <li>✓ Unlimited contacts</li>
              <li>✓ Custom analytics</li>
              <li>✓ 24/7 phone support</li>
              <li>✓ Unlimited users</li>
              <li>✓ Dedicated account manager</li>
            </ul>
            <button className="pricing-btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="about" className="testimonials-section">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"CRM Pro has transformed how we manage our customer relationships. The analytics dashboard is incredible!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">JD</div>
              <div className="author-info">
                <h4>John Doe</h4>
                <p>CEO, TechStart Inc</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"The best CRM we've ever used. The interface is intuitive and the support team is outstanding."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">JS</div>
              <div className="author-info">
                <h4>Jane Smith</h4>
                <p>Sales Director, Growth Co</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Increased our sales by 40% in just 3 months. The automation features are game-changing!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">MR</div>
              <div className="author-info">
                <h4>Mike Ross</h4>
                <p>Operations Manager, Innovate LLC</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to grow your business?</h2>
          <p>Join thousands of businesses using CRM Pro to manage their customers</p>
          <button className="cta-button large" onClick={handleGetStarted}>
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>CRM Pro</h3>
            <p>Transform your customer relationships with the most powerful CRM platform.</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            
            <a href="#">Privacy Policy</a>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">Facebook</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 CRM Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;