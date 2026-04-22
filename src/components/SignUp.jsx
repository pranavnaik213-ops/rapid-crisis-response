import React, { useState } from 'react';
import { AlertCircle, Lock, Mail, User, ArrowRight, Building } from 'lucide-react';
import './SignUp.css';

const SignUp = ({ onSignup, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && password && role) {
      onSignup(email, password, role);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="signup-brand">
          <AlertCircle className="signup-logo-icon" size={32} />
          <h2>Rapid Crisis Response</h2>
        </div>
        <div className="signup-welcome">
          <h1>Join the Network.</h1>
          <p>Register as a verified responder, medical professional, or citizen volunteer to help save lives faster.</p>
        </div>
        <div className="signup-stats">
          <div className="stat-item">
            <strong>4,500+</strong>
            <span>Active Volunteers</span>
          </div>
          <div className="stat-item">
            <strong>2.4m</strong>
            <span>Avg. Response</span>
          </div>
        </div>
      </div>
      
      <div className="signup-right">
        <div className="signup-card animate-fade-in">
          <div className="signup-header">
            <h3>Create an Account</h3>
            <p>Fill in your details to get started</p>
          </div>
          
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name / Organization</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="John Doe or City Hospital" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Role / Department</label>
              <div className="input-with-icon">
                <Building size={18} className="input-icon" />
                <select 
                  className="form-control" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="citizen">Citizen Volunteer</option>
                  <option value="medical">Medical Professional / Hospital</option>
                  <option value="police">Police / Public Safety</option>
                  <option value="fire">Fire Department</option>
                  <option value="animal">Animal Rescue NGO</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="name@example.com" 
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
                  placeholder="Create a strong password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  minLength="8"
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block signup-btn">
              Create Account <ArrowRight size={18} />
            </button>
          </form>
          
          <div className="signup-footer">
            <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Sign In</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
