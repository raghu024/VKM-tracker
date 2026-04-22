/**
 * Security Utility for VKM Mentorship Tracker
 * Handles input sanitization and basic payload validation.
 */

export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  // Basic HTML stripping to prevent XSS
  return str.replace(/<[^>]*>?/gm, '').trim();
};

export const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeString(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

export const checkPayloadSize = (data, maxSizeInBytes = 50000) => {
  const size = new Blob([JSON.stringify(data)]).size;
  if (size > maxSizeInBytes) {
    throw new Error(`Payload too large: ${size} bytes (Max: ${maxSizeInBytes})`);
  }
  return true;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};
