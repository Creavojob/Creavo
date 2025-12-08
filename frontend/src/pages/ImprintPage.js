import React from 'react';

const ImprintPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>📋 Impressum</h1>
        </div>
      </div>
      
      <div style={styles.content}>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Angaben gem. § 5 TMG</h2>
          
          <div style={styles.infoBlock}>
            <h3 style={styles.heading}>Betreiber der Website:</h3>
            <p style={styles.text}>
              Creavo – Jobbörse für die Medienbranche<br/>
              <br/>
              <strong>Vertreter:</strong><br/>
              Mario da Silva<br/>
              <br/>
              <strong>Adresse:</strong><br/>
              [Adresse eintragen]<br/>
              Deutschland<br/>
              <br/>
              <strong>Kontakt:</strong><br/>
              E-Mail: <a href="mailto:info@creavo.de" style={styles.link}>info@creavo.de</a><br/>
              Telefon: [Telefonnummer eintragen]
            </p>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Umsatzsteuer-Identifikationsnummer</h2>
          <p style={styles.text}>
            Gem. § 27a Umsatzsteuergesetz (UStG): [USt-ID eintragen]
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p style={styles.text}>
            Mario da Silva<br/>
            [Adresse eintragen]<br/>
            Deutschland
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Haftung für Inhalte</h2>
          <p style={styles.text}>
            Die Inhalte unserer Seiten wurden mit großer Sorgfalt erstellt. Für die Richtigkeit, 
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 des TMG sind wir als 
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
            Tätigkeit hinweisen.<br/>
            <br/>
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen bleiben 
            hiervon unberührt und gelten ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Haftung für Links</h2>
          <p style={styles.text}>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber 
            der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung 
            auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der 
            Verlinkung nicht erkennbar.<br/>
            <br/>
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete 
            Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverstößen 
            werden wir derartige Links umgehend entfernen.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Urheberrecht</h2>
          <p style={styles.text}>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
            Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite 
            sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.<br/>
            <br/>
            Soweit die Inhalte auf dieser Seite nicht von uns erstellt wurden, werden die 
            Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche 
            gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam 
            werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von 
            Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Datenschutz</h2>
          <p style={styles.text}>
            Die Nutzung unserer Website ist in der Regel ohne Angabe von personenbezogenen Daten möglich. 
            Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder 
            E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis.<br/>
            <br/>
            Für detaillierte Informationen zur Verarbeitung von Daten verweisen wir auf unsere 
            <a href="#privacy" style={styles.link}> Datenschutzerklärung</a>.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Streitbeilegung</h2>
          <p style={styles.text}>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
            <a href="https://ec.europa.eu/consumers/odr" style={styles.link}> https://ec.europa.eu/consumers/odr</a>.<br/>
            <br/>
            Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir nehmen an einem 
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Haftungsausschluss</h2>
          <p style={styles.text}>
            Creavo wird unter dem Prinzip „as is" ohne jegliche Gewährleistungen angeboten. 
            Wir übernehmen keine Haftung für Datenverl­uste, entgangene Gewinne oder sonstige indirekte, 
            zufällige oder Folgeschäden, die durch die Nutzung unserer Plattform entstehen, 
            auch wenn wir auf die Möglichkeit solcher Schäden hingewiesen wurde.<br/>
            <br/>
            Die Nutzung der Plattform erfolgt auf eigenes Risiko. Creavo behält sich das Recht vor, 
            die Plattform jederzeit zu ändern, zu unterbrechen oder zu beenden.
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
    marginTop: '1rem',
    textAlign: 'center'
  },
  heading: {
    fontSize: '1.1rem',
    color: '#00a8ff',
    marginBottom: '0.5rem',
    fontWeight: '600',
    textAlign: 'center'
  },
  infoBlock: {
    backgroundColor: '#1a1a1a',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '2px solid #333'
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: '1.7',
    color: '#aaa',
    marginBottom: '0.5rem'
  },
  link: {
    color: '#00a8ff',
    textDecoration: 'none',
    borderBottom: '1px solid #00a8ff',
    cursor: 'pointer'
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

export default ImprintPage;
