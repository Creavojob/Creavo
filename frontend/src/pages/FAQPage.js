import React, { useState } from 'react';

const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      category: 'Allgemein',
      items: [
        {
          q: 'Was ist Creavo?',
          a: 'Creavo ist eine spezialisierte Jobbörse für die Medienbranche. Unternehmen posten Projekte, Freelancer bewerben sich, und beide arbeiten sicher über unsere Plattform zusammen.'
        },
        {
          q: 'Ist Creavo kostenlos?',
          a: 'Die Registrierung ist kostenlos. Creavo erhebt eine kleine Gebühr von 5% auf abgeschlossene Projekte.'
        },
        {
          q: 'Für wen ist Creavo geeignet?',
          a: 'Für Unternehmen und Agenturen der Medienbranche, die Freelancer für Projekte benötigen, und für Freelancer, die in der Medienbranche arbeiten (Kamera, Schnitt, Audio, VFX, Animation, Grafik, etc.).'
        }
      ]
    },
    {
      category: 'Für Auftraggeber',
      items: [
        {
          q: 'Wie poste ich einen Job?',
          a: 'Melde dich als Auftraggeber an, klicke auf "Job posten", fülle die Details aus (Titel, Beschreibung, Budget, Deadline) und veröffentliche den Job. Freelancer können sich dann bewerben.'
        },
        {
          q: 'Was passiert mit meinem Geld?',
          a: 'Dein Geld wird bei PayPal hinterlegt, sobald du einen Freelancer akzeptierst. Es wird erst freigegeben, wenn das Projekt erfolgreich abgeschlossen ist und du deine Genehmigung gibst.'
        },
        {
          q: 'Kann ich einen Job löschen?',
          a: 'Ja, solange keine Bewerbungen eingegangen sind. Nachdem Bewerbungen eingegangen sind, kannst du einen Job noch ändern, aber nicht löschen.'
        },
        {
          q: 'Wie wähle ich den richtigen Freelancer?',
          a: 'Schau dir die Profile, Bewertungen und Portfolios der Bewerber an. Du kannst mit ihnen chatten, um Fragen zu stellen, bevor du dich entscheidest.'
        }
      ]
    },
    {
      category: 'Für Freelancer',
      items: [
        {
          q: 'Wie bewerbe ich mich auf einen Job?',
          a: 'Schau dir die offenen Jobs an, klicke auf einen Job, den du interessant findest, und drücke "Bewerben". Schreib eine kurze Nachricht, warum du der beste für das Projekt bist.'
        },
        {
          q: 'Wie viel verdiene ich?',
          a: 'Du verdienst das, was der Auftraggeber bietet, minus 5% Creavo-Gebühr. Wenn ein Job 1.000€ kostet, verdienst du 950€.'
        },
        {
          q: 'Wann bekomme ich mein Geld?',
          a: 'Nach Abschluss des Projekts überprüft der Auftraggeber deine Arbeit. Wenn alles passt, genehmigt er die Zahlung und dein Geld wird ausgezahlt.'
        },
        {
          q: 'Kann ich mehrere Jobs gleichzeitig machen?',
          a: 'Ja, solange du den Auftraggeber informierst und alle Deadlines einhältst. Achte darauf, nicht überlastet zu werden.'
        },
        {
          q: 'Was wenn der Auftraggeber nicht zufrieden ist?',
          a: 'Ihr könnt gemeinsam über die Plattform chatten und Änderungen vornehmen. Bei größeren Problemen können beide Parteien einen Streit einreichen, den wir überprüfen.'
        }
      ]
    },
    {
      category: 'Zahlungen & Sicherheit',
      items: [
        {
          q: 'Ist mein Geld sicher auf Creavo?',
          a: 'Ja. Wir nutzen PayPal Escrow, eine Bankdienst der Branche für sichere Zahlungen. Dein Geld ist geschützt bis zum Abschluss des Projekts.'
        },
        {
          q: 'Welche Zahlungsmethoden werden akzeptiert?',
          a: 'Derzeit akzeptieren wir PayPal. In Zukunft planen wir auch Kreditkarten und Banküberweisung.'
        },
        {
          q: 'Kann ich meine Zahlung rückgängig machen?',
          a: 'Nein, sobald eine Zahlung bestätigt ist, kann sie nicht rückgängig gemacht werden. Bei echten Betrugsfällen können wir intervenieren.'
        },
        {
          q: 'Wie lange dauert die Auszahlung?',
          a: 'PayPal-Auszahlungen dauern normalerweise 1-3 Geschäftstage.'
        }
      ]
    },
    {
      category: 'Bewertungen & Reputation',
      items: [
        {
          q: 'Wie funktionieren Bewertungen?',
          a: 'Nach Projektabschluss können beide Seiten sich gegenseitig bewerten (1-5 Sterne) und Feedback geben. Diese Bewertungen helfen anderen, bessere Entscheidungen zu treffen.'
        },
        {
          q: 'Was wenn ich mit einer Bewertung nicht einverstanden bin?',
          a: 'Du kannst auf Bewertungen antworten. Wiederholte unfaire Bewertungen können zu Kontoperrung führen.'
        },
        {
          q: 'Kann eine schlechte Bewertung mein Konto sperren?',
          a: 'Nein. Eine einzelne schlechte Bewertung ist normal. Erst bei mehreren Beschwerden oder Verstößen sperren wir Konten.'
        }
      ]
    },
    {
      category: 'Technischer Support',
      items: [
        {
          q: 'Ich habe ein technisches Problem. Was soll ich tun?',
          a: 'Schreib uns unter info@creavo.de mit Details zum Problem. Unser Support-Team hilft dir schnellstmöglich weiter.'
        },
        {
          q: 'Funktioniert Creavo auf dem Handy?',
          a: 'Ja, unsere Website ist responsive und funktioniert auf allen Geräten. Eine native App ist in Planung.'
        },
        {
          q: 'Warum kann ich mich nicht einloggen?',
          a: 'Überprüfe dein Passwort. Falls du es vergessen hast, nutze "Passwort zurücksetzen". Wenn das nicht hilft, kontaktiere Support.'
        }
      ]
    }
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>❓ Häufig gestellte Fragen (FAQ)</h1>
          <p style={styles.subtitle}>
            Hier findest du Antworten auf die häufigsten Fragen. Wenn du etwas nicht findest, 
            kontaktiere uns unter info@creavo.de
          </p>
        </div>
      </div>
      
      <div style={styles.content}>
        {faqs.map((section, sectionIdx) => (
          <section key={sectionIdx} style={styles.section}>
            <h2 style={styles.sectionTitle}>{section.category}</h2>
            
            {section.items.map((item, itemIdx) => {
              const faqId = `${sectionIdx}-${itemIdx}`;
              const isOpen = openFAQ === faqId;
              
              return (
                <div key={faqId} style={styles.faqItem}>
                  <button
                    onClick={() => toggleFAQ(faqId)}
                    style={{
                      ...styles.question,
                      backgroundColor: isOpen ? '#1a3a1a' : '#1a1a1a'
                    }}
                  >
                    <span style={styles.questionText}>{item.q}</span>
                    <span style={styles.arrow}>{isOpen ? '▼' : '▶'}</span>
                  </button>
                  
                  {isOpen && (
                    <div style={styles.answer}>
                      <p style={styles.answerText}>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}

        <section style={styles.contactSection}>
          <h2 style={styles.sectionTitle}>Frage nicht beantwortet?</h2>
          <p style={styles.contactText}>
            Wir helfen gerne! Schreib uns unter <strong>info@creavo.de</strong> oder nutze unser Kontaktformular.
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
    marginBottom: '1rem',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#ccc',
    textAlign: 'center',
    marginBottom: '0',
    lineHeight: '1.6',
    opacity: 0.9
  },
  section: {
    marginBottom: '3rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#00a8ff',
    marginBottom: '1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '2px solid #00a8ff',
    textAlign: 'center'
  },
  faqItem: {
    marginBottom: '1rem'
  },
  question: {
    width: '100%',
    padding: '1rem 1.5rem',
    backgroundColor: '#1a1a1a',
    border: '2px solid #333',
    borderRadius: '12px',
    color: '#00a8ff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s',
    textAlign: 'left'
  },
  questionText: {
    flex: 1
  },
  arrow: {
    marginLeft: '1rem',
    fontSize: '0.8rem'
  },
  answer: {
    padding: '1rem 1.5rem',
    backgroundColor: '#0a1a2a',
    border: '2px solid #00a8ff',
    borderTop: 'none',
    borderRadius: '0 0 12px 12px'
  },
  answerText: {
    color: '#aaa',
    lineHeight: '1.7',
    fontSize: '0.95rem',
    margin: 0
  },
  contactSection: {
    marginTop: '3rem',
    padding: '2rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    border: '2px solid #00a8ff',
    textAlign: 'center'
  },
  contactText: {
    color: '#aaa',
    fontSize: '1rem',
    lineHeight: '1.6'
  }
};

export default FAQPage;
