import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section section">
      <div className="container hero-container">
        <div className="hero-content animate-fade-in">
          <div className="badge">
            <span className="live-dot"></span>
            Live Emergency Network
          </div>
          <h1 className="hero-title animate-slide-up">
            Report Emergencies Instantly.<br />
            <span className="text-accent">Save Lives Faster.</span>
          </h1>
          <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.1s' }}>
            A rapid crisis response system connecting communities, NGOs, and first responders in real-time. Fast, reliable, and built to save lives.
          </p>
          <div className="hero-actions animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <button className="btn btn-primary">
              <AlertCircle size={20} />
              Report Now
            </button>
            <button className="btn btn-secondary">
              View Nearby Cases
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
