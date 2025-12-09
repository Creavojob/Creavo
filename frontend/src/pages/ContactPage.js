import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Sende Nachricht an Backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>📧 Kontaktiere uns</h1>
          <p style={styles.subtitle}>
            Wir helfen gerne! Schreib uns eine Nachricht und wir antworten so schnell wie möglich.
          </p>
        </div>
      </div>
      
      <div style={styles.content}>
        <div style={styles.contactGrid}>
          {/* Contact Form */}
          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>Schreib uns eine Nachricht</h2>
            
            {submitted ? (
              <div style={styles.successMessage}>
                ✅ Vielen Dank! Deine Nachricht wurde versendet.<br/>
                <span style={styles.successSmall}>Wir antworten dir in Kürze.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="Dein Name"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>E-Mail *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="deine@email.de"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Betreff *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="Worum geht es?"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Nachricht *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    style={styles.textarea}
                    placeholder="Deine Nachricht..."
                    rows="6"
                  />
                </div>

                <button type="submit" style={styles.submitBtn}>
                  📤 Senden
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div style={styles.infoSection}>
            <h2 style={styles.sectionTitle}>Andere Wege uns zu erreichen</h2>

            <div style={styles.infoBlock}>
              <h3 style={styles.infoTitle}>📧 E-Mail</h3>
              <a href="mailto:info@creavo.de" style={styles.infoLink}>
                info@creavo.de
              </a>
              <p style={styles.infoText}>
                Wir antworten normalerweise innerhalb von 24 Stunden.
              </p>
            </div>

            <div style={styles.infoBlock}>
              <h3 style={styles.infoTitle}>🌐 Social Media</h3>
              <p style={styles.infoText}>
                Folge uns auf Social Media für Updates und News:
              </p>
              <div style={styles.socialLinks}>
                <button style={styles.socialLink} onClick={() => window.open('https://www.linkedin.com/company/creavo', '_blank')}>LinkedIn</button>
                <button style={styles.socialLink} onClick={() => window.open('https://www.instagram.com/creavo', '_blank')}>Instagram</button>
                <button style={styles.socialLink} onClick={() => window.open('https://twitter.com/creavo', '_blank')}>Twitter</button>
              </div>
            </div>

            <div style={styles.infoBlock}>
              <h3 style={styles.infoTitle}>📞 Telefonisch</h3>
              <p style={styles.infoText}>
                [Telefonnummer eintragen]<br/>
                Montag - Freitag: 10:00 - 18:00 Uhr
              </p>
            </div>

            <div style={styles.infoBlock}>
              <h3 style={styles.infoTitle}>🏢 Büro</h3>
              <p style={styles.infoText}>
                [Adresse eintragen]<br/>
                Deutschland
              </p>
            </div>

            <div style={styles.faqBlock}>
              <h3 style={styles.infoTitle}>❓ Schnelle Hilfe?</h3>
              <p style={styles.infoText}>
                Schau dir unsere <a href="#faq" style={styles.infoLink}>FAQ</a> an - 
                vielleicht findest du dort bereits die Antwort.
              </p>
            </div>
          </div>
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
    maxWidth: '1100px',
    margin: '0 auto'
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem'
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
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
  },
  formSection: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '12px',
    border: '2px solid #333'
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#00a8ff',
    marginBottom: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    color: '#aaa',
    fontSize: '0.95rem',
    fontWeight: '600'
  },
  input: {
    padding: '0.75rem',
    backgroundColor: '#0f0f0f',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  textarea: {
    padding: '0.75rem',
    backgroundColor: '#0f0f0f',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'border-color 0.3s'
  },
  submitBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#00a8ff',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '1rem',
    boxShadow: '0 4px 15px rgba(0,168,255,0.3)'
  },
  successMessage: {
    padding: '1rem',
    backgroundColor: '#0a2a1a',
    border: '2px solid #10b981',
    borderRadius: '12px',
    color: '#10b981',
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: '600'
  },
  successSmall: {
    display: 'block',
    fontSize: '0.85rem',
    marginTop: '0.5rem',
    opacity: 0.8
  },
  infoBlock: {
    backgroundColor: '#1a1a1a',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '2px solid #333'
  },
  infoTitle: {
    color: '#00a8ff',
    fontSize: '1.1rem',
    marginBottom: '0.75rem',
    fontWeight: '600'
  },
  infoText: {
    color: '#aaa',
    lineHeight: '1.6',
    fontSize: '0.95rem'
  },
  infoLink: {
    color: '#00a8ff',
    textDecoration: 'none',
    borderBottom: '1px solid #00a8ff',
    cursor: 'pointer'
  },
  socialLinks: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.75rem'
  },
  socialLink: {
    color: '#00a8ff',
    textDecoration: 'none',
    border: '2px solid #00a8ff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    transition: 'all 0.3s'
  },
  faqBlock: {
    backgroundColor: '#0a1a2a',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '2px solid #00a8ff'
  }
};

export default ContactPage;
