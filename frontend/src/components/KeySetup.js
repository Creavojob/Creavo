import React, { useState } from 'react';
import {
  generateKeyPair,
  encryptSecretKeyWithPassword,
  storeKeys
} from '../utils/crypto';
import { setPublicKey } from '../services/chatAPI';

const KeySetup = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSetupKeys = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Generate keypair
      const { publicKey, secretKey } = generateKeyPair();

      // 2. Encrypt secret key with password
      const { encryptedSecretKey, nonce, salt } = encryptSecretKeyWithPassword(secretKey, password);

      // 3. Store keys locally
      storeKeys(publicKey, encryptedSecretKey, nonce, salt);

      // 4. Upload public key to server
      const encryptedPrivateKeyForBackup = JSON.stringify({
        encryptedSecretKey,
        nonce,
        salt
      });
      await setPublicKey(publicKey, encryptedPrivateKeyForBackup);

      // 5. Done
      onComplete();
    } catch (err) {
      console.error('Key setup error:', err);
      setError('Fehler beim Einrichten der Verschlüsselung: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>🔐 Verschlüsselte Nachrichten einrichten</h2>
        <p style={styles.description}>
          Um verschlüsselte Nachrichten zu senden und zu empfangen, müssen Sie ein
          Verschlüsselungs-Passwort festlegen. Dieses Passwort wird verwendet, um Ihre
          privaten Schlüssel zu schützen.
        </p>
        <p style={styles.warning}>
          ⚠️ <strong>Wichtig:</strong> Merken Sie sich dieses Passwort! Es kann nicht
          wiederhergestellt werden. Wenn Sie es vergessen, verlieren Sie den Zugriff auf
          Ihre Nachrichten.
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSetupKeys} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Verschlüsselungs-Passwort:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Mindestens 8 Zeichen"
              required
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Passwort bestätigen:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="Passwort wiederholen"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            disabled={loading}
          >
            {loading ? '⏳ Wird eingerichtet...' : '🔒 Verschlüsselung aktivieren'}
          </button>
        </form>

        <div style={styles.info}>
          <p><strong>Technische Details:</strong></p>
          <ul style={styles.list}>
            <li>End-to-End Verschlüsselung mit NaCl/libsodium</li>
            <li>Nur Sie und Ihr Chatpartner können Nachrichten lesen</li>
            <li>Nachrichten werden verschlüsselt auf dem Server gespeichert</li>
            <li>Optional: Admin-Zugriff bei Streitfällen (beide Parteien müssen zustimmen)</li>
          </ul>
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
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    backgroundColor: '#1a1a1a',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '100%',
    color: '#ffffff',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  title: {
    fontSize: '24px',
    marginBottom: '15px',
    color: '#00d4ff'
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '15px',
    color: '#cccccc'
  },
  warning: {
    backgroundColor: '#ff9800',
    color: '#000',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  error: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  form: {
    marginBottom: '20px'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '2px solid #333',
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#00d4ff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  buttonDisabled: {
    backgroundColor: '#666',
    cursor: 'not-allowed'
  },
  info: {
    backgroundColor: '#2a2a2a',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#cccccc'
  },
  list: {
    marginTop: '10px',
    paddingLeft: '20px',
    lineHeight: '1.8'
  }
};

export default KeySetup;
