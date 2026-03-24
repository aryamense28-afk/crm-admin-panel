// components/pages/RegistrationModal.jsx
import React, { useState } from 'react';
import './RegistrationModal.css';

const RegistrationModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    role: 'sales_rep',
    plan: 'starter',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { value: 'sales_rep', label: 'Sales Representative' },
    { value: 'sales_manager', label: 'Sales Manager' },
    { value: 'marketing', label: 'Marketing Professional' },
    { value: 'executive', label: 'Executive / Leadership' },
    { value: 'other', label: 'Other' }
  ];

  const plans = [
    { value: 'starter', label: 'Starter', price: '$29/month' },
    { value: 'professional', label: 'Professional', price: '$79/month' },
    { value: 'enterprise', label: 'Enterprise', price: 'Custom' }
  ];

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      const userData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        company: formData.company,
        role: formData.role,
        plan: formData.plan,
        createdAt: new Date().toISOString()
      };
      
      // Store in localStorage for demo
      const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
      users.push(userData);
      localStorage.setItem('registered_users', JSON.stringify(users));
      
      // Send welcome email (simulated)
      console.log('Welcome email sent to:', formData.email);
      
      onSuccess(userData);
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement social login integration
  };

  if (!isOpen) return null;

  return (
    <div className="registration-modal-overlay" onClick={onClose}>
      <div className="registration-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <div className="header-icon">🚀</div>
          <h2>Start Your Free Trial</h2>
          <p>Join 15,000+ businesses using NexusCRM</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Account</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Company</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="form-step">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-wrapper">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    autoFocus
                  />
                </div>
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <div className="input-wrapper">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Password *</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                  />
                  <button 
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
                <div className="password-requirements">
                  <small>Password must have at least 8 characters, 1 uppercase letter, and 1 number</small>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-step">
              <div className="form-group">
                <label>Company Name *</label>
                <div className="input-wrapper">
                  <i className="fas fa-building"></i>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                  />
                </div>
                {errors.company && <span className="error-message">{errors.company}</span>}
              </div>

              <div className="form-group">
                <label>Your Role *</label>
                <div className="input-wrapper">
                  <i className="fas fa-briefcase"></i>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.role && <span className="error-message">{errors.role}</span>}
              </div>

              <div className="form-group">
                <label>Select Plan *</label>
                <div className="plan-selector">
                  {plans.map(plan => (
                    <div 
                      key={plan.value}
                      className={`plan-option ${formData.plan === plan.value ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, plan: plan.value }))}
                    >
                      <div className="plan-name">{plan.label}</div>
                      <div className="plan-price">{plan.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a> *</span>
                </label>
                {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
              </div>
            </div>
          )}

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <div className="modal-actions">
            {currentStep === 2 && (
              <button type="button" className="btn-back" onClick={handleBack}>
                <i className="fas fa-arrow-left"></i> Back
              </button>
            )}
            
            {currentStep === 1 ? (
              <button type="button" className="btn-next" onClick={handleNext}>
                Next <i className="fas fa-arrow-right"></i>
              </button>
            ) : (
              <button type="submit" className="btn-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Creating Account...
                  </>
                ) : (
                  <>
                    Start Free Trial <i className="fas fa-rocket"></i>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        <div className="modal-footer">
          <div className="divider">
            <span>Or continue with</span>
          </div>
          <div className="social-login">
            <button className="social-btn google" onClick={() => handleSocialLogin('google')}>
              <i className="fab fa-google"></i> Google
            </button>
            <button className="social-btn github" onClick={() => handleSocialLogin('github')}>
              <i className="fab fa-github"></i> GitHub
            </button>
            <button className="social-btn linkedin" onClick={() => handleSocialLogin('linkedin')}>
              <i className="fab fa-linkedin"></i> LinkedIn
            </button>
          </div>
          <p className="login-link">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;