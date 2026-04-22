import React, { useState } from 'react';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import './Login.css'; // Reuse Login styles

const AdminLogin = ({ onLoginSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      
      if (data.success) {
        onLoginSuccess();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Cannot connect to server');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left" style={{ background: 'linear-gradient(135deg, #0A2540 0%, #1E293B 100%)' }}>
        <div className="login-brand">
          <ShieldAlert className="login-logo-icon" size={32} />
          <h2>Rapid Crisis Response</h2>
        </div>
        <div className="login-welcome">
          <h1>Admin Portal.</h1>
          <p>Restricted access. Monitor live system metrics, user activity, and global dispatches.</p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-card animate-fade-in" style={{ borderTop: '4px solid #E63946' }}>
          <div className="login-header">
            <h3>Admin Authentication</h3>
            <p>Enter master password to access system</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message" style={{ color: '#E63946', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            
            <div className="form-group">
              <label>Admin Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block login-btn" style={{ backgroundColor: '#0A2540' }}>
              Authenticate <ArrowRight size={18} />
            </button>
          </form>
          
          <div className="login-footer">
            <p><a href="#" onClick={(e) => { e.preventDefault(); onCancel(); }}>← Back to Public Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
