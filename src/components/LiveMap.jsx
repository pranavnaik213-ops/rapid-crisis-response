import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Activity, ShieldAlert, HeartPulse } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import 'leaflet/dist/leaflet.css';
import './LiveMap.css';

const incidentTypes = [
  { id: 'all', label: 'All Incidents', icon: <Activity size={16} /> },
  { id: 'rescue', label: 'Animal Rescue', icon: <HeartPulse size={16} /> },
  { id: 'safety', label: 'Public Safety', icon: <ShieldAlert size={16} /> },
  { id: 'medical', label: 'Medical Emergency', icon: <MapPin size={16} /> },
];

const createCustomIcon = (IconComponent, severity) => {
  const htmlString = renderToString(
    <div className={`map-pin pin-${severity}`} style={{ position: 'relative', top: 0, left: 0, transform: 'none' }}>
      <div className="pin-pulse"></div>
      <IconComponent size={18} aria-hidden="true" />
    </div>
  );
  
  return L.divIcon({
    html: htmlString,
    className: 'custom-leaflet-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

function LocationMarker() {
  const map = useMap();
  
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, 10);
      const userIcon = L.divIcon({
        html: `<div style="background:#0066FF;width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.5);"></div>`,
        className: 'user-location-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      L.marker(e.latlng, { icon: userIcon }).addTo(map).bindPopup("You are here");
    });
  }, [map]);

  return null;
}

const LiveMap = ({ incidents }) => {
  const [filter, setFilter] = useState('all');

  return (
    <section id="map" className="section live-map-section" aria-label="Live Incident Map">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Live Incident Map</h2>
            <p className="section-subtitle" style={{ textAlign: 'left', margin: 0 }}>Real-time view of reported emergencies in your area.</p>
          </div>
          <div className="map-filters">
            {incidentTypes.map(type => (
              <button 
                key={type.id}
                className={`filter-btn ${filter === type.id ? 'active' : ''}`}
                onClick={() => setFilter(type.id)}
                aria-pressed={filter === type.id}
                aria-label={`Filter by ${type.label}`}
              >
                {React.cloneElement(type.icon, { 'aria-hidden': 'true' })}
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="map-container animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="map-wrapper" style={{ flex: 1, position: 'relative', zIndex: 0, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker />
              {incidents.filter(inc => filter === 'all' || inc.type === filter).map(inc => {
                let Icon = Activity;
                if (inc.type === 'rescue') Icon = HeartPulse;
                if (inc.type === 'safety') Icon = ShieldAlert;
                if (inc.type === 'medical') Icon = MapPin;
                
                return (
                  <Marker 
                    key={inc.id} 
                    position={[inc.lat, inc.lng]}
                    icon={createCustomIcon(Icon, inc.severity)}
                  >
                    <Popup>
                      <div style={{ padding: '4px', maxWidth: '200px' }}>
                        {inc.imageUrl && (
                          <img 
                            src={inc.imageUrl} 
                            alt="Incident Evidence" 
                            style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} 
                          />
                        )}
                        <strong style={{ fontSize: '14px', color: '#0A2540' }}>{inc.title}</strong><br/>
                        <span style={{ color: '#64748B', fontSize: '12px' }}>{inc.location} • {inc.time}</span><br/>
                        <span style={{ textTransform: 'capitalize', fontWeight: 'bold', color: inc.severity === 'critical' ? '#E63946' : inc.severity === 'high' ? '#F4A261' : '#0066FF' }}>
                          {inc.severity} Severity
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          <div className="incident-sidebar">
            <h3 className="sidebar-title">
              <Activity size={20} /> Active Reports
            </h3>
            <div className="incident-list">
              {incidents.filter(inc => filter === 'all' || inc.type === filter).length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                  No active incidents reported.
                </div>
              ) : (
                incidents.filter(inc => filter === 'all' || inc.type === filter).map(inc => (
                  <div key={inc.id} className="incident-card">
                    <div className={`incident-indicator indicator-${inc.severity}`}></div>
                    <div className="incident-details">
                      <h4 className="incident-title">{inc.title}</h4>
                      <p className="incident-meta">
                        <span>{inc.location}</span> • <span>{inc.time}</span>
                      </p>
                    </div>
                    <button className="btn-view-details">View</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveMap;
