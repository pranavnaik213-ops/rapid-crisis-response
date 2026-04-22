import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, ShieldCheck, Clock, MapPin } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Fetch users and reports
    const fetchData = async () => {
      try {
        const [usersRes, reportsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/reports')
        ]);
        const usersData = await usersRes.json();
        const reportsData = await reportsRes.json();
        setUsers(usersData);
        setReports(reportsData);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      }
    };
    fetchData();
    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-brand">
          <ShieldCheck size={28} className="text-accent" />
          <h2>Admin Control Center</h2>
        </div>
        <button className="btn btn-secondary" onClick={onLogout}>Sign Out</button>
      </header>

      <main className="admin-main container">
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="stat-icon"><Users size={24} /></div>
            <div>
              <h3>Total Users</h3>
              <p>{users.length}</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon"><AlertTriangle size={24} /></div>
            <div>
              <h3>Total Reports</h3>
              <p>{reports.length}</p>
            </div>
          </div>
        </div>

        <div className="admin-panels">
          <div className="admin-panel">
            <h3>Recent Users & Logins</h3>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="3" className="text-center">No users found.</td></tr>
                  ) : (
                    users.map((u, i) => (
                      <tr key={i}>
                        <td>{u.email}</td>
                        <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                        <td>{new Date(u.lastLogin).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-panel">
            <h3>System Reports Log</h3>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Reporter</th>
                    <th>Incident</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Location</th>
                    <th>Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr><td colSpan="5" className="text-center">No reports found.</td></tr>
                  ) : (
                    reports.map(r => (
                      <tr key={r.id}>
                        <td>#{r.id}</td>
                        <td>{r.reportedBy || 'Anonymous'}</td>
                        <td><strong>{r.title}</strong></td>
                        <td style={{ textTransform: 'capitalize' }}>{r.type}</td>
                        <td>
                          <span className={`severity-badge badge-${r.severity}`}>{r.severity}</span>
                        </td>
                        <td><MapPin size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }}/>{r.location}</td>
                        <td>
                          {r.imageUrl ? (
                            <img 
                              src={r.imageUrl} 
                              alt="Evidence" 
                              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
                              onClick={() => window.open(r.imageUrl, '_blank')}
                              title="Click to view full image"
                            />
                          ) : (
                            <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No Photo</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
