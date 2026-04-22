import React, { useState } from 'react';
import { AlertTriangle, MapPin, CheckCircle, Loader } from 'lucide-react';
import './SOSButton.css';

const SOSButton = ({ addIncident }) => {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSOS = () => {
    setStatus('loading');
    
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMsg('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Submit the SOS incident
        addIncident({
          title: "SOS PANIC ALERT",
          type: "sos",
          severity: "critical",
          location: "Current GPS Location",
          lat: latitude,
          lng: longitude,
          description: "Emergency SOS triggered by user device."
        }).then(() => {
          setStatus('success');
          setTimeout(() => setStatus('idle'), 5000);
        }).catch(err => {
          setStatus('error');
          setErrorMsg('Failed to send SOS');
        });
      },
      (error) => {
        setStatus('error');
        setErrorMsg('Please allow location access to send SOS');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="sos-container">
      {status === 'idle' && (
        <button className="sos-btn pulse-animation" onClick={handleSOS}>
          <AlertTriangle size={48} className="sos-icon" />
          <span>HOLD FOR SOS</span>
        </button>
      )}

      {status === 'loading' && (
        <div className="sos-status loading">
          <Loader size={32} className="spin" />
          <p>Acquiring Location & Sending SOS...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="sos-status success">
          <CheckCircle size={32} />
          <p>SOS Dispatched Successfully.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="sos-status error">
          <AlertTriangle size={32} />
          <p>{errorMsg}</p>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setStatus('idle')}>Try Again</button>
        </div>
      )}
    </div>
  );
};

export default SOSButton;
