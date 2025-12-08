import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState('freelancer');
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadedPortfolioUrl, setUploadedPortfolioUrl] = useState('');
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState('');
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Email und Passwort erforderlich');
      return;
    }

    try {
      await login({ email, password });
      setSuccess('✅ Erfolgreich angemeldet!');
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      console.error('Login error:', err);
      // err ist jetzt ein String von AuthContext, kein Error-Objekt
      const errorMsg = typeof err === 'string' ? err : (err.response?.data?.error || err.message || 'Login fehlgeschlagen');
      setError(errorMsg);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || !firstName || !lastName) {
      setError('Alle Felder erforderlich');
      return;
    }

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        userType,
        portfolio: uploadedPortfolioUrl,
        resume: uploadedResumeUrl
      });
      setSuccess('✅ Registrierung erfolgreich!');
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message || err || 'Registrierung fehlgeschlagen');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.tabs}>
          <button
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            style={{...styles.tab, borderBottom: isLogin ? '3px solid #ff6b6b' : 'none'}}
          >
            Anmelden
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            style={{...styles.tab, borderBottom: !isLogin ? '3px solid #ff6b6b' : 'none'}}
          >
            Registrieren
          </button>
        </div>

        {error && <div style={styles.error}>❌ {error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {isLogin ? (
          <form onSubmit={handleLogin} style={styles.form}>
            <h2>Anmelden</h2>
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.passwordInput}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                title={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                  {showPassword && <line x1="1" y1="1" x2="23" y2="23"></line>}
                </svg>
              </button>
            </div>
            
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Wird angemeldet...' : 'Anmelden'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={styles.form}>
            <h2>Neuen Account erstellen</h2>
            
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="userType"
                  value="freelancer"
                  checked={userType === 'freelancer'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                👤 Freelancer
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="userType"
                  value="client"
                  checked={userType === 'client'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                🏢 Unternehmen / Auftraggeber
              </label>
            </div>
            
            <input
              type="text"
              placeholder="Vorname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={styles.input}
            />
            
            <input
              type="text"
              placeholder="Nachname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={styles.input}
            />
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Passwort (mindestens 6 Zeichen)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                style={styles.passwordInput}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                title={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                  {showPassword && <line x1="1" y1="1" x2="23" y2="23"></line>}
                </svg>
              </button>
            </div>
            {userType === 'freelancer' && (
              <>
                <label style={{ color: '#aaa', fontSize: '0.85rem' }}>Portfolio hochladen (nur PDF, optional)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={async (e) => {
                    const f = e.target.files[0] || null;
                    setPortfolioFile(f);
                    if (!f) return;
                    setUploadingPortfolio(true);
                    try {
                      const fd = new FormData();
                      fd.append('file', f);
                      const res = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                      setUploadedPortfolioUrl(res.data.url);
                    } catch (err) {
                      console.error('Upload portfolio failed', err);
                      alert('Portfolio Upload fehlgeschlagen');
                    } finally {
                      setUploadingPortfolio(false);
                    }
                  }}
                  style={styles.input}
                />
                {uploadingPortfolio && <div style={{ color: '#aaa' }}>Upload läuft…</div>}
                {uploadedPortfolioUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <a href={uploadedPortfolioUrl} target="_blank" rel="noreferrer" style={{ color: '#00ff00' }}>Portfolio ansehen</a>
                    <button type="button" onClick={() => { setUploadedPortfolioUrl(''); setPortfolioFile(null); }} style={{ marginLeft: '0.5rem' }}>Entfernen</button>
                  </div>
                )}

                <label style={{ color: '#aaa', fontSize: '0.85rem' }}>Lebenslauf / CV hochladen (nur PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={async (e) => {
                    const f = e.target.files[0] || null;
                    setResumeFile(f);
                    if (!f) return;
                    setUploadingResume(true);
                    try {
                      const fd = new FormData();
                      fd.append('file', f);
                      const res = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                      setUploadedResumeUrl(res.data.url);
                    } catch (err) {
                      console.error('Upload resume failed', err);
                      alert('Lebenslauf Upload fehlgeschlagen');
                    } finally {
                      setUploadingResume(false);
                    }
                  }}
                  style={styles.input}
                />
                {uploadingResume && <div style={{ color: '#aaa' }}>Upload läuft…</div>}
                {uploadedResumeUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <a href={uploadedResumeUrl} target="_blank" rel="noreferrer" style={{ color: '#00ff00' }}>Lebenslauf ansehen</a>
                    <button type="button" onClick={() => { setUploadedResumeUrl(''); setResumeFile(null); }} style={{ marginLeft: '0.5rem' }}>Entfernen</button>
                  </div>
                )}
              </>
            )}
            
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Wird registriert...' : 'Registrieren'}
            </button>
          </form>
        )}

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Oder <a href="/" style={styles.link}>zurück zur Startseite</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    backgroundColor: '#0f0f0f',
    padding: '2rem'
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,168,255,0.2)',
    width: '100%',
    maxWidth: '450px',
    overflow: 'hidden',
    border: '2px solid #333'
  },
  tabs: {
    display: 'flex',
    borderBottom: '2px solid #333'
  },
  tab: {
    flex: 1,
    padding: '1rem',
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: '#00a8ff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  form: {
    padding: '2rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    margin: '0.75rem 0',
    border: '1px solid #333',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0'
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
    margin: '0.75rem 0'
  },
  passwordInput: {
    width: '100%',
    padding: '0.75rem',
    paddingRight: '3rem',
    border: '1px solid #333',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0'
  },
  eyeButton: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
    opacity: 0.7
  },
  radioGroup: {
    margin: '1rem 0',
    padding: '1rem',
    backgroundColor: '#0f0f0f',
    borderRadius: '4px',
    border: '1px solid #333'
  },
  radioLabel: {
    display: 'block',
    margin: '0.5rem 0',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '#aaa'
  },
  submitBtn: {
    width: '100%',
    padding: '0.75rem',
    marginTop: '1rem',
    backgroundColor: '#00a8ff',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(0,168,255,0.3)'
  },
  error: {
    margin: '1rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(239,68,68,0.1)',
    color: '#ef4444',
    borderRadius: '6px',
    fontSize: '0.9rem',
    border: '2px solid #ef4444'
  },
  success: {
    margin: '1rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(16,185,129,0.1)',
    color: '#10b981',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: '2px solid #10b981'
  },
  footer: {
    padding: '1rem',
    textAlign: 'center',
    backgroundColor: '#0f0f0f',
    borderTop: '1px solid #333'
  },
  footerText: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#666'
  },
  link: {
    color: '#00a8ff',
    textDecoration: 'none',
    fontWeight: '600'
  }
};

export default AuthPage;
