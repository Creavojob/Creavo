import { useState, useEffect } from 'react';
import { jobsAPI } from '../services/api';

const CACHE_KEY = 'creavo_jobs_cache';

export default function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await jobsAPI.getAll({ status: 'open', limit: 100 });
        if (cancelled) return;
        const data = res.data || [];
        setJobs(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getAll({ status: 'open', limit: 100 });
      const data = res.data || [];
      setJobs(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { jobs, loading, error, refresh };
}
