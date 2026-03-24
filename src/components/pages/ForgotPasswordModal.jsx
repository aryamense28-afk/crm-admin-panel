// components/pages/ForgotPasswordModal.jsx
import React, { useState } from 'react';
import './ForgotPasswordModal.css';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: request, 2: verify, 3: reset
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      // Mock success
      setMessage('Password reset code sent to your email!');
      setStep(2);
      setLoading(false);
    }, 1500);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      // Mock verification (any 6-digit code works for demo)
      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        setMessage('Code verified! Please set your new password.');
        setStep(3);
      } else {
        setError('Invalid verification code. Please try again.');
      }
      setLoading(false);
    }, 1000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setMessage('Password reset successful! You can now login with your new password.');
      setTimeout(() => {
        onClose();
      }, 2000);
      setLoading(false);
    }, 1500);
  };

  const handleResendCode = () => {
    setLoading(true);
    setTimeout(() => {
      setMessage('New verification code sent!');
      setLoading(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="forgot-password-modal-overlay" onClick={onClose}>
      <div className="forgot-password-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <div className="header-icon">🔐</div>
          <h2>Reset Password</h2>
          <p>
            {step === 1 && "Enter your email to receive a verification code"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Create a new password for your account"}
          </p>
        </div>

        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Request</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Verify</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Reset</div>
          </div>
        </div>

        {message && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <form onSubmit={
          step === 1 ? handleRequestReset :
          step === 2 ? handleVerifyCode :
          handleResetPassword
        }>
          {step === 1 && (
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                  autoFocus
                />
              </div>
              <p className="help-text">
                We'll send a verification code to this email address
              </p>
            </div>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label>Verification Code</label>
                <div className="input-wrapper">
                  <i className="fas fa-key"></i>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    required
                    autoFocus
                  />
                </div>
                <button 
                  type="button"
                  className="resend-code-btn"
                  onClick={handleResendCode}
                  disabled={loading}
                >
                  Didn't receive code? Resend
                </button>
              </div>
              <p className="help-text">
                Check your email for the verification code (demo: any 6-digit number)
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <div className="form-group">
                <label>New Password</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <button 
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                  </button>
                </div>
                <div className="password-requirements">
                  <small>Password must be at least 8 characters</small>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <i className="fas fa-check-circle"></i>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="modal-actions">
            {step > 1 && (
              <button 
                type="button" 
                className="btn-back"
                onClick={() => setStep(step - 1)}
              >
                <i className="fas fa-arrow-left"></i> Back
              </button>
            )}
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  {step === 1 && 'Send Reset Code'}
                  {step === 2 && 'Verify Code'}
                  {step === 3 && 'Reset Password'}
                  <i className="fas fa-arrow-right"></i>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="modal-footer">
          <p>
            Remember your password?{' '}
            <button className="login-link-btn" onClick={onClose}>
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;