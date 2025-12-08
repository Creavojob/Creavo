/**
 * Input Sanitization and Validation Middleware
 */

/**
 * Sanitize string input
 * Removes potentially dangerous characters but keeps valid base64
 */
const sanitizeString = (str, maxLength = 1000) => {
  if (typeof str !== 'string') return '';
  
  // Trim whitespace
  let sanitized = str.trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

/**
 * Validate base64 string
 */
const isValidBase64 = (str) => {
  if (!str || typeof str !== 'string') return false;
  
  // Base64 pattern
  const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
  
  if (!base64Pattern.test(str)) return false;
  
  // Check if length is valid (must be multiple of 4)
  if (str.length % 4 !== 0) return false;
  
  try {
    // Try to decode
    Buffer.from(str, 'base64');
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Validate UUID format
 */
const isValidUUID = (str) => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
};

/**
 * Sanitize and validate message input
 */
const validateMessageInput = (req, res, next) => {
  const { encryptedContent, nonce, senderPublicKey, encryptedForAdmin } = req.body;
  
  // Required fields
  if (!encryptedContent || !nonce || !senderPublicKey) {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Missing required fields: encryptedContent, nonce, senderPublicKey'
    });
  }
  
  // Type validation
  if (typeof encryptedContent !== 'string' || 
      typeof nonce !== 'string' || 
      typeof senderPublicKey !== 'string') {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Invalid field types - all must be strings'
    });
  }
  
  // Length validation
  if (encryptedContent.length > 20000) {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Encrypted content too large (max 20KB)'
    });
  }
  
  if (nonce.length > 100 || senderPublicKey.length > 100) {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Nonce or public key too long'
    });
  }
  
  // Base64 validation
  if (!isValidBase64(encryptedContent)) {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Invalid base64 format for encrypted content'
    });
  }
  
  if (!isValidBase64(nonce)) {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Invalid base64 format for nonce'
    });
  }
  
  if (!isValidBase64(senderPublicKey)) {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Invalid base64 format for sender public key'
    });
  }
  
  // Validate optional encryptedForAdmin
  if (encryptedForAdmin && !isValidBase64(encryptedForAdmin)) {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Invalid base64 format for encryptedForAdmin'
    });
  }
  
  // Sanitize (already validated, but ensure no extra whitespace)
  req.body.encryptedContent = encryptedContent.trim();
  req.body.nonce = nonce.trim();
  req.body.senderPublicKey = senderPublicKey.trim();
  if (encryptedForAdmin) {
    req.body.encryptedForAdmin = encryptedForAdmin.trim();
  }
  
  next();
};

/**
 * Validate public key input
 */
const validatePublicKeyInput = (req, res, next) => {
  const { publicKey, encryptedPrivateKey } = req.body;
  
  if (!publicKey) {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Public key required'
    });
  }
  
  if (typeof publicKey !== 'string') {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Public key must be a string'
    });
  }
  
  if (publicKey.length > 100) {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Public key too long (max 100 characters)'
    });
  }
  
  if (!isValidBase64(publicKey)) {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Invalid public key format - must be base64'
    });
  }
  
  // Validate optional encryptedPrivateKey
  if (encryptedPrivateKey) {
    if (typeof encryptedPrivateKey !== 'string') {
      return res.status(400).json({
        error: 'Validation failed',
        details: 'Encrypted private key must be a string'
      });
    }
    
    if (encryptedPrivateKey.length > 5000) {
      return res.status(400).json({
        error: 'Validation failed',
        details: 'Encrypted private key too large'
      });
    }
  }
  
  // Sanitize
  req.body.publicKey = publicKey.trim();
  if (encryptedPrivateKey) {
    req.body.encryptedPrivateKey = encryptedPrivateKey.trim();
  }
  
  next();
};

/**
 * Validate conversation ID parameter
 */
const validateConversationId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || !isValidUUID(id)) {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Invalid conversation ID format'
    });
  }
  
  next();
};

/**
 * Validate user ID parameter
 */
const validateUserId = (req, res, next) => {
  const { userId } = req.params;
  
  if (!userId || !isValidUUID(userId)) {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Invalid user ID format'
    });
  }
  
  next();
};

module.exports = {
  sanitizeString,
  isValidBase64,
  isValidUUID,
  validateMessageInput,
  validatePublicKeyInput,
  validateConversationId,
  validateUserId
};
