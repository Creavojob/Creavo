import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

/**
 * E2EE Crypto Utilities using TweetNaCl
 * Uses X25519 for key exchange and XSalsa20-Poly1305 for encryption
 */

/**
 * Custom Error Classes for better error handling
 */
class CryptoError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'CryptoError';
    this.code = code;
  }
}

class KeyValidationError extends CryptoError {
  constructor(message) {
    super(message, 'KEY_VALIDATION_ERROR');
    this.name = 'KeyValidationError';
  }
}

class EncryptionError extends CryptoError {
  constructor(message) {
    super(message, 'ENCRYPTION_ERROR');
    this.name = 'EncryptionError';
  }
}

class DecryptionError extends CryptoError {
  constructor(message) {
    super(message, 'DECRYPTION_ERROR');
    this.name = 'DecryptionError';
  }
}

/**
 * Validate base64 string format
 */
const isValidBase64 = (str) => {
  if (!str || typeof str !== 'string') return false;
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
};

/**
 * Validate public key format
 */
export const validatePublicKey = (publicKey) => {
  if (!publicKey || typeof publicKey !== 'string') {
    throw new KeyValidationError('Public key must be a non-empty string');
  }
  if (!isValidBase64(publicKey)) {
    throw new KeyValidationError('Public key must be valid base64');
  }
  try {
    const decoded = naclUtil.decodeBase64(publicKey);
    if (decoded.length !== nacl.box.publicKeyLength) {
      throw new KeyValidationError(`Public key must be ${nacl.box.publicKeyLength} bytes`);
    }
  } catch (err) {
    throw new KeyValidationError('Invalid public key format: ' + err.message);
  }
  return true;
};

/**
 * Validate secret key format
 */
export const validateSecretKey = (secretKey) => {
  if (!secretKey || typeof secretKey !== 'string') {
    throw new KeyValidationError('Secret key must be a non-empty string');
  }
  if (!isValidBase64(secretKey)) {
    throw new KeyValidationError('Secret key must be valid base64');
  }
  try {
    const decoded = naclUtil.decodeBase64(secretKey);
    if (decoded.length !== nacl.box.secretKeyLength) {
      throw new KeyValidationError(`Secret key must be ${nacl.box.secretKeyLength} bytes`);
    }
  } catch (err) {
    throw new KeyValidationError('Invalid secret key format: ' + err.message);
  }
  return true;
};

/**
 * Generate a new keypair for a user
 * Returns { publicKey, secretKey } as base64 strings
 */
export const generateKeyPair = () => {
  try {
    const keyPair = nacl.box.keyPair();
    return {
      publicKey: naclUtil.encodeBase64(keyPair.publicKey),
      secretKey: naclUtil.encodeBase64(keyPair.secretKey)
    };
  } catch (error) {
    console.error('Key generation error:', error);
    throw new CryptoError('Failed to generate keypair: ' + error.message, 'KEY_GEN_ERROR');
  }
};

/**
 * Encrypt a message for a recipient
 * @param {string} message - Plain text message
 * @param {string} recipientPublicKey - Recipient's public key (base64)
 * @param {string} senderSecretKey - Sender's secret key (base64)
 * @returns {object} { encryptedMessage, nonce } both as base64
 */
export const encryptMessage = (message, recipientPublicKey, senderSecretKey) => {
  try {
    // Validate inputs
    if (!message || typeof message !== 'string') {
      throw new EncryptionError('Message must be a non-empty string');
    }
    if (message.length > 10000) {
      throw new EncryptionError('Message too long (max 10000 characters)');
    }
    
    validatePublicKey(recipientPublicKey);
    validateSecretKey(senderSecretKey);

    const messageUint8 = naclUtil.decodeUTF8(message);
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const recipientPublicKeyUint8 = naclUtil.decodeBase64(recipientPublicKey);
    const senderSecretKeyUint8 = naclUtil.decodeBase64(senderSecretKey);

    const encrypted = nacl.box(
      messageUint8,
      nonce,
      recipientPublicKeyUint8,
      senderSecretKeyUint8
    );

    if (!encrypted) {
      throw new EncryptionError('Encryption failed - nacl.box returned null');
    }

    return {
      encryptedMessage: naclUtil.encodeBase64(encrypted),
      nonce: naclUtil.encodeBase64(nonce)
    };
  } catch (error) {
    console.error('Encryption error:', error);
    if (error instanceof CryptoError) {
      throw error;
    }
    throw new EncryptionError('Failed to encrypt message: ' + error.message);
  }
};

