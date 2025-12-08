const { Conversation, Message, User, Job } = require('../models');
const { Op } = require('sequelize');

/**
 * Get or create a conversation between client and freelancer for a specific job
 */
const getOrCreateConversation = async (jobId, clientId, freelancerId, adminAccessEnabled = false) => {
  try {
    let conversation = await Conversation.findOne({
      where: {
        jobId,
        clientId,
        freelancerId
      },
      include: [
        { model: Job, as: 'job', attributes: ['id', 'title'] },
        { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'publicKey'] },
        { model: User, as: 'freelancer', attributes: ['id', 'firstName', 'lastName', 'publicKey'] }
      ]
    });

    if (!conversation) {
      conversation = await Conversation.create({
        jobId,
        clientId,
        freelancerId,
        adminAccessEnabled
      });

      // Reload with associations
      conversation = await Conversation.findByPk(conversation.id, {
        include: [
          { model: Job, as: 'job', attributes: ['id', 'title'] },
          { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'publicKey'] },
          { model: User, as: 'freelancer', attributes: ['id', 'firstName', 'lastName', 'publicKey'] }
        ]
      });
    }

    return conversation;
  } catch (error) {
    throw new Error('Failed to get or create conversation: ' + error.message);
  }
};

/**
 * Get all conversations for a user
 */
const getUserConversations = async (userId) => {
  try {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { clientId: userId },
          { freelancerId: userId }
        ],
        archivedAt: null
      },
      include: [
        { model: Job, as: 'job', attributes: ['id', 'title'] },
        { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'publicKey'] },
        { model: User, as: 'freelancer', attributes: ['id', 'firstName', 'lastName', 'publicKey'] }
      ],
      order: [['lastMessageAt', 'DESC NULLS LAST'], ['createdAt', 'DESC']]
    });

    return conversations;
  } catch (error) {
    throw new Error('Failed to get conversations: ' + error.message);
  }
};

/**
 * Send an encrypted message
 */
const sendMessage = async (conversationId, senderId, encryptedContent, encryptedForAdmin, nonce, senderPublicKey) => {
  try {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Verify sender is part of conversation
    if (conversation.clientId !== senderId && conversation.freelancerId !== senderId) {
      throw new Error('Unauthorized');
    }

    const message = await Message.create({
      conversationId,
      senderId,
      encryptedContent,
      encryptedForAdmin,
      nonce,
      senderPublicKey,
      messageType: 'text'
    });

    // Update conversation
    const isClient = conversation.clientId === senderId;
    await conversation.update({
      lastMessageAt: new Date(),
      unreadCountClient: isClient ? conversation.unreadCountClient : conversation.unreadCountClient + 1,
      unreadCountFreelancer: isClient ? conversation.unreadCountFreelancer + 1 : conversation.unreadCountFreelancer
    });

    return message;
  } catch (error) {
    throw new Error('Failed to send message: ' + error.message);
  }
};

/**
 * Get messages for a conversation
 */
const getConversationMessages = async (conversationId, userId, limit = 50, offset = 0) => {
  try {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Verify user is part of conversation
    if (conversation.clientId !== userId && conversation.freelancerId !== userId) {
      throw new Error('Unauthorized');
    }

    const messages = await Message.findAll({
      where: {
        conversationId,
        deletedAt: null
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    // Mark messages as read
    const isClient = conversation.clientId === userId;
    await Message.update(
      { readAt: new Date() },
      {
        where: {
          conversationId,
          senderId: { [Op.ne]: userId },
          readAt: null
        }
      }
    );

    // Reset unread count
    await conversation.update({
      unreadCountClient: isClient ? 0 : conversation.unreadCountClient,
      unreadCountFreelancer: isClient ? conversation.unreadCountFreelancer : 0
    });

    return messages.reverse(); // Return in chronological order
  } catch (error) {
    throw new Error('Failed to get messages: ' + error.message);
  }
};

/**
 * Flag conversation for dispute
 */
const flagForDispute = async (conversationId, userId) => {
  try {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const isClient = conversation.clientId === userId;
    const isFreelancer = conversation.freelancerId === userId;

    if (!isClient && !isFreelancer) {
      throw new Error('Unauthorized');
    }

    const updates = {};
    if (isClient) {
      updates.disputeFlaggedByClient = new Date();
    } else {
      updates.disputeFlaggedByFreelancer = new Date();
    }

    // Check if both have flagged
    if (conversation.disputeFlaggedByClient && isFreelancer) {
      updates.disputeStatus = 'both_flagged';
    } else if (conversation.disputeFlaggedByFreelancer && isClient) {
      updates.disputeStatus = 'both_flagged';
    } else if (isClient) {
      updates.disputeStatus = 'client_flagged';
    } else {
      updates.disputeStatus = 'freelancer_flagged';
    }

    await conversation.update(updates);

    // Create system message
    await Message.create({
      conversationId,
      senderId: userId,
      encryptedContent: 'SYSTEM_DISPUTE_FLAG', // System messages are not encrypted
      nonce: 'SYSTEM',
      senderPublicKey: 'SYSTEM',
      messageType: 'dispute_flag'
    });

    return conversation;
  } catch (error) {
    throw new Error('Failed to flag for dispute: ' + error.message);
  }
};

/**
 * Get all disputes (Admin only)
 */
const getAllDisputes = async () => {
  try {
    const disputes = await Conversation.findAll({
      where: {
        disputeStatus: {
          [Op.in]: ['client_flagged', 'freelancer_flagged', 'both_flagged']
        }
      },
      include: [
        { model: Job, as: 'job', attributes: ['id', 'title'] },
        { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'freelancer', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ],
      order: [['disputeFlaggedByClient', 'DESC NULLS LAST'], ['disputeFlaggedByFreelancer', 'DESC NULLS LAST']]
    });

    return disputes;
  } catch (error) {
    throw new Error('Failed to get disputes: ' + error.message);
  }
};

/**
 * Get admin overview of all conversations (metadata only)
 */
const getAdminConversationOverview = async () => {
  try {
    const conversations = await Conversation.findAll({
      attributes: [
        'id',
        'jobId',
        'clientId',
        'freelancerId',
        'adminAccessEnabled',
        'disputeStatus',
        'lastMessageAt',
        'createdAt'
      ],
      include: [
        { model: Job, as: 'job', attributes: ['id', 'title'] },
        { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'freelancer', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ],
      order: [['lastMessageAt', 'DESC NULLS LAST'], ['createdAt', 'DESC']]
    });

    // Add message count for each conversation
    const conversationsWithCount = await Promise.all(
      conversations.map(async (conv) => {
        const messageCount = await Message.count({
          where: { conversationId: conv.id, deletedAt: null }
        });
        return {
          ...conv.toJSON(),
          messageCount
        };
      })
    );

    return conversationsWithCount;
  } catch (error) {
    throw new Error('Failed to get admin overview: ' + error.message);
  }
};

module.exports = {
  getOrCreateConversation,
  getUserConversations,
  sendMessage,
  getConversationMessages,
  flagForDispute,
  getAllDisputes,
  getAdminConversationOverview
};
