import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

import useJobs from '../hooks/useJobs';



const HomePage = () => {
  const { jobs, loading, error, refresh } = useJobs();
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();


  const getExperienceYears = (experience) => {
    switch(experience) {
      case 'entry': return '0-2 Jahre';
      case 'intermediate': return '2-5 Jahre';
      case 'expert': return '5+ Jahre';
      default: return experience;
    }
  };


  // Fehleranzeige
  if (error) {
    return (
      <div style={{ color: 'red', padding: 32 }}>
        <h2>Fehler beim Laden der Jobs</h2>
        <pre>{error.message || String(error)}</pre>
        <button onClick={refresh}>Erneut versuchen</button>
      </div>
    );
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || job.category === categoryFilter;
    const matchesExperience = !experienceFilter || job.experience === experienceFilter;
    
    let matchesBudget = true;
    if (budgetMin) {
      const min = parseFloat(budgetMin);
      if (budgetMin === '5000') {
        matchesBudget = job.budget >= 5000;
      } else if (budgetMin === '2500') {
        matchesBudget = job.budget >= 2500 && job.budget < 5000;
      } else if (budgetMin === '1000') {
        matchesBudget = job.budget >= 1000 && job.budget < 2500;
      } else if (budgetMin === '500') {
        matchesBudget = job.budget >= 500 && job.budget < 1000;
      } else if (budgetMin === '0') {
        matchesBudget = job.budget < 500;
      }
    }
    
    return matchesSearch && matchesCategory && matchesExperience && matchesBudget;
  });

  const categories = [...new Set(jobs.map(j => j.category))].filter(Boolean);

  const getStatusStyle = (status) => {
    const baseStyle = {
      fontWeight: 'bold',
      fontSize: '0.95rem'
    };

    switch (status) {
      case 'open':
        return { ...baseStyle, color: '#10b981' };
      case 'in-progress':
        return { ...baseStyle, color: '#ff9800' };
      case 'abgeschlossen':
        return { ...baseStyle, color: '#00a8ff' };
      case 'closed':
        return { ...baseStyle, color: '#ef4444' };
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
      {/* cache/status bar removed */}
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🎬 Willkommen bei Creavo</h1>
        <p style={styles.heroSubtitle}>Die Jobbörse für die Medienbranche</p>
        <div style={styles.heroUSPs}>
          <span style={styles.uspItem}>⚡ Schnell</span>
          <span style={styles.uspDivider}>•</span>
          <span style={styles.uspItem}>🔒 Sicher</span>
          <span style={styles.uspDivider}>•</span>
          <span style={styles.uspItem}>✅ Fair</span>
        </div>
        <button onClick={handlePostJob} style={styles.heroButton}>
          {isAuthenticated ? '➕ Job posten' : '➕ Job posten (Anmelden erforderlich)'}
        </button>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div 
          style={{
            ...styles.statBox,
            transform: hoveredStat === 0 ? 'translateY(-5px)' : 'translateY(0)',
            boxShadow: hoveredStat === 0 ? '0 8px 20px rgba(0,168,255,0.2)' : 'none',
            borderColor: hoveredStat === 0 ? '#00a8ff' : '#333'
          }}
          onMouseEnter={() => setHoveredStat(0)}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <div style={styles.statIcon}>💼</div>
          <div style={styles.statNumber}>{jobs.length}</div>
          <div style={styles.statLabel}>Offene Jobs</div>
        </div>
        <div 
          style={{
            ...styles.statBox,
            transform: hoveredStat === 1 ? 'translateY(-5px)' : 'translateY(0)',
            boxShadow: hoveredStat === 1 ? '0 8px 20px rgba(0,168,255,0.2)' : 'none',
            borderColor: hoveredStat === 1 ? '#00a8ff' : '#333'
          }}
          onMouseEnter={() => setHoveredStat(1)}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statNumber}>100+</div>
          <div style={styles.statLabel}>Freelancer</div>
        </div>
        <div 
          style={{
            ...styles.statBox,
            transform: hoveredStat === 2 ? 'translateY(-5px)' : 'translateY(0)',
            boxShadow: hoveredStat === 2 ? '0 8px 20px rgba(0,168,255,0.2)' : 'none',
            borderColor: hoveredStat === 2 ? '#00a8ff' : '#333'
          }}
          onMouseEnter={() => setHoveredStat(2)}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <div style={styles.statIcon}>🎯</div>
          <div style={styles.statNumber}>50+</div>
          <div style={styles.statLabel}>Auftraggeber</div>
        </div>
      </div>

      {/* Jobs List */}
      <div style={styles.section}>
        <div style={styles.jobsHeader}>
          <h2 style={styles.sectionTitle}>📋 Offene Jobs</h2>
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            style={styles.filterToggle}
          >
            🔍 Filter {filterOpen ? '▲' : '▼'}
          </button>
        </div>
        
        {/* Search & Filter Bar */}
        {filterOpen && (
          <div style={styles.filterBar}>
            <input
              type="text"
              placeholder="🔍 Suche nach Jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">Kategorien</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">Erfahrung</option>
              <option value="entry">0-2 Jahre</option>
              <option value="intermediate">2-5 Jahre</option>
              <option value="expert">5+ Jahre</option>
            </select>
            
            <select
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">Budget</option>
              <option value="0">0 - 500€</option>
              <option value="500">500 - 1.000€</option>
              <option value="1000">1.000 - 2.500€</option>
              <option value="2500">2.500 - 5.000€</option>
              <option value="5000">5.000€+</option>
            </select>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setExperienceFilter('');
                setBudgetMin('');
                setBudgetMax('');
              }}
              style={styles.resetBtn}
            >
              ↻ Zurücksetzen
            </button>
          </div>
        )}
        
        {loading ? (
          <div style={styles.loading}>Lädt...</div>
        ) : filteredJobs.length === 0 ? (
          <div style={styles.noJobs}>
            <p>Keine Jobs gefunden. Passe deine Filter an!</p>
          </div>
        ) : (
          <div style={styles.jobsGrid}>
            {filteredJobs.map((job) => (
              <div key={job.id} style={styles.jobCard}>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <p style={styles.jobCategory}>{job.category}</p>
                <p style={styles.jobDescription}>{job.description.substring(0, 120)}...</p>
                
                <div style={styles.jobMeta}>
                  <span style={styles.budget}>💰 {job.budget} {job.currency}</span>
                  <span style={styles.experience}>Erfahrung: {getExperienceYears(job.experience)}</span>
                </div>

                <div style={styles.jobFooter}>
                  <button 
                    onClick={() => setSelectedJob(job)}
                    style={{...styles.viewBtn, backgroundColor: '#00a8ff', color: '#000'}}
                  >
                    Details ansehen
                  </button>
                  <button 
                    onClick={() => handleApply(job.id)}
                    style={{...styles.viewBtn, backgroundColor: '#10b981', color: '#000'}}
                  >
                    {isAuthenticated ? 'Bewerben' : 'Anmelden zum Bewerben'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feature Highlights */}
      <div style={styles.features}>
        <div style={styles.featuresGrid}>
          <div 
            style={{
              ...styles.featureCard,
              transform: hoveredFeature === 0 ? 'translateY(-5px)' : 'translateY(0)',
              borderColor: hoveredFeature === 0 ? '#00a8ff' : '#333'
            }}
            onMouseEnter={() => setHoveredFeature(0)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div style={styles.featureIcon}>🔒</div>
            <h3 style={styles.featureTitle}>Escrow-Zahlungen</h3>
            <p style={styles.featureText}>Geld sicher hinterlegt bis zur Fertigstellung</p>
          </div>
          <div 
            style={{
              ...styles.featureCard,
              transform: hoveredFeature === 1 ? 'translateY(-5px)' : 'translateY(0)',
              borderColor: hoveredFeature === 1 ? '#00a8ff' : '#333'
            }}
            onMouseEnter={() => setHoveredFeature(1)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div style={styles.featureIcon}>⚡</div>
            <h3 style={styles.featureTitle}>Schnelle Vermittlung</h3>
            <p style={styles.featureText}>Bewerbungen in Echtzeit, direkte Kommunikation</p>
          </div>
          <div 
            style={{
              ...styles.featureCard,
              transform: hoveredFeature === 2 ? 'translateY(-5px)' : 'translateY(0)',
              borderColor: hoveredFeature === 2 ? '#00a8ff' : '#333'
            }}
            onMouseEnter={() => setHoveredFeature(2)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div style={styles.featureIcon}>✅</div>
            <h3 style={styles.featureTitle}>Qualität garantiert</h3>
            <p style={styles.featureText}>Bewertungssystem für beide Seiten</p>
          </div>
          <div 
            style={{
              ...styles.featureCard,
              transform: hoveredFeature === 3 ? 'translateY(-5px)' : 'translateY(0)',
              borderColor: hoveredFeature === 3 ? '#00a8ff' : '#333'
            }}
            onMouseEnter={() => setHoveredFeature(3)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div style={styles.featureIcon}>💬</div>
            <h3 style={styles.featureTitle}>Direkter Chat</h3>
            <p style={styles.featureText}>Kommunikation zwischen Auftraggeber & Freelancer</p>
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div style={styles.modal} onClick={() => setSelectedJob(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedJob(null)}>✕</button>
            <h2>{selectedJob.title}</h2>
            <p><strong>Kategorie:</strong> {selectedJob.category}</p>
            <p><strong>Budget:</strong> {selectedJob.budget} {selectedJob.currency}</p>
            <p><strong>Erfahrung:</strong> {getExperienceYears(selectedJob.experience)}</p>
            <p><strong>Status:</strong> <span style={getStatusStyle(selectedJob.status)}>{getStatusLabel(selectedJob.status)}</span></p>
            <p style={{marginTop: '1rem'}}><strong>Beschreibung:</strong></p>
            <p>{selectedJob.description}</p>
            
            <div style={styles.modalButtons}>
              <button 
                onClick={() => handleApply(selectedJob.id)}
                style={styles.applyBtn}
              >
                {isAuthenticated ? 'Jetzt bewerben' : 'Anmelden zum Bewerben'}
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
    background: 'linear-gradient(135deg, rgba(0,168,255,0.1) 0%, rgba(16,185,129,0.05) 100%)',
    color: '#ffffff',
    padding: '4rem 2rem',
    textAlign: 'center',
    borderBottom: '1px solid #333'
  },
  cacheBar: {
    maxWidth: '1200px',
    margin: '1rem auto',
    padding: '0.5rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111',
    color: '#fff',
    border: '1px solid #333',
    borderRadius: 8
  },
  smallBtn: {
    padding: '0.35rem 0.6rem',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#00a8ff',
    color: '#000',
    cursor: 'pointer',
    fontWeight: '600'
  },
  heroTitle: {
    fontSize: '2.8rem',
    margin: '0 0 1rem 0',
    color: '#ffffff',
    fontWeight: 'bold'
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    margin: '0 0 1.5rem 0',
    opacity: 0.9,
    color: '#cccccc'
  },
  heroUSPs: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    fontSize: '1.1rem',
    color: '#ccc'
  },
  uspItem: {
    fontWeight: '500'
  },
  uspDivider: {
    color: '#666',
    fontSize: '1.5rem'
  },
  heroButton: {
    padding: '0.65rem 1.8rem',
    backgroundColor: '#00a8ff',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(0,168,255,0.3)'
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
  statBox: {
    textAlign: 'center',
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: '2rem 1.5rem',
    borderRadius: '12px',
    border: '2px solid #333',
    transition: 'all 0.3s',
    cursor: 'pointer'
  },
  statIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  statNumber: {
    fontSize: '2.8rem',
    fontWeight: 'bold',
    color: '#00a8ff',
    marginBottom: '0.5rem'
  },
  statLabel: {
    color: '#aaa',
    marginTop: '0.5rem',
    fontSize: '1rem'
  },
  section: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 2rem',
    paddingBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    color: '#fff',
    fontWeight: 'bold',
    margin: 0
  },
  jobsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  filterToggle: {
    padding: '0.65rem 1.25rem',
    backgroundColor: '#00a8ff',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,168,255,0.3)'
  },
  filterBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    padding: '1.5rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    border: '2px solid #333'
  },
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem'
  },
  jobCard: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    border: '2px solid #333',
    transition: 'transform 0.2s, border-color 0.2s'
  },
  jobTitle: {
    margin: '0 0 0.75rem 0',
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: 'bold'
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
    fontSize: '0.95rem',
    lineHeight: '1.5'
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
    color: '#10b981',
    fontSize: '1.1rem'
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
    gap: '0.75rem',
    marginTop: '1.25rem'
  },
  viewBtn: {
    flex: 1,
    padding: '0.5rem 0.75rem',
    backgroundColor: '#00a8ff',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  features: {
    maxWidth: '1200px',
    margin: '4rem auto',
    padding: '0 2rem'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem'
  },
  featureCard: {
    backgroundColor: '#1a1a1a',
    padding: '1.5rem 1rem',
    borderRadius: '12px',
    border: '2px solid #333',
    textAlign: 'center',
    transition: 'all 0.3s',
    cursor: 'pointer'
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.75rem'
  },
  featureTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#00a8ff',
    marginBottom: '0.5rem'
  },
  featureText: {
    color: '#aaa',
    fontSize: '0.85rem',
    lineHeight: '1.4'
  },
  filterBar: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    padding: '1.25rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    border: '2px solid #333'
  },
  searchInput: {
    flex: '2',
    minWidth: '200px',
    padding: '0.75rem',
    backgroundColor: '#0f0f0f',
    border: '2px solid #333',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.95rem'
  },
  filterSelect: {
    flex: '1',
    minWidth: '180px',
    padding: '0.75rem 2.5rem 0.75rem 0.75rem',
    backgroundColor: '#0f0f0f',
    border: '2px solid #333',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.95rem',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.5rem center',
    backgroundSize: '1.2rem'
  },
  resetBtn: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s'
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
    border: '2px solid #00a8ff'
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#00a8ff'
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem'
  },
  applyBtn: {
    flex: 1,
    padding: '0.6rem',
    backgroundColor: '#10b981',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  cancelBtn: {
    flex: 1,
    padding: '0.6rem',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600'
  }
};

export default HomePage;
