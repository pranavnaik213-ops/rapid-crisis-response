import React from 'react';
import './ImpactStats.css';

const stats = [
  { value: '12,450+', label: 'Cases Resolved' },
  { value: '8,320', label: 'Lives Saved' },
  { value: '4,500+', label: 'Active Volunteers' },
  { value: '2.4 mins', label: 'Avg. Response Time' }
];

const ImpactStats = () => {
  return (
    <section className="impact-section section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card hover-lift animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-icon-wrapper">{stat.icon}</div>
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
