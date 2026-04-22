import React from 'react';
import { Clock, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import './UserDashboard.css';

const UserDashboard = ({ incidents, userEmail }) => {
  const userIncidents = incidents.filter(inc => inc.reportedBy === userEmail);

  return (
    <div className="user-dashboard-container animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="dashboard-header">
        <ShieldAlert size={28} color="#0066FF" />
        <h3>My Incident History</h3>
        <p>Timeline of all emergencies you have reported.</p>
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
