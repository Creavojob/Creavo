import React, { useEffect, useState } from 'react';
import { applicationsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MessagesPage = () => {
  const { isAuthenticated } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchApplications();
  }, [isAuthenticated]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationsAPI.getAll();
      setApplications(res.data || []);
    } catch (err) {
      console.error('Error fetching applications', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0f0f0f', minHeight: '80vh', color: '#ddd' }}>
      <h2 style={{ color: '#00a8ff' }}>Nachrichten & Unterhaltungen</h2>
      {loading ? (
        <p>Lade...</p>
      ) : applications.length === 0 ? (
        <p>Keine Unterhaltungen vorhanden.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {applications.map(app => (
            <div key={app.id} style={{ background: '#141414', padding: '1rem', borderRadius: 12, border: '2px solid #333', cursor: 'pointer' }} onClick={() => navigate(`/messages/${app.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#00a8ff' }}>{app.job?.title || 'Projekt'}</strong>
                <div style={{ color: '#888' }}>{new Date(app.createdAt).toLocaleDateString()}</div>
              </div>
              <div style={{ marginTop: '0.5rem', color: '#aaa' }}>
                Teilnehmer: {app.freelancer ? `${app.freelancer.firstName} ${app.freelancer.lastName}` : app.freelancerId}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
