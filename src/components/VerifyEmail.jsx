import React, { useState } from 'react';
import { MailCheck, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import './VerifyEmail.css';

const VerifyEmail = ({ email, previewUrl, onVerify }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      try {
        const res = await fetch('http://localhost:3001/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: fullCode })
        });
        const data = await res.json();
        
        if (data.success) {
          onVerify();
        } else {
          setError(data.error || 'Invalid or expired code');
        }
      } catch (err) {
        setError('Could not connect to backend server');
      }
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card animate-fade-in">
        <div className="verify-icon-wrapper">
          <MailCheck size={48} className="verify-icon" />
        </div>
        
        <div className="verify-header">
          <h2>Verify Your Email</h2>
          <p>We've sent a 6-digit verification code to <strong>{email || 'your email'}</strong>. Please enter it below to confirm your profile.</p>
        </div>
        
        {previewUrl && (
          <div style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '1rem', marginBottom: '2rem', textAlign: 'left' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 'bold', color: '#0A2540' }}>🛠️ Developer Test Mode</p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B' }}>
              We generated a fake email for you. Click here to view it and get your OTP: <br/>
              <a href={previewUrl} target="_blank" rel="noreferrer" style={{ color: '#0066FF', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: 'bold' }}>
                View Fake Email Inbox <ExternalLink size={14} />
              </a>
            </p>
          </div>
        )}
        
        <form className="verify-form" onSubmit={handleSubmit}>
          {error && <div className="error-message" style={{ color: '#E63946', marginBottom: '1rem' }}>{error}</div>}
          <div className="otp-container">
            {code.map((data, index) => {
              return (
                <input
                  className="otp-input"
                  type="text"
                  name="otp"
                  maxLength="1"
                  key={index}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onFocus={e => e.target.select()}
                  required
                />
              );
            })}
          </div>
          
          <button type="submit" className="btn btn-primary btn-block verify-btn" disabled={code.join('').length < 6}>
            <ShieldCheck size={18} /> Verify & Access Dashboard
          </button>
        </form>
        
        <div className="verify-footer">
          <p>Didn't receive the code? <a href="#">Resend Code</a></p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
