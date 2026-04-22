import React, { useState, useEffect } from 'react';
import { ShieldAlert, Menu, X, User } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ authState, userEmail, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled glass-panel' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => onNavigate('public')} style={{ cursor: 'pointer' }}>
          <ShieldAlert className="logo-icon" size={28} />
          <span className="logo-text">Rapid Response</span>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu desktop-only">
          <button className="nav-link" onClick={() => onNavigate('public')}>Home</button>
          
          {authState === 'authenticated' ? (
            <div className="nav-user">
              <span className="user-greeting">
                <User size={16} /> {userEmail.split('@')[0]}
              </span>
              <button className="btn btn-primary" onClick={() => onNavigate('login')}>Sign Out</button>
            </div>
          ) : (
            <div className="nav-auth">
              <button className="nav-link" onClick={() => onNavigate('login')}>Sign In</button>
              <button className="btn btn-primary" onClick={() => onNavigate('signup')}>Create Account</button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown animate-slide-up glass-panel">
          <button className="nav-link" onClick={() => { onNavigate('public'); setMobileMenuOpen(false); }}>Home</button>
          {authState === 'authenticated' ? (
            <>
              <span className="user-greeting"><User size={16} /> {userEmail.split('@')[0]}</span>
              <button className="btn btn-primary" onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="nav-link" onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}>Sign In</button>
              <button className="btn btn-primary" onClick={() => { onNavigate('signup'); setMobileMenuOpen(false); }}>Create Account</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
