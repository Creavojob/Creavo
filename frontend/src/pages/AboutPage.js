import React from 'react';

const AboutPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>🎬 Über Creavo</h1>
        </div>
      </div>
      
      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Unsere Mission</h2>
          <p style={styles.text}>
            Creavo verbindet talentierte Freelancer mit innovativen Unternehmen der Medienbranche. 
            Wir schaffen eine Plattform, auf der Kreativität trifft auf Geschäftssinn – sicher, 
            transparent und fair für beide Seiten.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Warum Creavo?</h2>
          <div style={styles.features}>
            <div style={styles.feature}>
              <h3 style={styles.featureTitle}>🔒 Sichere Zahlungen</h3>
              <p style={styles.featureText}>
                Mit unserem PayPal Escrow-System ist dein Geld geschützt, 
                bis das Projekt erfolgreich abgeschlossen ist.
              </p>
            </div>
            <div style={styles.feature}>
              <h3 style={styles.featureTitle}>⭐ Qualitätskontrolle</h3>
              <p style={styles.featureText}>
                Unternehmen wählen die besten Kandidaten, Freelancer zeigen ihre Fähigkeiten. 
                Beide Seiten bewerten sich gegenseitig.
              </p>
            </div>
            <div style={styles.feature}>
              <h3 style={styles.featureTitle}>💬 Transparente Kommunikation</h3>
              <p style={styles.featureText}>
                Direkter Chat zwischen Auftraggeber und Freelancer. 
                Keine versteckten Gebühren, keine Überraschungen.
              </p>
            </div>
            <div style={styles.feature}>
              <h3 style={styles.featureTitle}>🚀 Spezialisiert auf Medien</h3>
              <p style={styles.featureText}>
                Creavo ist nicht für alles. Wir fokussieren uns auf die Medienbranche 
                und verstehen die besonderen Anforderungen.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Wie es funktioniert</h2>
          <ol style={styles.list}>
            <li style={styles.listItem}>
              <strong>Registrieren:</strong> Als Auftraggeber oder Freelancer anmelden
            </li>
            <li style={styles.listItem}>
              <strong>Posten oder Bewerben:</strong> Unternehmen posten Jobs, Freelancer bewerben sich
            </li>
            <li style={styles.listItem}>
              <strong>Auswahl & Zahlung:</strong> Unternehmen wählt Freelancer, zahlt sicher
            </li>
            <li style={styles.listItem}>
              <strong>Zusammenarbeit:</strong> Chat, Datenaustausch und Zusammenarbeit auf Creavo
            </li>
            <li style={styles.listItem}>
              <strong>Abschluss & Bewertung:</strong> Projekt fertig, beide bewerten sich gegenseitig
            </li>
          </ol>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Für wen ist Creavo?</h2>
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🏢 Für Unternehmen & Agenturen</h3>
              <p style={styles.cardText}>
                Finde spezialisierte Freelancer in Kameraarbeit, Schnitt, Motion Graphics, 
                Ton, Grafik und mehr. Bezahle fair und sicher.
              </p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>💼 Für Freelancer</h3>
              <p style={styles.cardText}>
                Zeige deine Fähigkeiten, verdiene zuverlässig und arbeite mit 
                angesehenen Unternehmen der Medienbranche zusammen.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Unsere Werte</h2>
          <div style={styles.values}>
            <div style={styles.value}>
              <span style={styles.valueIcon}>✓</span>
              <div>
                <h4 style={styles.valueTitle}>Fairness</h4>
                <p style={styles.valueText}>Transparente Preise, ehrliche Bewertungen, gerechte Behandlung beider Seiten</p>
              </div>
            </div>
            <div style={styles.value}>
              <span style={styles.valueIcon}>✓</span>
              <div>
                <h4 style={styles.valueTitle}>Sicherheit</h4>
                <p style={styles.valueText}>Deine Daten und dein Geld sind bei uns sicher geschützt</p>
              </div>
            </div>
            <div style={styles.value}>
              <span style={styles.valueIcon}>✓</span>
              <div>
                <h4 style={styles.valueTitle}>Qualität</h4>
                <p style={styles.valueText}>Nur qualifizierte Partner, strenge Standards</p>
              </div>
            </div>
            <div style={styles.value}>
              <span style={styles.valueIcon}>✓</span>
              <div>
                <h4 style={styles.valueTitle}>Innovation</h4>
                <p style={styles.valueText}>Ständig verbessern wir unsere Plattform für dich</p>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.contactSection}>
          <h2 style={styles.sectionTitle}>Fragen?</h2>
          <p style={styles.contactText}>
            Kontaktiere uns unter <strong>info@creavo.de</strong> oder schreib uns über das Kontaktformular.
          </p>
        </section>
      </div>
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
  heroContent: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    color: '#ccc',
    padding: '3rem 2rem'
  },
  title: {
    fontSize: '2.5rem',
    color: '#ffffff',
    marginBottom: '0',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: '3rem',
    paddingBottom: '2rem',
    borderBottom: '2px solid #333'
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#00a8ff',
    marginBottom: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#aaa',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  feature: {
    backgroundColor: '#1a1a1a',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '2px solid #333'
  },
  featureTitle: {
    color: '#00a8ff',
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    fontWeight: '600'
  },
  featureText: {
    color: '#aaa',
    fontSize: '0.95rem',
    lineHeight: '1.5'
  },
  list: {
    paddingLeft: '2rem',
    color: '#aaa'
  },
  listItem: {
    marginBottom: '1rem',
    lineHeight: '1.6',
    fontSize: '1rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '12px',
    border: '2px solid #333'
  },
  cardTitle: {
    color: '#00a8ff',
    fontSize: '1.3rem',
    marginBottom: '1rem',
    fontWeight: 'bold'
  },
  cardText: {
    color: '#aaa',
    lineHeight: '1.6'
  },
  values: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  value: {
    display: 'flex',
    gap: '1rem'
  },
  valueIcon: {
    color: '#00a8ff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    minWidth: '30px'
  },
  valueTitle: {
    color: '#00a8ff',
    marginBottom: '0.5rem',
    fontWeight: '600'
  },
  valueText: {
    color: '#aaa',
    fontSize: '0.95rem',
    lineHeight: '1.5'
  },
  contactSection: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '12px',
    border: '2px solid #00a8ff',
    textAlign: 'center'
  },
  contactText: {
    color: '#aaa',
    fontSize: '1.05rem',
    lineHeight: '1.6'
  }
};

export default AboutPage;