/**
 * Decrypt a message from a sender
 * @param {string} encryptedMessage - Encrypted message (base64)
 * @param {string} nonce - Nonce used for encryption (base64)
 * @param {string} senderPublicKey - Sender's public key (base64)
 * @param {string} recipientSecretKey - Recipient's secret key (base64)
 * @returns {string} Decrypted message
 */
export const decryptMessage = (encryptedMessage, nonce, senderPublicKey, recipientSecretKey) => {
  try {
    // Validate inputs
    if (!encryptedMessage || !isValidBase64(encryptedMessage)) {
      throw new DecryptionError('Invalid encrypted message format');
    }
    if (!nonce || !isValidBase64(nonce)) {
      throw new DecryptionError('Invalid nonce format');
    }
    
    validatePublicKey(senderPublicKey);
    validateSecretKey(recipientSecretKey);

    const encryptedMessageUint8 = naclUtil.decodeBase64(encryptedMessage);
    const nonceUint8 = naclUtil.decodeBase64(nonce);
    
    // Validate nonce length
    if (nonceUint8.length !== nacl.box.nonceLength) {
      throw new DecryptionError(`Invalid nonce length: expected ${nacl.box.nonceLength}, got ${nonceUint8.length}`);
    }

    const senderPublicKeyUint8 = naclUtil.decodeBase64(senderPublicKey);
    const recipientSecretKeyUint8 = naclUtil.decodeBase64(recipientSecretKey);

    const decrypted = nacl.box.open(
      encryptedMessageUint8,
      nonceUint8,
      senderPublicKeyUint8,
      recipientSecretKeyUint8
    );

    if (!decrypted) {
      throw new DecryptionError('Decryption failed - wrong keys, corrupted message, or tampered data');
    }

    return naclUtil.encodeUTF8(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    if (error instanceof CryptoError) {
      throw error;
    }
    throw new DecryptionError('Failed to decrypt message: ' + error.message);
  }
};

/**
 * Encrypt secret key with password for storage
 * Uses symmetric encryption (secretbox)
 * @param {string} secretKey - Secret key to encrypt (base64)
 * @param {string} password - User's password
 * @returns {object} { encryptedSecretKey, nonce, salt } all base64
 */
export const encryptSecretKeyWithPassword = (secretKey, password) => {
  try {
    // Generate salt and derive key from password using hash
    const salt = nacl.randomBytes(16);
    const passwordKey = nacl.hash(naclUtil.decodeUTF8(password + naclUtil.encodeBase64(salt))).slice(0, 32);
    
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const secretKeyUint8 = naclUtil.decodeBase64(secretKey);
    
    const encrypted = nacl.secretbox(secretKeyUint8, nonce, passwordKey);

    return {
      encryptedSecretKey: naclUtil.encodeBase64(encrypted),
      nonce: naclUtil.encodeBase64(nonce),
      salt: naclUtil.encodeBase64(salt)
    };
  } catch (error) {
    console.error('Secret key encryption error:', error);
    throw new Error('Failed to encrypt secret key');
  }
};

/**
 * Decrypt secret key with password
 * @param {string} encryptedSecretKey - Encrypted secret key (base64)
 * @param {string} nonce - Nonce (base64)
 * @param {string} salt - Salt (base64)
 * @param {string} password - User's password
 * @returns {string} Decrypted secret key (base64)
 */
export const decryptSecretKeyWithPassword = (encryptedSecretKey, nonce, salt, password) => {
  try {
    // Validate inputs
    if (!password || typeof password !== 'string' || password.length < 8) {
      throw new DecryptionError('Password must be at least 8 characters');
    }
    if (!encryptedSecretKey || !isValidBase64(encryptedSecretKey)) {
      throw new DecryptionError('Invalid encrypted secret key format');
    }
    if (!nonce || !isValidBase64(nonce)) {
      throw new DecryptionError('Invalid nonce format');
    }
    if (!salt || !isValidBase64(salt)) {
      throw new DecryptionError('Invalid salt format');
    }

    const saltUint8 = naclUtil.decodeBase64(salt);
    const passwordKey = nacl.hash(naclUtil.decodeUTF8(password + naclUtil.encodeBase64(saltUint8))).slice(0, 32);
    
    const encryptedUint8 = naclUtil.decodeBase64(encryptedSecretKey);
    const nonceUint8 = naclUtil.decodeBase64(nonce);
    
    // Validate nonce length
    if (nonceUint8.length !== nacl.secretbox.nonceLength) {
      throw new DecryptionError(`Invalid nonce length for secretbox`);
    }
    
    const decrypted = nacl.secretbox.open(encryptedUint8, nonceUint8, passwordKey);

    if (!decrypted) {
      throw new DecryptionError('Wrong password or corrupted key data');
    }

    const decryptedKey = naclUtil.encodeBase64(decrypted);
    
    // Validate the decrypted key
    validateSecretKey(decryptedKey);
    
    return decryptedKey;
  } catch (error) {
    console.error('Secret key decryption error:', error);
    if (error instanceof CryptoError) {
      throw error;
    }
    throw new DecryptionError('Failed to decrypt secret key: ' + error.message);
  }
};

/**
 * Store keys in localStorage
 */
export const storeKeys = (publicKey, encryptedSecretKey, nonce, salt) => {
  localStorage.setItem('publicKey', publicKey);
  localStorage.setItem('encryptedSecretKey', encryptedSecretKey);
  localStorage.setItem('keyNonce', nonce);
  localStorage.setItem('keySalt', salt);
};

/**
 * Get stored keys from localStorage
 */
export const getStoredKeys = () => {
  return {
    publicKey: localStorage.getItem('publicKey'),
    encryptedSecretKey: localStorage.getItem('encryptedSecretKey'),
    keyNonce: localStorage.getItem('keyNonce'),
    keySalt: localStorage.getItem('keySalt')
  };
};

/**
 * Clear stored keys
 */
export const clearStoredKeys = () => {
  localStorage.removeItem('publicKey');
  localStorage.removeItem('encryptedSecretKey');
  localStorage.removeItem('keyNonce');
  localStorage.removeItem('keySalt');
  localStorage.removeItem('secretKey'); // Also clear session secret key
};

/**
 * Store decrypted secret key in session (memory) - cleared on page refresh
 */
export const setSessionSecretKey = (secretKey) => {
  sessionStorage.setItem('secretKey', secretKey);
};

/**
 * Get secret key from session
 */
export const getSessionSecretKey = () => {
  return sessionStorage.getItem('secretKey');
};

/**
 * Clear session secret key
 */
export const clearSessionSecretKey = () => {
  sessionStorage.removeItem('secretKey');
};

/**
 * Export keys as JSON for backup
 * @returns {string} JSON string with encrypted keys
 */
export const exportKeysBackup = () => {
  const keys = getStoredKeys();
  if (!keys.publicKey || !keys.encryptedSecretKey) {
    throw new CryptoError('No keys found to export', 'NO_KEYS');
  }
  
  const backup = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    publicKey: keys.publicKey,
    encryptedSecretKey: keys.encryptedSecretKey,
    keyNonce: keys.keyNonce,
    keySalt: keys.keySalt
  };
  
  return JSON.stringify(backup, null, 2);
};

