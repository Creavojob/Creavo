/**
 * Retry Helper for API Calls with exponential backoff
 */

/**
 * Retry an async function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Result of the function
 */
export const retryWithBackoff = async (
  fn,
  {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    shouldRetry = (error) => {
      // Default: retry on network errors or 5xx errors
      if (!error.response) return true; // Network error
      if (error.response.status >= 500) return true; // Server error
      return false;
    }
  } = {}
) => {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const delay = Math.min(initialDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
};

/**
 * Debounce function calls
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function calls
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if online
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Wait for online status
 */
export const waitForOnline = (timeout = 30000) => {
  return new Promise((resolve, reject) => {
    if (navigator.onLine) {
      resolve();
      return;
    }

    const handleOnline = () => {
      window.removeEventListener('online', handleOnline);
      clearTimeout(timeoutId);
      resolve();
    };

    const timeoutId = setTimeout(() => {
      window.removeEventListener('online', handleOnline);
      reject(new Error('Timeout waiting for online status'));
    }, timeout);

    window.addEventListener('online', handleOnline);
  });
};
