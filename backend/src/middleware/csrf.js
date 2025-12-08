/**
 * CSRF Protection Middleware
 */
const csrf = require('csurf');

/**
 * CSRF protection for state-changing operations
 * Only applied to POST, PUT, DELETE methods
 */
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

/**
 * Conditional CSRF - only for state-changing operations
 */
const conditionalCsrf = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Apply CSRF protection
  return csrfProtection(req, res, next);
};

/**
 * CSRF token endpoint
 */
const getCsrfToken = (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
};

module.exports = {
  csrfProtection,
  conditionalCsrf,
  getCsrfToken
};