/**
 * Import keys from backup JSON
 * @param {string} backupJson - JSON string with encrypted keys
 * @throws {CryptoError} If backup is invalid
 */
export const importKeysBackup = (backupJson) => {
  try {
    const backup = JSON.parse(backupJson);
    
    // Validate backup structure
    if (!backup.publicKey || !backup.encryptedSecretKey || !backup.keyNonce || !backup.keySalt) {
      throw new CryptoError('Invalid backup format - missing required fields', 'INVALID_BACKUP');
    }
    
    // Validate keys
    validatePublicKey(backup.publicKey);
    if (!isValidBase64(backup.encryptedSecretKey)) {
      throw new CryptoError('Invalid encrypted secret key in backup', 'INVALID_BACKUP');
    }
    if (!isValidBase64(backup.keyNonce) || !isValidBase64(backup.keySalt)) {
      throw new CryptoError('Invalid nonce or salt in backup', 'INVALID_BACKUP');
    }
    
    // Store imported keys
    storeKeys(backup.publicKey, backup.encryptedSecretKey, backup.keyNonce, backup.keySalt);
    
    return true;
  } catch (error) {
    if (error instanceof CryptoError) {
      throw error;
    }
    throw new CryptoError('Failed to import backup: ' + error.message, 'IMPORT_ERROR');
  }
};

/**
 * Download keys backup as file
 */
export const downloadKeysBackup = () => {
  try {
    const backup = exportKeysBackup();
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creavo-keys-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new CryptoError('Failed to download backup: ' + error.message, 'DOWNLOAD_ERROR');
  }
};

/**
 * Check if keys are stored
 */
export const hasStoredKeys = () => {
  const keys = getStoredKeys();
  return !!(keys.publicKey && keys.encryptedSecretKey && keys.keyNonce && keys.keySalt);
};

/**
 * Check if session is unlocked
 */
export const isSessionUnlocked = () => {
  return !!getSessionSecretKey();
};
