import React from 'react';
import useJobs from '../hooks/useJobs';

const JobsListPage = () => {
  const { jobs, loading } = useJobs();

  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.85rem',
      fontWeight: 'bold'
    };

    switch (status) {
      case 'open':
        return { ...baseStyle, backgroundColor: '#00ff00', color: '#000' };
      case 'in-progress':
        return { ...baseStyle, backgroundColor: '#ffa500', color: '#000' };
      case 'abgeschlossen':
        return { ...baseStyle, backgroundColor: '#00a8ff', color: '#fff' };
      case 'closed':
        return { ...baseStyle, backgroundColor: '#ff3333', color: '#fff' };
      default:
        return { ...baseStyle, backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #333' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return 'Offen';
      case 'in-progress': return 'In Bearbeitung';
      case 'abgeschlossen': return 'Abgeschlossen';
      case 'closed': return 'Geschlossen';
      default: return status;
    }
  };

  if (loading) return <div>Lädt...</div>;

  return (
    <div style={styles.container}>
      <h1>Job Angebote</h1>
      <div style={styles.jobsList}>
        {jobs.map((job) => (
          <div key={job.id} style={styles.jobCard}>
            <h3>{job.title}</h3>
            <p style={styles.category}>{job.category}</p>
            <p style={styles.description}>{job.description.substring(0, 100)}...</p>
            <div style={styles.footer}>
              <span style={styles.budget}>💰 {job.budget} {job.currency}</span>
              <span style={getStatusStyle(job.status)}>{getStatusLabel(job.status)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#0f0f0f',
    minHeight: '90vh'
  },
  jobsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  jobCard: {
    backgroundColor: '#1a1a1a',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,255,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    border: '1px solid #00ff00',
    color: '#e0e0e0'
  },
  category: {
    color: '#888',
    fontSize: '0.9rem',
    margin: '0.5rem 0'
  },
  description: {
    color: '#aaa',
    margin: '1rem 0'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
    borderTop: '1px solid #333',
    paddingTop: '1rem'
  },
  budget: {
    fontWeight: 'bold',
    color: '#ff3333'
  }
};

export default JobsListPage;
