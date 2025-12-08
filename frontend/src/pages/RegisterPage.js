import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userType: 'freelancer'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      console.log('Register attempt:', formData);
      const result = await register(formData);
      console.log('Registration successful:', result);
      setSuccess('✅ Registrierung erfolgreich! Leite zum Login...');
      setTimeout(() => navigate('/jobs'), 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || err || 'Registrierung fehlgeschlagen');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Registrierung</h2>
        {error && <p style={styles.error}>❌ {error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        
        <select
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="freelancer">Freelancer</option>
          <option value="client">Unternehmen/Auftraggeber</option>
        </select>
        
        <input
          type="text"
          name="firstName"
          placeholder="Vorname"
          value={formData.firstName}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <input
          type="text"
          name="lastName"
          placeholder="Nachname"
          value={formData.lastName}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <input
          type="password"
          name="password"
          placeholder="Passwort"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Wird geladen...' : 'Registrieren'}
        </button>
        
        <p style={styles.link}>
          Hast du schon einen Account? <a href="/login" style={{ color: '#ff6b6b', textDecoration: 'none' }}>Hier anmelden</a>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    backgroundColor: '#f5f5f5'
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0 1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0 1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginBottom: '1rem'
  },
  success: {
    color: 'green',
    marginBottom: '1rem',
    fontWeight: 'bold'
  },
  link: {
    textAlign: 'center',
    marginTop: '1rem',
    fontSize: '0.9rem'
  }
};

export default RegisterPage;
