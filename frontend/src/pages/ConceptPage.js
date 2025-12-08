import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConceptPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>🎬 Willkommen bei Creavo</h1>
          <p style={styles.subtitle}>Die Jobbörse für Kreative der Medienbranche</p>
        </div>
      </div>
      
      <div style={styles.content}>
        <div style={styles.conceptSection}>
          <h2 style={styles.sectionTitle}>Das Konzept</h2>
          <p style={styles.description}>
            Creavo verbindet Auftraggeber und Freelancer aus der Medienbranche. 
            Unternehmen posten Jobs, Freelancer bewerben sich, und der Auftraggeber wählt den besten aus.
            Kein direktes Buchen - vollständige Kontrolle über den Auswahlprozess!
          </p>

          <div style={styles.features}>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>💼</div>
              <h3 style={styles.featureTitle}>Für Auftraggeber</h3>
              <p style={styles.featureText}>
                Poste deine Projekte, finde qualifizierte Freelancer und bezahle sicher 
                über unser Escrow-System.
              </p>
            </div>

            <div style={styles.feature}>
              <div style={styles.featureIcon}>⭐</div>
              <h3 style={styles.featureTitle}>Für Freelancer</h3>
              <p style={styles.featureText}>
                Entdecke spannende Projekte, bewirb dich und verdiene sicheres Geld. 
                Deine Zahlung ist geschützt.
              </p>
            </div>

            <div style={styles.feature}>
              <div style={styles.featureIcon}>🔒</div>
              <h3 style={styles.featureTitle}>Sichere Zahlungen</h3>
              <p style={styles.featureText}>
                Mit unserem PayPal Escrow-System ist Geld geschützt bis das Projekt 
                erfolgreich abgeschlossen ist.
              </p>
            </div>
          </div>
        </div>

        <div style={styles.howItWorks}>
          <h2 style={styles.sectionTitle}>Wie es funktioniert</h2>
          
          <div style={styles.steps}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <h3>Registrieren</h3>
              <p>Melde dich als Auftraggeber oder Freelancer an</p>
            </div>

            <div style={styles.arrow}>→</div>

            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <h3>Job Posten / Bewerben</h3>
              <p>Poste ein Projekt oder bewirb dich auf Jobs</p>
            </div>

            <div style={styles.arrow}>→</div>

            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <h3>Bestätigung & Zahlung</h3>
              <p>Unternehmen zahlt, Geld wird sicher verwahrt</p>
            </div>

            <div style={styles.arrow}>→</div>

            <div style={styles.step}>
              <div style={styles.stepNumber}>4</div>
              <h3>Projekt läuft</h3>
              <p>Beide arbeiten zusammen bis fertig</p>
            </div>

            <div style={styles.arrow}>→</div>

            <div style={styles.step}>
              <div style={styles.stepNumber}>5</div>
              <h3>Abschluss</h3>
              <p>Beide bestätigen Fertigstellung</p>
            </div>
          </div>
        </div>

        <div style={styles.cta}>
          <button 
            onClick={() => navigate('/home')}
            style={styles.ctaButton}
          >
            Zu den Jobs →
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0f0f0f',
    color: '#e0e0e0',
    minHeight: 'calc(100vh - 70px)'
  },
  hero: {
    backgroundColor: 'transparent',
    background: 'linear-gradient(135deg, rgba(0,168,255,0.1) 0%, rgba(16,185,129,0.05) 100%)',
    color: '#ffffff',
    padding: '4rem 2rem',
    textAlign: 'center',
    borderBottom: '1px solid #333'
  },
  heroContent: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '3rem 2rem'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#ffffff'
  },
  subtitle: {
    fontSize: '1.3rem',
    textAlign: 'center',
    marginBottom: '0',
    color: '#ccc',
    opacity: 0.9
  },
  conceptSection: {
    marginBottom: '3rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    color: '#00a8ff',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#cccccc'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  },
  feature: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '12px',
    border: '2px solid #333',
    textAlign: 'center',
    transition: 'all 0.3s'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  featureTitle: {
    fontSize: '1.3rem',
    color: '#00a8ff',
    marginBottom: '0.5rem',
    fontWeight: 'bold'
  },
  featureText: {
    fontSize: '0.95rem',
    lineHeight: '1.5',
    color: '#aaaaaa'
  },
  howItWorks: {
    marginTop: '4rem'
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '2rem'
  },
  step: {
    flex: '1',
    minWidth: '150px',
    backgroundColor: '#1a1a1a',
    padding: '2rem 1.5rem',
    borderRadius: '12px',
    border: '2px solid #333',
    textAlign: 'center'
  },
  stepNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#00a8ff',
    marginBottom: '0.5rem'
  },
  arrow: {
    fontSize: '2rem',
    color: '#10b981',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  cta: {
    textAlign: 'center',
    marginTop: '3rem'
  },
  ctaButton: {
    padding: '0.85rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#00a8ff',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(0,168,255,0.3)'
  }
};

export default ConceptPage;
