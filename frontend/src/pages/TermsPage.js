import React from 'react';

const TermsPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>📜 Nutzungsbedingungen</h1>
        </div>
      </div>
      
      <div style={styles.content}>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Allgemeine Bedingungen</h2>
          <p style={styles.text}>
            Durch die Nutzung von Creavo akzeptierst du diese Nutzungsbedingungen. Creavo behält sich 
            das Recht vor, diese jederzeit zu ändern. Die Fortnutzung nach Änderungen bedeutet Akzeptanz.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Benutzerkonten</h2>
          <p style={styles.text}>
            Du bist verantwortlich für dein Passwort und alle Aktivitäten unter deinem Konto. 
            Du darfst keine falschen Informationen angeben und musst dein Profil aktuell halten.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Verbotene Aktivitäten</h2>
          <p style={styles.text}>
            Du darfst Creavo nicht für folgende Zwecke nutzen:
          </p>
          <ul style={styles.list}>
            <li>Illegale oder unethische Aktivitäten</li>
            <li>Betrug, Scam oder Täuschung anderer Nutzer</li>
            <li>Belästigung, Hass oder Diskriminierung</li>
            <li>Nacktheit, sexuelle Inhalte oder Ausbeutung</li>
            <li>Spamming, Phishing oder Malware</li>
            <li>Verletzung von Rechten anderer (Urheberrecht, Datenschutz)</li>
            <li>Datenklau oder Hacking</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Inhalte und Verantwortung</h2>
          <p style={styles.text}>
            Du bleibst vollständig verantwortlich für alle Inhalte, die du auf Creavo postest 
            (Jobs, Bewerbungen, Nachrichten, Dateien). Du garantierst, dass du alle erforderlichen Rechte hast.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Zahlungen und Escrow</h2>
          <p style={styles.text}>
            Creavo nutzt ein PayPal Escrow-System:
          </p>
          <ul style={styles.list}>
            <li>Der Auftraggeber zahlt die vereinbarte Summe</li>
            <li>Creavo hält das Geld bis zum Abschluss in Escrow</li>
            <li>Nach Fertigstellung genehmigt der Auftraggeber die Zahlung</li>
            <li>Der Freelancer erhält das Geld minus Creavo-Gebühren</li>
          </ul>
          <p style={styles.text}>
            Zahlungen sind nicht rückgängig zu machen, sobald sie bestätigt sind. 
            Bei Streitigkeiten können beide Parteien Beweis einreichen.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Bewertungen und Feedback</h2>
          <p style={styles.text}>
            Nach Projektabschluss können sich beide Parteien bewerten. Bewertungen müssen ehrlich und sachlich sein. 
            Falsche, beleidigende oder räuberische Bewertungen können zu Kontoperrung führen.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Geistiges Eigentum</h2>
          <p style={styles.text}>
            Der Auftraggeber erhält die Rechte an den erstellten Werken nach Zahlung. 
            Der Freelancer behält das Recht, die Arbeit in seinem Portfolio zu zeigen 
            (sofern nicht vertraglich anders vereinbart).
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Haftungsbeschränkung</h2>
          <p style={styles.text}>
            Creavo wird ohne Gewährleistung bereitgestellt. Wir haften nicht für:
          </p>
          <ul style={styles.list}>
            <li>Datenverluste durch technische Fehler</li>
            <li>Unterbrochene oder verzögerte Services</li>
            <li>Betrug oder Verstoß anderer Nutzer</li>
            <li>Indirekte oder Folgeschäden</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>9. Kontosperrung und Kündigungen</h2>
          <p style={styles.text}>
            Creavo kann dein Konto ohne Vorankündigung sperren, wenn du gegen diese Bedingungen verstößt. 
            Du kannst dein Konto jederzeit löschen, bleibst aber für offene Verpflichtungen haftbar.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>10. Streitbeilegung</h2>
          <p style={styles.text}>
            Streitigkeiten werden zunächst durch Verhandlung gelöst. Falls dies fehlschlägt, 
            können Verbraucher die Verbraucherschlichtungsstelle anrufen.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>11. Kontakt</h2>
          <p style={styles.text}>
            Bei Fragen zu diesen Bedingungen kontaktiere uns unter: info@creavo.de
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

export default TermsPage;
