import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <nav style={styles.nav}>
      <h1 style={{...styles.logo, cursor: 'pointer'}} onClick={() => navigate('/')}>🎬 Creavo</h1>
      
      <div style={styles.links}>
        {isAuthenticated ? (
          <>
            <span 
              style={{...styles.user, cursor: 'pointer'}}
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setMenuOpen(false);
              }}
              title="Profil-Menü"
            >
              👤 {user?.firstName} ({user?.isAdmin ? 'Admin' : user?.userType}) ▼
            </span>
          </>
        ) : (
          <button onClick={() => navigate('/auth')} style={styles.button}>Anmelden / Registrieren</button>
        )}
        
        <button 
          onClick={() => {
            setMenuOpen(!menuOpen);
            setUserMenuOpen(false);
          }}
          style={styles.hamburger}
          title="Menü"
        >
          ☰
        </button>
      </div>

      {/* User Dropdown Menu */}
      {userMenuOpen && isAuthenticated && (
        <div style={{...styles.dropdown, right: '60px'}}>
          {user?.userType === 'freelancer' ? (
            <a 
              onClick={(e) => {
                e.preventDefault();
                navigate('/requests');
                setUserMenuOpen(false);
              }} 
              style={styles.dropdownLink}
            >
              📋 Anfragen
            </a>
          ) : (
            <a 
              onClick={(e) => {
                e.preventDefault();
                navigate('/applications');
                setUserMenuOpen(false);
              }} 
              style={styles.dropdownLink}
            >
              📝 Bewerbungen
            </a>
          )}
          <a 
            onClick={(e) => {
              e.preventDefault();
              navigate('/messages');
              setUserMenuOpen(false);
            }} 
            style={styles.dropdownLink}
          >
            💬 Nachrichten
          </a>
          <a 
            onClick={(e) => {
              e.preventDefault();
              navigate('/chat');
              setUserMenuOpen(false);
            }} 
            style={styles.dropdownLink}
          >
            🔒 E2E Chat
          </a>
          {user?.isAdmin && (
            <a 
              onClick={(e) => {
                e.preventDefault();
                navigate('/admin');
                setUserMenuOpen(false);
              }} 
              style={{...styles.dropdownLink, color: '#ef4444', fontWeight: 'bold'}}
            >
              🔐 Admin Dashboard
            </a>
          )}
          <a 
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }} 
            style={{...styles.dropdownLink, color: '#ef4444', borderTop: '1px solid #444'}}
          >
            🚪 Abmelden
          </a>
        </div>
      )}

      {/* Hamburger Dropdown Menu */}
      {menuOpen && (
        <div style={styles.dropdown}>
          <button
            onClick={() => {
              navigate('/concept');
              setMenuOpen(false);
            }}
            style={styles.dropdownLink}
          >
            Konzept
          </button>
          <button
            onClick={() => {
              navigate('/about');
              setMenuOpen(false);
            }}
            style={styles.dropdownLink}
          >
            Über uns
          </button>
          <button
            onClick={() => {
              navigate('/contact');
              setMenuOpen(false);
            }}
            style={styles.dropdownLink}
          >
            Kontakt
          </button>
          <button
            onClick={() => {
              navigate('/faq');
              setMenuOpen(false);
            }}
            style={styles.dropdownLink}
          >
            FAQ
          </button>
          <button
            onClick={() => {
              navigate('/privacy');
              setMenuOpen(false);
            }}
            style={styles.dropdownLink}
          >
            Datenschutz
          </button>
          <button
            onClick={() => {
              navigate('/terms');
              setMenuOpen(false);
            }}
            style={styles.dropdownLink}
          >
            Nutzungsbedingungen
          </button>
          <button
            onClick={() => {
              navigate('/imprint');
              setMenuOpen(false);
            }}
            style={styles.dropdownLink}
          >
            Impressum
          </button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#0f0f0f',
    color: '#e0e0e0',
    boxShadow: '0 2px 8px rgba(0,168,255,0.15)',
    borderBottom: '2px solid #333',
    position: 'relative'
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#ffffff',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  user: {
    marginRight: '0.5rem',
    fontSize: '0.9rem',
    color: '#00a8ff',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  button: {
    padding: '0.5rem 1.2rem',
    backgroundColor: '#00a8ff',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,168,255,0.2)'
  },
  smallButton: {
    padding: '0.4rem 0.75rem',
    backgroundColor: '#10b981',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.85rem',
    marginRight: '0.5rem',
    transition: 'all 0.2s'
  },
  blueButton: {
    padding: '0.4rem 0.75rem',
    backgroundColor: '#00a8ff',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.85rem',
    marginRight: '0.5rem',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,168,255,0.2)'
  },
  hamburger: {
    padding: '0.5rem 0.75rem',
    backgroundColor: 'transparent',
    border: '2px solid #333',
    color: '#00a8ff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#1a1a1a',
    border: '2px solid #333',
    borderTop: 'none',
    borderRadius: '0 0 12px 12px',
    minWidth: '250px',
    zIndex: 100,
    boxShadow: '0 8px 20px rgba(0,0,0,0.5)'
  },
  dropdownLink: {
    display: 'block',
    padding: '0.85rem 1.5rem',
    color: '#00a8ff',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.95rem',
    borderBottom: '1px solid #333',
    fontWeight: '500'
  }
};

export default Navigation;
