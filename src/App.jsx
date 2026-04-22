import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import LiveMap from './components/LiveMap';
import ReportForm from './components/ReportForm';
import Network from './components/Network';
import AlertsSystem from './components/AlertsSystem';
import ImpactStats from './components/ImpactStats';
import Footer from './components/Footer';
import Login from './components/Login';
import VerifyEmail from './components/VerifyEmail';
import SignUp from './components/SignUp';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [authState, setAuthState] = useState('public'); // 'public' | 'login' | 'signup' | 'authenticated' | 'adminLogin' | 'adminDashboard'
  const [userEmail, setUserEmail] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (authState === 'authenticated') {
      fetch('/api/reports')
        .then(res => res.json())
        .then(data => setIncidents(data))
        .catch(err => console.error("Failed to load incidents", err));
    }
  }, [authState]);

  const addIncident = async (newIncident) => {
    const defaultLat = 20.5937 + (Math.random() * 5 - 2.5);
    const defaultLng = 78.9629 + (Math.random() * 5 - 2.5);
    
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newIncident, 
          reportedBy: userEmail,
          lat: newIncident.lat || defaultLat,
          lng: newIncident.lng || defaultLng
        })
      });
      const data = await res.json();
      if (data.success) {
        setIncidents(prev => [data.report, ...prev]);
      }
    } catch (err) {
      console.error('Failed to submit report', err);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        setUserEmail(email);
        setAuthState('authenticated');
      } else {
        alert(data.error || 'Failed to login. Please check credentials.');
      }
    } catch (err) {
      alert('Could not connect to the backend server.');
    }
  };

  const handleSignup = async (email, password, role) => {
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      
      if (data.success) {
        setUserEmail(email);
        setAuthState('authenticated');
      } else {
        alert(data.error || 'Failed to create account.');
      }
    } catch (err) {
      alert('Could not connect to the backend server.');
    }
  };

  if (authState === 'login') {
    return (
      <div className="animate-fade-in">
        <Navbar authState={authState} userEmail={userEmail} onNavigate={setAuthState} />
        <div style={{ paddingTop: '80px' }}>
          <Login 
            onLogin={handleLogin} 
            onSwitchToSignup={() => setAuthState('signup')}
            onSwitchToAdmin={() => setAuthState('adminLogin')}
          />
        </div>
      </div>
    );
  }

  if (authState === 'signup') {
    return (
      <div className="animate-fade-in">
        <Navbar authState={authState} userEmail={userEmail} onNavigate={setAuthState} />
        <div style={{ paddingTop: '80px' }}>
          <SignUp 
            onSignup={handleSignup}
            onSwitchToLogin={() => setAuthState('login')}
          />
        </div>
      </div>
    );
  }

  // Verification step bypassed
  // if (authState === 'verify') {
  //   return <VerifyEmail email={userEmail} previewUrl={previewUrl} onVerify={() => setAuthState('authenticated')} />;
  // }

  if (authState === 'adminLogin') {
    return <AdminLogin onLoginSuccess={() => setAuthState('adminDashboard')} onCancel={() => setAuthState('login')} />;
  }

  if (authState === 'adminDashboard') {
    return <AdminDashboard onLogout={() => setAuthState('login')} />;
  }

  return (
    <div className="app-container animate-fade-in">
      <Navbar authState={authState} userEmail={userEmail} onNavigate={setAuthState} />
      <div style={{ paddingTop: '70px' }}>
        <AlertsSystem incidents={incidents} />
        <HeroSection />
        <HowItWorks />
        <LiveMap incidents={incidents} />
        {authState === 'authenticated' ? (
          <ReportForm addIncident={addIncident} />
        ) : (
          <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '12px', margin: '2rem auto', maxWidth: '800px', border: '1px dashed #CBD5E1' }}>
            <h3 style={{ color: '#0A2540', marginBottom: '1rem' }}>Log in to Report an Emergency</h3>
            <p style={{ color: '#64748B', marginBottom: '2rem' }}>You must be a registered user to submit incidents to the global crisis network.</p>
            <button className="btn btn-primary animate-scale-in" onClick={() => setAuthState('login')}>Sign In to Report</button>
          </div>
        )}
        <ImpactStats />
        <Network />
        <Footer />
      </div>
    </div>
  );
}

export default App;
