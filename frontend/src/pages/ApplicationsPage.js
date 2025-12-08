import React, { useEffect, useState } from 'react';
import { applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusMap = {
  pending: 'Offen',
  in_progress: 'In Arbeit',
  accepted: 'Vergeben',
  approved: 'Abgeschlossen',
  rejected: 'Abgelehnt'
};

const ApplicationsPage = () => {
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

  const handleAccept = async (id) => {
    try {
      await applicationsAPI.accept(id);
      fetchApplications();
      alert('Bewerbung angenommen — Escrow erstellt');
    } catch (err) {
      console.error('Error accepting application', err);
      alert('Fehler beim Annehmen');
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0f0f0f', minHeight: '80vh', color: '#ddd' }}>
      <h2 style={{ color: '#00a8ff' }}>Eingehende Bewerbungen</h2>
      {loading ? (
        <p>Lade...</p>
      ) : applications.length === 0 ? (
        <p>Keine eingehenden Bewerbungen.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {applications.map(app => (
            <div key={app.id} style={{ background: '#141414', padding: '1rem', borderRadius: 12, border: '2px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#00a8ff' }}>{app.job?.title || app.jobId}</strong>
                  <div style={{ color: '#aaa', marginTop: '0.5rem' }}>{app.coverLetter || '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#ef4444', fontWeight: '600' }}>{statusMap[app.status] || app.status}</div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <button onClick={() => handleAccept(app.id)} style={{ padding: '0.4rem 0.6rem', background: '#00a8ff', color: '#0f0f0f', border: 'none', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,168,255,0.3)', fontWeight: '600' }}>Annehmen</button>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', color: '#888' }}>Bewerber: {app.freelancer ? `${app.freelancer.firstName} ${app.freelancer.lastName}` : app.freelancerId}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
