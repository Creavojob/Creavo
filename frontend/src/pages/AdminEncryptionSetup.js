import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  generateKeyPair,
  encryptSecretKeyWithPassword,
  storeKeys,
  getStoredKeys,
  decryptSecretKeyWithPassword,
  setSessionSecretKey,
  getSessionSecretKey
} from '../utils/crypto';
import { setPublicKey } from '../services/chatAPI';

/**
 * Admin Encryption Setup Component
 * Admins need encryption keys to decrypt messages in dispute cases
 */
const AdminEncryptionSetup = ({ onSetupComplete }) => {
  // const { user } = useAuth(); // entfernt, da nicht verwendet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [unlockPassword, setUnlockPassword] = useState('');
  const [needsSetup, setNeedsSetup] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    checkSetupStatus();
  }, [checkSetupStatus]);

  const checkSetupStatus = () => {
    const storedKeys = getStoredKeys();
    
    if (!storedKeys.publicKey || !storedKeys.encryptedSecretKey) {
      setNeedsSetup(true);
      setNeedsUnlock(false);
      setIsSetupComplete(false);
      return;
    }

    const sessionSecretKey = getSessionSecretKey();
    if (!sessionSecretKey) {
      setNeedsSetup(false);
      setNeedsUnlock(true);
      setIsSetupComplete(false);
      return;
    }

    setNeedsSetup(false);
    setNeedsUnlock(false);
    setIsSetupComplete(true);
    if (onSetupComplete) onSetupComplete();
  };

  const handleSetupKeys = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 12) {
      setError('Admin-Passwort muss mindestens 12 Zeichen lang sein');
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

      // 5. Set session key
      setSessionSecretKey(secretKey);

      // 6. Done
      setNeedsSetup(false);
      setIsSetupComplete(true);
      if (onSetupComplete) onSetupComplete();
    } catch (err) {
      console.error('Admin key setup error:', err);
      setError('Fehler beim Einrichten der Verschlüsselung: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const storedKeys = getStoredKeys();
      const secretKey = decryptSecretKeyWithPassword(
        storedKeys.encryptedSecretKey,
        storedKeys.keyNonce,
        storedKeys.keySalt,
        unlockPassword
      );
      
      setSessionSecretKey(secretKey);
      setNeedsUnlock(false);
      setIsSetupComplete(true);
      setUnlockPassword('');
      if (onSetupComplete) onSetupComplete();
    } catch (err) {
      setError('Falsches Passwort');
    }
  };

  if (isSetupComplete) {
    return (
      <div style={styles.successCard}>
        <h3>✅ Verschlüsselung aktiviert</h3>
        <p>Sie können jetzt verschlüsselte Nachrichten in Streitfällen lesen.</p>
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>🔐 Admin E2EE Verschlüsselung einrichten</h2>
          <div style={styles.infoBox}>
            <p>
              Als Administrator benötigen Sie Verschlüsselungsschlüssel, um Nachrichten in Streitfällen 
              zu lesen (wenn beide Parteien den Streitfall markiert haben).
            </p>
            <p style={styles.warning}>
              ⚠️ <strong>Wichtig:</strong> Verwenden Sie ein starkes, einzigartiges Passwort 
              (mindestens 12 Zeichen). Dieses kann nicht wiederhergestellt werden!
            </p>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSetupKeys} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Admin Verschlüsselungs-Passwort:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Mindestens 12 Zeichen"
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

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? '⏳ Einrichten...' : '🔐 Verschlüsselung aktivieren'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (needsUnlock) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>🔒 Admin-Zugriff entsperren</h2>
          <p>Geben Sie Ihr Verschlüsselungs-Passwort ein, um Streitfall-Nachrichten zu lesen.</p>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <form onSubmit={handleUnlock} style={styles.form}>
            <input
              type="password"
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
              placeholder="Verschlüsselungs-Passwort"
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>
              🔓 Entsperren
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    padding: '20px'
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: '40px',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '100%',
    border: '2px solid #333',
    color: '#fff'
  },
  successCard: {
    backgroundColor: '#1a4d1a',
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid #00ff00',
    color: '#00ff00',
    textAlign: 'center'
  },
  title: {
    color: '#00d4ff',
    marginBottom: '20px',
    fontSize: '24px'
  },
  infoBox: {
    backgroundColor: '#2a2a2a',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #444'
  },
  warning: {
    color: '#ff9800',
    marginTop: '15px',
    fontSize: '14px'
  },
  error: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: '#00d4ff',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #333',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#00d4ff',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

export default AdminEncryptionSetup;
