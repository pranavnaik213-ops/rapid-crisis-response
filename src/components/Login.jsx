import React, { useState } from 'react';
import { AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin, onSwitchToSignup, onSwitchToAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-brand">
          <AlertCircle className="login-logo-icon" size={32} />
          <h2>Rapid Crisis Response</h2>
        </div>
        <div className="login-welcome">
          <h1>Welcome back, Responder.</h1>
          <p>Sign in to access the live incident map, dispatch emergencies, and coordinate with nearby departments.</p>
        </div>
        <div className="login-stats">
          <div className="stat-item">
            <strong>12K+</strong>
            <span>Lives Saved</span>
          </div>
          <div className="stat-item">
            <strong>24/7</strong>
            <span>Active Network</span>
          </div>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-card animate-fade-in">
          <div className="login-header">
            <h3>Sign In to Dashboard</h3>
            <p>Enter your credentials to continue</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="name@department.gov" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
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
              <div className="forgot-password">
                <a href="#">Forgot password?</a>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block login-btn">
              Sign In <ArrowRight size={18} />
            </button>
          </form>
          
          <div className="login-footer">
            <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }}>Apply as Responder</a></p>
            <p style={{ marginTop: '0.5rem' }}><a href="#" onClick={(e) => { e.preventDefault(); onSwitchToAdmin(); }} style={{ color: '#64748B', fontWeight: 'normal' }}>System Administrator Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
