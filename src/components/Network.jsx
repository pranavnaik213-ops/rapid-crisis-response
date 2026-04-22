import React from 'react';
import { Users, HeartHandshake, ShieldCheck, UserPlus } from 'lucide-react';
import './Network.css';

const partners = [
  { name: 'Global Rescue Init', icon: <ShieldCheck size={32} /> },
  { name: 'City Animal Services', icon: <HeartHandshake size={32} /> },
  { name: 'Red Cross Chapters', icon: <Users size={32} /> },
  { name: 'Local Fire Dept', icon: <ShieldCheck size={32} /> },
];

const Network = () => {
  return (
    <section className="section network-section bg-white">
      <div className="container">
        <div className="network-header text-center">
          <h2 className="section-title">Our Trusted Network</h2>
          <p className="section-subtitle">
            We partner with leading NGOs, certified veterinary clinics, and first responders to ensure every incident gets the right professional help.
          </p>
        </div>

        <div className="partners-grid">
          {partners.map((partner, index) => (
            <div key={index} className="partner-card">
              <div className="partner-icon">{partner.icon}</div>
              <h4 className="partner-name">{partner.name}</h4>
              <p className="partner-type">Verified Partner</p>
            </div>
          ))}
        </div>

        <div className="volunteer-cta">
          <div className="volunteer-content">
            <h3>Become a Volunteer Responder</h3>
            <p>Join our network of thousands of everyday heroes. Get trained, receive alerts, and help save lives in your neighborhood.</p>
          </div>
          <button className="btn btn-secondary volunteer-btn">
            <UserPlus size={20} />
            Join the Network
          </button>
        </div>
      </div>
    </section>
  );
};

export default Network;
