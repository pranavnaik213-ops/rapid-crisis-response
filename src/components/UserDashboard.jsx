import React, { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, ShieldAlert, Phone } from 'lucide-react';
import './UserDashboard.css';

const UserDashboard = ({ incidents, userEmail }) => {
  const [contact, setContact] = useState(localStorage.getItem(`em_contact_${userEmail}`) || '');
  const [saved, setSaved] = useState(false);

  const handleSaveContact = () => {
    localStorage.setItem(`em_contact_${userEmail}`, contact);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const userIncidents = incidents.filter(inc => inc.reportedBy === userEmail);

  return (
    <div className="user-dashboard-container animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="dashboard-header">
        <ShieldAlert size={28} color="#0066FF" />
        <h3>My Incident History</h3>
        <p>Timeline of all emergencies you have reported.</p>
      </div>

      <div className="emergency-contact-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Phone size={18} color="#475569" />
          <h4 style={{ margin: 0, color: '#0F172A' }}>Emergency Contact</h4>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1rem' }}>
          We will automatically notify this number via SMS if you trigger the SOS button.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="tel" 
            placeholder="+1 (555) 000-0000" 
            className="form-control" 
            style={{ flex: 1 }}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={handleSaveContact}>
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {userIncidents.length === 0 ? (
        <div className="empty-state">
          <p>You have not reported any incidents yet.</p>
        </div>
      ) : (
        <div className="timeline">
          {userIncidents.map((inc, index) => (
            <div key={inc.id || index} className="timeline-item">
              <div className="timeline-marker">
                <CheckCircle size={20} color="#10B981" />
              </div>
              <div className="timeline-content">
                <div className="timeline-date">
                  <Clock size={14} /> 
                  <span>{new Date(inc.time).toLocaleString()}</span>
                </div>
                <h4 className="timeline-title">{inc.title}</h4>
                <p className="timeline-location">{inc.location}</p>
                <div className="timeline-tags">
                  <span className="tag type-tag">{inc.type}</span>
                  <span className={`tag severity-tag ${inc.severity}`}>{inc.severity} Severity</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
