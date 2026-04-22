import React from 'react';
import { ShieldAlert, ChevronRight } from 'lucide-react';
import './AlertsSystem.css';

const AlertsSystem = ({ incidents = [] }) => {
  const criticalAlerts = incidents.filter(i => i.severity === 'critical' || i.severity === 'high').slice(0, 5);
  return (
    <div className="alerts-system">
      <div className="container alerts-container">
        <div className="alert-badge">
          <ShieldAlert size={14} /> LIVE ALERT
        </div>
        <div className="alert-content">
          <div className="alert-scroller">
            {criticalAlerts.length > 0 ? (
              criticalAlerts.map(alert => (
                <span key={alert.id}><strong>{alert.severity.toUpperCase()}:</strong> {alert.title} in {alert.location}. Response coordinated.</span>
              ))
            ) : (
              <span><strong>INFO:</strong> All systems normal. No critical alerts in your area.</span>
            )}
          </div>
        </div>
        <a href="#map" className="alert-link">
          View Map <ChevronRight size={14} />
        </a>
      </div>
    </div>
  );
};

export default AlertsSystem;
