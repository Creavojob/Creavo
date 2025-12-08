import React, { useEffect, useState } from 'react';
import { applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusMap = {
  pending: 'Offen',
  in_progress: 'In Arbeit',
  accepted: 'Vergeben',
  approved: 'Abgeschlossen',
  rejected: 'Abgelehnt',
  submitted: 'Abgeschlossen (eingereicht)'
};

const RequestsPage = () => {
  const { isAuthenticated } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <h2 style={{ color: '#00a8ff' }}>Meine Bewerbungen / Anfragen</h2>
      {loading ? (
        <p>Lade...</p>
      ) : applications.length === 0 ? (
        <p>Keine Bewerbungen vorhanden.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {applications.map(app => (
            <div key={app.id} style={{ background: '#141414', padding: '1rem', borderRadius: 12, border: '2px solid #333' }}>
              <strong style={{ color: '#00a8ff' }}>{app.job?.title || app.jobId}</strong>
              <div style={{ color: '#aaa', marginTop: '0.5rem' }}>{app.coverLetter || '—'}</div>
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ color: '#ef4444', fontWeight: '600' }}>{statusMap[app.status] || app.status}</span>
                <span style={{ marginLeft: '1rem', color: '#888' }}>Gebot: {app.bidAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
