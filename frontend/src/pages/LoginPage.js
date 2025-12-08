import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      console.log('Login attempt with:', { email, password });
      const result = await login({ email, password });
      console.log('Login successful:', result);
      setSuccess('✅ Login erfolgreich! Leite weiter...');
      setTimeout(() => navigate('/jobs'), 1500);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || err || 'Login fehlgeschlagen');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Anmelden</h2>
        {error && <p style={styles.error}>❌ {error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Wird geladen...' : 'Anmelden'}
        </button>
        
        <p style={styles.link}>
          Noch kein Account? <a href="/register" style={{ color: '#ff6b6b', textDecoration: 'none' }}>Hier registrieren</a>
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

export default LoginPage;
