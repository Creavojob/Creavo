import React, { useState, useEffect } from 'react';
import { jobsAPI } from '../services/api';

const JobsAdminPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    currency: 'EUR',
    experience: 'Mid-Level',
    status: 'open'
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobsAPI.getAll();
      setJobs(response.data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job.id);
    setFormData({
      title: job.title,
      description: job.description,
      category: job.category,
      budget: job.budget,
      currency: job.currency,
      experience: job.experience,
      status: job.status
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!editingJob) return;

    try {
      await jobsAPI.update(editingJob, formData);
      setEditingJob(null);
      fetchJobs();
      alert('✅ Job aktualisiert');
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('❌ Fehler beim Speichern des Jobs');
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Sicher, dass du diesen Job löschen möchtest?')) {
      try {
        await jobsAPI.delete(jobId);
        fetchJobs();
        alert('✅ Job gelöscht');
      } catch (error) {
        console.error('Fehler beim Löschen:', error);
        alert('❌ Fehler beim Löschen des Jobs');
      }
    }
  };

  const handleCancel = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      budget: '',
      currency: 'EUR',
      experience: 'Mid-Level',
      status: 'open'
    });
  };

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

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>📋 Job-Verwaltung</h1>
        <p style={styles.subtitle}>Verwalte und bearbeite alle offenen Job-Angebote</p>

        {loading ? (
          <div style={styles.loading}>Lädt...</div>
        ) : (
          <div style={styles.jobsList}>
            {jobs.map((job) => (
              <div key={job.id} style={styles.jobItem}>
                {editingJob === job.id ? (
                  // Edit Mode
                  <div style={styles.editForm}>
                    <h2 style={styles.editTitle}>Bearbeite: {job.title}</h2>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Titel</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Beschreibung</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        style={styles.textarea}
                        rows="5"
                      />
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Kategorie</label>
                        <input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Budget</label>
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Währung</label>
                        <select
                          name="currency"
                          value={formData.currency}
                          onChange={handleChange}
                          style={styles.input}
                        >
                          <option>EUR</option>
                          <option>USD</option>
                          <option>GBP</option>
                        </select>
                      </div>
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Erfahrung</label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          style={styles.input}
                        >
                          <option>Junior</option>
                          <option>Mid-Level</option>
                          <option>Senior</option>
                        </select>
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          style={styles.input}
                        >
                          <option value="open">Offen</option>
                          <option value="in-progress">In Bearbeitung</option>
                          <option value="abgeschlossen">Abgeschlossen</option>
                          <option value="closed">Geschlossen</option>
                        </select>
                      </div>
                    </div>

                    <div style={styles.formButtons}>
                      <button onClick={handleSave} style={styles.saveBtn}>
                        💾 Speichern
                      </button>
                      <button onClick={handleCancel} style={styles.cancelBtn}>
                        ❌ Abbrechen
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div style={styles.jobHeader}>
                      <h3 style={styles.jobTitle}>{job.title}</h3>
                      <span style={getStatusStyle(job.status)}>{getStatusLabel(job.status)}</span>
                    </div>

                    <p style={styles.jobCategory}>{job.category}</p>
                    <p style={styles.jobDescription}>{job.description}</p>

                    <div style={styles.jobMeta}>
                      <span style={styles.budget}>💰 {job.budget} {job.currency}</span>
                      <span style={styles.experience}>📊 {job.experience}</span>
                    </div>

                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleEdit(job)}
                        style={styles.editBtn}
                      >
                        ✏️ Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        style={styles.deleteBtn}
                      >
                        🗑️ Löschen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0f0f0f',
    minHeight: '100vh',
    padding: '2rem'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    fontSize: '2.5rem',
    color: '#ffffff',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#aaa',
    marginBottom: '2rem'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#888'
  },
  jobsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
    gap: '2rem'
  },
  jobItem: {
    backgroundColor: '#1a1a1a',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #00ff00',
    boxShadow: '0 2px 10px rgba(0,255,0,0.1)'
  },
  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1rem'
  },
  jobTitle: {
    margin: 0,
    color: '#00ff00',
    fontSize: '1.2rem',
    flex: 1
  },
  jobBadge: {
    backgroundColor: '#ff3333',
    color: '#ffffff',
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: 'bold'
  },
  jobCategory: {
    color: '#aaa',
    fontSize: '0.9rem',
    marginBottom: '0.5rem'
  },
  jobDescription: {
    color: '#ccc',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    marginBottom: '1rem',
    maxHeight: '100px',
    overflow: 'hidden'
  },
  jobMeta: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  budget: {
    color: '#ff3333',
    fontWeight: 'bold'
  },
  experience: {
    color: '#00ff00'
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  editBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#00ff00',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  deleteBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#ff3333',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  editForm: {
    padding: '1rem',
    backgroundColor: '#0f0f0f',
    borderRadius: '4px'
  },
  editTitle: {
    color: '#00ff00',
    marginBottom: '1rem'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    color: '#aaa',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  formButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  saveBtn: {
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
    backgroundColor: '#333',
    color: '#aaa',
    border: '1px solid #555',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default JobsAdminPage;
