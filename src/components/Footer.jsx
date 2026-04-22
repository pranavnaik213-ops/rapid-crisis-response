import React from 'react';
import { Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-primary">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-title">
              <AlertCircle className="footer-logo-icon text-accent" />
              Rapid Crisis Response
            </h3>
            <p className="footer-desc">
              Building smart cities and safer communities through instant communication and rapid response coordination.
            </p>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Report Incident</a></li>
              <li><a href="#">Live Map</a></li>
              <li><a href="#">Volunteer Sign Up</a></li>
              <li><a href="#">Partner with Us</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>About Project</h4>
            <ul>
              <li><a href="#">Our Vision</a></li>
              <li><a href="#">How AI Helps</a></li>
              <li><a href="#">Success Stories</a></li>
              <li><a href="#">Press & Media</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>24/7 Support</h4>
            <ul>
              <li><Phone size={16} /> <span>Emergency: 911</span></li>
              <li><Phone size={16} /> <span>Helpline: 1-800-CRISIS</span></li>
              <li><Mail size={16} /> <span>support@rapidresponse.org</span></li>
              <li><MapPin size={16} /> <span>HQ: 100 Safety Blvd, Metro</span></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Rapid Crisis Response System. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
