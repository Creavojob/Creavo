import React, { useState, useEffect } from 'react';
import { jobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobsAPI.getAll({ status: 'open' });
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const baseStyle = {
      fontWeight: 'bold',
      fontSize: '0.95rem'
    };

    switch (status) {
      case 'open':
        return { ...baseStyle, color: '#00ff00' };
      case 'in-progress':
        return { ...baseStyle, color: '#ffa500' };
      case 'abgeschlossen':
        return { ...baseStyle, color: '#00a8ff' };
      case 'closed':
        return { ...baseStyle, color: '#ff3333' };
      default:
        return { ...baseStyle, color: '#fff' };
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

  const handleApply = (jobId) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    const job = jobs.find(j => j.id === jobId);
    setApplyJob(job || null);
  };

  const handlePostJob = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    navigate('/jobs/create');
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🎬 Willkommen bei Creavo</h1>
        <p style={styles.heroSubtitle}>Die Jobbörse für die Medienbranche</p>
        <button onClick={handlePostJob} style={styles.heroButton}>
          {isAuthenticated ? '➕ Job posten' : '➕ Job posten (Anmelden erforderlich)'}
        </button>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div style={styles.stat}>
          <div style={styles.statNumber}>{jobs.length}</div>
          <div style={styles.statLabel}>Offene Jobs</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statNumber}>100+</div>
          <div style={styles.statLabel}>Freelancer</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statNumber}>50+</div>
          <div style={styles.statLabel}>Auftraggeber</div>
        </div>
      </div>

      {/* Jobs List */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📋 Offene Jobs</h2>
        
        {loading ? (
          <div style={styles.loading}>Lädt...</div>
        ) : jobs.length === 0 ? (
          <div style={styles.noJobs}>
            <p>Keine Jobs verfügbar. Komm später wieder!</p>
          </div>
        ) : (
          <div style={styles.jobsGrid}>
            {jobs.map((job) => (
              <div key={job.id} style={styles.jobCard}>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <p style={styles.jobCategory}>{job.category}</p>
                <p style={styles.jobDescription}>{job.description.substring(0, 120)}...</p>
                
                <div style={styles.jobMeta}>
                  <span style={styles.budget}>💰 {job.budget} {job.currency}</span>
                  <span style={styles.experience}>{job.experience}</span>
                </div>

                <div style={styles.jobFooter}>
                  <button 
                    onClick={() => setSelectedJob(job)}
                    style={{...styles.viewBtn, backgroundColor: '#00a8ff'}}
                  >
                    Details ansehen
                  </button>
                  <button 
                    onClick={() => handleApply(job.id)}
                    style={{...styles.viewBtn, backgroundColor: '#00ff00', color: '#000'}}
                  >
                    {isAuthenticated ? 'Bewerben' : 'Anmelden zum Bewerben'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div style={styles.modal} onClick={() => setSelectedJob(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedJob(null)}>✕</button>
            <h2>{selectedJob.title}</h2>
            <p><strong>Kategorie:</strong> {selectedJob.category}</p>
            <p><strong>Budget:</strong> {selectedJob.budget} {selectedJob.currency}</p>
            <p><strong>Erfahrung:</strong> {selectedJob.experience}</p>
            <p><strong>Status:</strong> <span style={getStatusStyle(selectedJob.status)}>{getStatusLabel(selectedJob.status)}</span></p>
            <p style={{marginTop: '1rem'}}><strong>Beschreibung:</strong></p>
            <p>{selectedJob.description}</p>
            
            <div style={styles.modalButtons}>
              <button 
                onClick={() => handleApply(selectedJob.id)}
                style={styles.applyBtn}
              >
                {isAuthenticated ? '✅ Jetzt bewerben' : '🔐 Anmelden zum Bewerben'}
              </button>
              <button 
                onClick={() => setSelectedJob(null)}
                style={styles.cancelBtn}
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyJob && (
        <div style={styles.modal} onClick={() => { if(!submitting) setApplyJob(null); }}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setApplyJob(null)}>✕</button>
            <h3>Auf {applyJob.title} bewerben</h3>
            <p style={{ color: '#ccc' }}>Möchtest du dem Auftraggeber noch etwas mitteilen? (optional)</p>
            <textarea
              value={applyMessage}
              onChange={(e) => setApplyMessage(e.target.value)}
              placeholder="Kurze Nachricht / Zusatzinfos"
              style={{ width: '100%', minHeight: '120px', padding: '0.75rem', background: '#111', color: '#eee', border: '1px solid #333', borderRadius: 4 }}
            />

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={async () => {
                  if (!isAuthenticated) { navigate('/auth'); return; }
                  setSubmitting(true);
                  try {
                    await applicationsAPI.submit({ jobId: applyJob.id, bidAmount: applyJob.budget || 0, coverLetter: applyMessage });
                    setApplyMessage('');
                    setApplyJob(null);
                    // Optionally refresh jobs/applications
                    fetchJobs();
                    alert('Bewerbung erfolgreich gesendet');
                  } catch (err) {
                    console.error('Error submitting application', err);
                    alert('Fehler beim Senden der Bewerbung');
                  } finally {
                    setSubmitting(false);
                  }
                }}
                style={{ ...styles.applyBtn, flex: 1 }}
                disabled={submitting}
              >
                {submitting ? 'Sende...' : 'Weiter / Bewerbung abschließen'}
              </button>
              <button onClick={() => setApplyJob(null)} style={styles.cancelBtn} disabled={submitting}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0f0f0f',
    minHeight: '100vh'
  },
  hero: {
    backgroundColor: 'transparent',
    background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
    color: '#ffffff',
    padding: '3rem 2rem',
    textAlign: 'center',
    borderBottom: '2px solid #ffffff'
  },
  heroTitle: {
    fontSize: '2.5rem',
    margin: '0 0 0.5rem 0',
    color: '#ffffff'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    margin: '0 0 2rem 0',
    opacity: 0.8,
    color: '#cccccc'
  },
  heroButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#00ff00',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    padding: '2rem',
    maxWidth: '1200px',
    margin: '2rem auto',
    backgroundColor: 'transparent',
    borderRadius: '8px'
  },
  stat: {
    textAlign: 'center',
    flex: 1
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#ff3333'
  },
  statLabel: {
    color: '#aaaaaa',
    marginTop: '0.5rem'
  },
  section: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 2rem',
    paddingBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: '#00ff00'
  },
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  jobCard: {
    backgroundColor: '#1a1a1a',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,255,0,0.1)',
    border: '1px solid #00ff00',
    transition: 'transform 0.2s, border-color 0.2s'
  },
  jobTitle: {
    margin: '0 0 0.5rem 0',
    color: '#00ff00',
    fontSize: '1.1rem'
  },
  jobCategory: {
    color: '#00a8ff',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    margin: '0.5rem 0',
    backgroundColor: '#0a2a3a',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    display: 'inline-block'
  },
  jobDescription: {
    color: '#aaa',
    margin: '0.75rem 0',
    fontSize: '0.95rem'
  },
  jobMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1rem 0',
    paddingTop: '1rem',
    borderTop: '1px solid #333'
  },
  budget: {
    fontWeight: 'bold',
    color: '#00ff00'
  },
  experience: {
    backgroundColor: '#333',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    color: '#aaa'
  },
  jobFooter: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  viewBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#00ff00',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#888'
  },
  noJobs: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    color: '#888',
    border: '1px solid #333'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
    position: 'relative',
    border: '1px solid #00ff00'
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#00ff00'
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem'
  },
  applyBtn: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#00ff00',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  cancelBtn: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#ff3333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default HomePage;
