// components/pages/Login.jsx (Updated - redirect to /login)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      // Demo credentials
      if (userType === 'admin' && email === 'admin@crm.com' && password === 'demo123') {
        const userData = { name: 'Admin User', email: 'admin@crm.com', role: 'admin' };
        localStorage.setItem('crmUser', JSON.stringify(userData));
        localStorage.setItem('userType', 'admin');
        navigate('/dashboard');
      } else if (userType === 'customer' && email === 'customer@crm.com' && password === 'demo123') {
        const userData = { name: 'John Customer', email: 'customer@crm.com', role: 'customer' };
        localStorage.setItem('crmUser', JSON.stringify(userData));
        localStorage.setItem('userType', 'customer');
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Try: admin@crm.com / demo123 or customer@crm.com / demo123');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <span className="brand-icon-large">⚡</span>
            <h1>NexusCRM</h1>
            <p>Intelligent Customer Relationship Management</p>
          </div>
          <div className="login-features">
            <div className="feature">
              <i className="fas fa-chart-line"></i>
              <span>Real-time Analytics</span>
            </div>
            <div className="feature">
              <i className="fas fa-robot"></i>
              <span>AI-Powered Insights</span>
            </div>
            <div className="feature">
              <i className="fas fa-shield-alt"></i>
              <span>Enterprise Security</span>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your account</p>
            </div>

            <div className="user-type-toggle">
              <button
                className={`type-btn ${userType === 'admin' ? 'active' : ''}`}
                onClick={() => setUserType('admin')}
              >
                <i className="fas fa-user-shield"></i> Admin
              </button>
              <button
                className={`type-btn ${userType === 'customer' ? 'active' : ''}`}
                onClick={() => setUserType('customer')}
              >
                <i className="fas fa-user"></i> Customer
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-icon">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder={userType === 'admin' ? 'admin@crm.com' : 'customer@crm.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Sign In'}
                {!loading && <i className="fas fa-arrow-right"></i>}
              </button>

              <div className="demo-credentials">
                <p>Demo Credentials:</p>
                <code>Admin: admin@crm.com / demo123</code>
                <code>Customer: customer@crm.com / demo123</code>
              </div>
            </form>

            <div className="back-to-home">
              <a href="/" className="back-link">
                <i className="fas fa-arrow-left"></i> Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;