import React, { useEffect, useState } from 'react';
import { jobsAPI } from '../services/api';

const DebugJobsPage = () => {
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await jobsAPI.getAll({ status: 'open', limit: 100 });
        setJobs(res.data);
        setError(null);
      } catch (err) {
        setError(err.message || String(err));
        setJobs(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div style={{ padding: 20, color: '#eee', background: '#0f0f0f', minHeight: '100vh' }}>
      <h1>React Debug - Jobs</h1>
      <div style={{ marginBottom: 12 }}>
        <strong>Loading:</strong> {String(loading)} {' '}
        <strong>Error:</strong> {error ? String(error) : 'none'}
      </div>
      <div>
        <pre style={{ background: '#111', padding: 12, borderRadius: 6, color: '#ddd', overflow: 'auto' }}>
          {jobs ? JSON.stringify(jobs, null, 2) : (loading ? 'Lädt...' : 'Keine Daten')}
        </pre>
      </div>
    </div>
  );
};

export default DebugJobsPage;
