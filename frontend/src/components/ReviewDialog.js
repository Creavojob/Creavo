import React, { useState } from 'react';
import { messagesAPI } from '../services/api';

const ReviewDialog = ({ applicationId, onReviewSubmitted, onClose }) => {
  const [reviewStatus, setReviewStatus] = useState('approved');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async () => {
    setLoading(true);
    try {
      await messagesAPI.submitClientReview(applicationId, reviewStatus, feedback);
      onReviewSubmitted();
      onClose();
    } catch (error) {
      alert('Fehler beim Einreichen der Überprüfung: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>📋 Arbeit überprüfen</h2>

        <div style={styles.content}>
          <div style={styles.section}>
            <label style={styles.label}>Bewertung:</label>
            <div style={styles.options}>
              <label style={styles.option}>
                <input
                  type="radio"
                  value="approved"
                  checked={reviewStatus === 'approved'}
                  onChange={(e) => setReviewStatus(e.target.value)}
                />
                ✅ Akzeptieren
              </label>
              <label style={styles.option}>
                <input
                  type="radio"
                  value="rejected"
                  checked={reviewStatus === 'rejected'}
                  onChange={(e) => setReviewStatus(e.target.value)}
                />
                ❌ Änderungen nötig
              </label>
              <label style={styles.option}>
                <input
                  type="radio"
                  value="disputed"
                  checked={reviewStatus === 'disputed'}
                  onChange={(e) => setReviewStatus(e.target.value)}
                />
                ⚠️ Dispute
              </label>
            </div>
          </div>

          {(reviewStatus === 'rejected' || reviewStatus === 'disputed') && (
            <div style={styles.section}>
              <label style={styles.label}>Feedback/Grund:</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={reviewStatus === 'rejected' 
                  ? 'Beschreiben Sie die erforderlichen Änderungen...'
                  : 'Erklären Sie, warum Sie ein Dispute einleiten...'}
                style={styles.textarea}
              />
            </div>
          )}

          <div style={styles.info}>
            {reviewStatus === 'approved' && (
              <p>✅ Die Arbeit wird akzeptiert und der Freelancer erhält die volle Zahlung.</p>
            )}
            {reviewStatus === 'rejected' && (
              <p>📝 Der Freelancer erhält Ihr Feedback und kann die Arbeit überarbeiten (max. 2 Versuche).</p>
            )}
            {reviewStatus === 'disputed' && (
              <p>⚠️ Ein Administrator wird den Fall überprüfen und entscheiden.</p>
            )}
          </div>
        </div>

        <div style={styles.buttons}>
          <button
            onClick={handleSubmitReview}
            disabled={loading || (feedback === '' && (reviewStatus === 'rejected' || reviewStatus === 'disputed'))}
            style={{...styles.button, backgroundColor: '#00ff00'}}
          >
            {loading ? '⏳' : '✓ Absenden'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            style={{...styles.button, backgroundColor: '#333'}}
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  dialog: {
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    padding: '2rem',
    maxWidth: '500px',
    border: '1px solid #00ff00',
    boxShadow: '0 4px 20px rgba(0,255,0,0.2)'
  },
  title: {
    margin: '0 0 1.5rem 0',
    color: '#00ff00',
    fontSize: '1.3rem'
  },
  content: {
    marginBottom: '1.5rem'
  },
  section: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    color: '#aaa',
    marginBottom: '0.5rem',
    fontWeight: 'bold'
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    color: '#e0e0e0',
    cursor: 'pointer'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0',
    border: '1px solid #333',
    borderRadius: '4px',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    minHeight: '100px',
    boxSizing: 'border-box'
  },
  info: {
    backgroundColor: '#2a2a2a',
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    color: '#aaa',
    marginTop: '1rem',
    borderLeft: '3px solid #00ff00'
  },
  buttons: {
    display: 'flex',
    gap: '0.75rem'
  },
  button: {
    flex: 1,
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    color: '#0f0f0f',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default ReviewDialog;
