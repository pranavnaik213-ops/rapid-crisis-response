import React, { useState, useEffect } from 'react';
import { Camera, MapPin, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import './ReportForm.css';

const ReportForm = ({ addIncident }) => {
  const [submitted, setSubmitted] = useState(false);
  const [locationValue, setLocationValue] = useState('');
  const [detectedCoords, setDetectedCoords] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setDetectedCoords({ lat, lng });
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            setLocationValue(data.display_name.split(',').slice(0, 3).join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          } catch (e) {
            setLocationValue(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationValue("Unable to detect. Enter manually.");
        }
      );
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (addIncident) {
      addIncident({
        type: formData.get('type') || 'safety',
        location: formData.get('location') || 'Unknown Location',
        severity: formData.get('severity') || 'medium',
        title: formData.get('description') || 'New Emergency Reported',
        lat: detectedCoords?.lat,
        lng: detectedCoords?.lng,
        imageUrl: previewImage
      });
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPreviewImage(null);
      e.target.reset();
    }, 3000);
  };

  return (
    <section className="section report-section bg-white">
      <div className="container">
        <div className="report-container">
          <div className="report-content">
            <h2 className="section-title" style={{ textAlign: 'left' }}>Report an Incident</h2>
            <p className="section-subtitle" style={{ textAlign: 'left', maxWidth: '100%' }}>
              Your quick action can save a life. Fill out the details below. Our system will automatically alert the nearest appropriate responders.
            </p>
            
            <div className="report-features">
              <div className="feature-item">
                <MapPin className="feature-icon text-accent" />
                <div>
                  <h4>Auto-Location</h4>
                  <p>GPS pinpoints your exact position.</p>
                </div>
              </div>
              <div className="feature-item">
                <Camera className="feature-icon text-accent" />
                <div>
                  <h4>AI Image Analysis</h4>
                  <p>Upload a photo for instant severity assessment.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="report-form-wrapper">
            {submitted ? (
              <div className="success-state animate-fade-in">
                <CheckCircle size={64} className="success-icon" />
                <h3>Report Submitted Successfully!</h3>
                <p>Responders have been alerted and are en route.</p>
                <button className="btn btn-secondary mt-4" onClick={() => setSubmitted(false)}>
                  Submit Another Report
                </button>
              </div>
            ) : (
              <form className="report-form animate-fade-in" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Incident Type</label>
                  <select name="type" className="form-control" required>
                    <option value="">Select category...</option>
                    <option value="animal">Animal Rescue</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="safety">Public Safety / Hazard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <div className="input-with-icon">
                    <MapPin size={18} className="input-icon" />
                    <input 
                      type="text" 
                      name="location" 
                      className="form-control" 
                      placeholder="Detecting location..." 
                      value={locationValue}
                      onChange={(e) => setLocationValue(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Evidence</label>
                  <div className="upload-area" style={{ position: 'relative', overflow: 'hidden' }}>
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                    ) : (
                      <>
                        <Camera size={24} className="upload-icon" />
                        <p>Take a photo or upload from gallery</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      className="file-input-hidden" 
                      onChange={handleImageChange}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Severity Level</label>
                  <div className="severity-options">
                    <label className="severity-radio">
                      <input type="radio" name="severity" value="low" />
                      <span className="severity-label low">Low</span>
                    </label>
                    <label className="severity-radio">
                      <input type="radio" name="severity" value="medium" defaultChecked />
                      <span className="severity-label medium">Medium</span>
                    </label>
                    <label className="severity-radio">
                      <input type="radio" name="severity" value="critical" />
                      <span className="severity-label critical">Critical</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" className="form-control" rows="3" placeholder="Briefly describe the situation..."></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  <AlertTriangle size={20} /> Submit Emergency Report
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportForm;
