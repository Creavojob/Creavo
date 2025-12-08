import React from 'react';

const PrivacyPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>🔒 Datenschutzerklärung</h1>
        </div>
      </div>
      
      <div style={styles.content}>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Datenschutz auf einen Blick</h2>
          <p style={styles.text}>
            Creavo nimmt den Schutz deiner persönlichen Daten sehr ernst. Diese Datenschutzerklärung 
            erklärt, welche Daten wir sammeln, wie wir sie verwenden und welche Rechte du hast.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Verantwortlicher</h2>
          <p style={styles.text}>
            Verantwortlich für die Datenverarbeitung auf dieser Website:<br/>
            Creavo<br/>
            E-Mail: info@creavo.de
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Erfassung von Daten</h2>
          
          <h3 style={styles.subTitle}>3.1 Registrierung und Kontoinformationen</h3>
          <p style={styles.text}>
            Bei der Registrierung erfassen wir: Vorname, Nachname, E-Mail-Adresse, Passwort 
            (verschlüsselt), Berufsfeld und ob du als Auftraggeber oder Freelancer tätig bist.
          </p>

          <h3 style={styles.subTitle}>3.2 Zahlungsinformationen</h3>
          <p style={styles.text}>
            PayPal-Daten werden direkt an PayPal übertragen. Creavo speichert keine vollständigen 
            Kreditkartennummern oder PayPal-Anmeldedaten.
          </p>

          <h3 style={styles.subTitle}>3.3 Kommunikationsdaten</h3>
          <p style={styles.text}>
            Nachrichten zwischen Nutzern werden auf unseren Servern gespeichert, um die Plattform-Funktionalität zu ermöglichen.
          </p>

          <h3 style={styles.subTitle}>3.4 Automatisch erfasste Daten</h3>
          <p style={styles.text}>
            IP-Adresse, Browser-Typ, Betriebssystem, Verweilzeiten und Zugriffsmuster werden 
            automatisch erfasst zur Sicherheit und Optimierung.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Verwendung deiner Daten</h2>
          <ul style={styles.list}>
            <li>Kontoerstellung und Verwaltung</li>
            <li>Verarbeitung von Transaktionen und Zahlungen</li>
            <li>Bereitstellung von Messaging und Kommunikation</li>
            <li>Sicherheit und Missbrauchsprävention</li>
            <li>Verbesserung unserer Services</li>
            <li>Rechtliche und behördliche Verpflichtungen</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Deine Rechte</h2>
          <p style={styles.text}>
            Du hast das Recht auf:
          </p>
          <ul style={styles.list}>
            <li><strong>Auskunft:</strong> Erfrage, welche Daten wir über dich haben</li>
            <li><strong>Berichtigung:</strong> Korrigiere unrichtige Daten</li>
            <li><strong>Löschung:</strong> Fordere Löschung deiner Daten an (Recht auf Vergessenwerden)</li>
            <li><strong>Einschränkung:</strong> Bitte um Einschränkung der Verarbeitung</li>
            <li><strong>Datenportabilität:</strong> Erhalte deine Daten in strukturierter Form</li>
            <li><strong>Widerspruch:</strong> Widerspreche der Verarbeitung deiner Daten</li>
          </ul>
          <p style={styles.text}>
            Schreib uns unter info@creavo.de, um diese Rechte auszuüben.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Cookies</h2>
          <p style={styles.text}>
            Creavo verwendet Cookies zur Authentifizierung und Sitzungsverwaltung. 
            Du kannst Cookies in deinem Browser deaktivieren, aber dies kann die Funktionalität beeinträchtigen.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Datensicherheit</h2>
          <p style={styles.text}>
            Wir verwenden Verschlüsselung (SSL/TLS), sichere Passwort-Hashing-Verfahren und 
            regelmäßige Sicherheitsaudits. Keine Plattform ist jedoch zu 100% sicher.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Kontakt zum Datenschutzbeauftragten</h2>
          <p style={styles.text}>
            Bei Fragen zum Datenschutz kontaktiere uns unter: info@creavo.de
          </p>
        </section>

        <div style={styles.lastUpdate}>
          <p style={styles.smallText}>
            Zuletzt aktualisiert: Dezember 2025
          </p>
        </div>
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
    maxWidth: '900px',
    margin: '0 auto'
  },
  content: {
    maxWidth: '900px',
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
    marginBottom: '2.5rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #333'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#00a8ff',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  subTitle: {
    fontSize: '1.1rem',
    color: '#00a8ff',
    marginBottom: '0.5rem',
    marginTop: '1rem',
    fontWeight: '600',
    textAlign: 'center'
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: '1.7',
    color: '#aaa',
    marginBottom: '0.5rem',
    textAlign: 'center'
  },
  list: {
    paddingLeft: '2rem',
    color: '#aaa'
  },
  lastUpdate: {
    textAlign: 'center',
    paddingTop: '2rem',
    borderTop: '1px solid #333'
  },
  smallText: {
    fontSize: '0.85rem',
    color: '#666'
  }
};

export default PrivacyPage;
