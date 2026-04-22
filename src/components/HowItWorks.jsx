import React from 'react';
import { Camera, UploadCloud, BellRing, Ambulance } from 'lucide-react';
import './HowItWorks.css';

const steps = [
  {
    icon: <Camera size={32} />,
    title: 'Capture',
    description: 'Quickly take a photo or record details of the emergency situation.'
  },
  {
    icon: <UploadCloud size={32} />,
    title: 'Upload',
    description: 'Submit the report with auto-detected GPS location and severity level.'
  },
  {
    icon: <BellRing size={32} />,
    title: 'Alert',
    description: 'Our system instantly notifies nearby volunteers and official responders.'
  },
  {
    icon: <Ambulance size={32} />,
    title: 'Respond',
    description: 'Help arrives faster, and the community is updated in real-time.'
  }
];

const HowItWorks = () => {
  return (
    <section className="section how-it-works bg-white">
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">A streamlined process designed for speed and reliability when every second counts.</p>
        
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="step-icon-wrapper">
                {step.icon}
                <div className="step-number">{index + 1}</div>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
