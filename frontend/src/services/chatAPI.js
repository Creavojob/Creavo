import api from './api';
import { retryWithBackoff } from '../utils/retryHelper';

/**
 * Chat API Service with retry logic
 */

// Get all conversations for current user
export const getConversations = () => {
  return api.get('/chat/conversations');
};

// Create or get a conversation
export const createConversation = (jobId, clientId, freelancerId, adminAccessEnabled = false) => {
  return api.post('/chat/conversations', {
    jobId,
    clientId,
    freelancerId,
    adminAccessEnabled
  });
};

// Get messages for a conversation
export const getMessages = (conversationId, limit = 50, offset = 0) => {
  return retryWithBackoff(
    () => api.get(`/chat/conversations/${conversationId}/messages`, {
      params: { limit, offset }
    }),
    { maxRetries: 2 }
  );
};

// Send a message
export const sendMessage = (conversationId, encryptedContent, encryptedForAdmin, nonce, senderPublicKey) => {
  return retryWithBackoff(
    () => api.post(`/chat/conversations/${conversationId}/messages`, {
      encryptedContent,
      encryptedForAdmin,
      nonce,
      senderPublicKey
    }),
    {
      maxRetries: 3,
      shouldRetry: (error) => {
        // Don't retry on validation errors (400)
        if (error.response?.status === 400) return false;
        // Don't retry on auth errors (401, 403)
        if (error.response?.status === 401 || error.response?.status === 403) return false;
        // Retry on network errors or 5xx
        return !error.response || error.response.status >= 500;
      }
    }
  );
};

// Flag conversation for dispute
export const flagDispute = (conversationId) => {
  return api.post(`/chat/conversations/${conversationId}/flag-dispute`);
};

// Get public key for a user
export const getUserPublicKey = (userId) => {
  return api.get(`/chat/keys/${userId}`);
};

// Set/Update current user's public key
export const setPublicKey = (publicKey, encryptedPrivateKey) => {
  return api.post('/chat/keys', {
    publicKey,
    encryptedPrivateKey
  });
};

// Admin: Get conversation overview
export const getAdminOverview = () => {
  return api.get('/chat/admin/overview');
};

// Admin: Get all disputes
export const getAdminDisputes = () => {
  return api.get('/chat/admin/disputes');
};

// Admin: Get messages for dispute resolution
export const getAdminMessages = (conversationId) => {
  return api.get(`/chat/admin/conversations/${conversationId}/messages`);
};

export default {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  flagDispute,
  getUserPublicKey,
  setPublicKey,
  getAdminOverview,
  getAdminDisputes,
  getAdminMessages
};
