import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateJobPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'design',
    budget: '',
    duration: '1-3 months',
    experience: 'intermediate',
    skills: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const jobData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        budget: parseFloat(formData.budget)
      };
      await jobsAPI.create(jobData);
      // Redirect after creation
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating job');
    } finally {
      setLoading(false);
    }
  };

  if (user?.userType !== 'client') {
    return <div style={styles.error}>Nur Auftraggeber können Jobs erstellen</div>;
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Neues Job Angebot erstellen</h2>
        {error && <p style={styles.errorMsg}>{error}</p>}
        
        <input
          type="text"
          name="title"
          placeholder="Job Titel"
          value={formData.title}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <textarea
          name="description"
          placeholder="Jobbeschreibung"
          value={formData.description}
          onChange={handleChange}
          required
          style={{...styles.input, minHeight: '150px'}}
        />
        
        <select name="category" value={formData.category} onChange={handleChange} style={styles.input}>
          <option value="Design">Design</option>
          <option value="Video">Video</option>
          <option value="Fotografie">Fotografie</option>
          <option value="Animation">Animation</option>
          <option value="Audio">Audio</option>
          <option value="3D">3D</option>
        </select>
        
        <input
          type="number"
          name="budget"
          placeholder="Budget"
          value={formData.budget}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <select name="experience" value={formData.experience} onChange={handleChange} style={styles.input}>
          <option value="entry">0-2 Jahre</option>
          <option value="intermediate">2-5 Jahre</option>
          <option value="expert">5+ Jahre</option>
        </select>
        
        <input
          type="text"
          name="skills"
          placeholder="Benötigte Skills (komma-getrennt)"
          value={formData.skills}
          onChange={handleChange}
          style={styles.input}
        />
        
        <div style={styles.buttonContainer}>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Wird erstellt...' : 'Job erstellen'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            style={styles.cancelButton}
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: '#0f0f0f',
    minHeight: '90vh'
  },
  form: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,168,255,0.1)',
    width: '100%',
    maxWidth: '600px',
    border: '2px solid #00a8ff'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0 1rem',
    border: '1px solid #333',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0'
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  button: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#00a8ff',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,168,255,0.3)'
  },
  cancelButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(239,68,68,0.3)'
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    color: '#ef4444'
  },
  errorMsg: {
    color: '#ff6666',
    marginBottom: '1rem',
    backgroundColor: '#4a0000',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '2px solid #ef4444'
  }
};

export default CreateJobPage;
