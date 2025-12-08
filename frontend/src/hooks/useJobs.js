import { useState, useEffect } from 'react';
import { jobsAPI } from '../services/api';

const CACHE_KEY = 'creavo_jobs_cache';

export default function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);

  useEffect(() => {
    // Load cache first
    let hasCacheLoaded = false;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.jobs) && parsed.jobs.length > 0) {
          setJobs(parsed.jobs);
          if (parsed.timestamp) setCacheTimestamp(parsed.timestamp);
          setLoading(false);
          hasCacheLoaded = true;
        }
      }
    } catch (err) {
      // ignore
    }

    let cancelled = false;

    const fetchAndCache = async () => {
      if (!hasCacheLoaded) {
        setLoading(true);
      }
      try {
        const res = await jobsAPI.getAll({ status: 'open', limit: 100 });
        if (cancelled) return;
        const data = res.data || [];
        setJobs(data);
        try {
          const payload = { jobs: data, timestamp: Date.now() };
          localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
          setCacheTimestamp(payload.timestamp);
        } catch (e) {
          // ignore
        }
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAndCache();

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
      try {
        const payload = { jobs: data, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
        setCacheTimestamp(payload.timestamp);
      } catch (e) {}
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { jobs, loading, error, refresh, cacheTimestamp };
}
