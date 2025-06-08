import axiosInstance from "./axiosInstance";

// Define basic types for the conversation service
interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: number;
  matchId: number;
  matchName: string;
  matchPhoto: string;
  lastMessage?: Message;
  unreadCount: number;
  lastActive: string;
  isActive: boolean;
}

interface ConversationsResponse {
  data: Conversation[];
  total: number;
  page: number;
  limit: number;
}

interface MessagesResponse {
  data: Message[];
  total: number;
  page: number;
  limit: number;
}

interface SendMessageResponse {
  data: Message;
  success: boolean;
}

interface ConversationActionResponse {
  success: boolean;
  message: string;
}

const conversationService = {
  /**
   * Get all conversations for the current user
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of conversations per page
   * @returns {Promise<ConversationsResponse>} Promise with conversations data
   */
  getConversations: async (page: number = 1, limit: number = 20): Promise<ConversationsResponse> => {
    try {
      const response = await axiosInstance.get('/conversations', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  /**
   * Get a specific conversation by ID
   * @param {number} conversationId - ID of the conversation to retrieve
   * @returns {Promise<Conversation>} Promise with conversation data
   */
  getConversationById: async (conversationId: number): Promise<Conversation> => {
    try {
      const response = await axiosInstance.get(`/conversations/${conversationId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching conversation ${conversationId}:`, error);
      throw error;
    }
  },

  /**
   * Get messages from a specific conversation
   * @param {number} conversationId - ID of the conversation
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of messages per page
   * @returns {Promise<MessagesResponse>} Promise with messages data
   */
  getMessages: async (conversationId: number, page: number = 1, limit: number = 50): Promise<MessagesResponse> => {
    try {
      const response = await axiosInstance.get(`/conversations/${conversationId}/messages`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, error);
      throw error;
    }
  },

  /**
   * Send a message in a conversation
   * @param {number} conversationId - ID of the conversation
   * @param {string} content - Message content
   * @returns {Promise<SendMessageResponse>} Promise with sent message data
   */
  sendMessage: async (conversationId: number, content: string): Promise<SendMessageResponse> => {
    try {
      const response = await axiosInstance.post(`/conversations/${conversationId}/messages`, {
        content
      });
      return response.data;
    } catch (error) {
      console.error(`Error sending message in conversation ${conversationId}:`, error);
      throw error;
    }
  },

  /**
   * Mark a conversation as read
   * @param {number} conversationId - ID of the conversation to mark as read
   * @returns {Promise<ConversationActionResponse>} Promise with action response
   */
  markAsRead: async (conversationId: number): Promise<ConversationActionResponse> => {
    try {
      const response = await axiosInstance.put(`/conversations/${conversationId}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking conversation ${conversationId} as read:`, error);
      throw error;
    }
  },

  /**
   * Archive a conversation
   * @param {number} conversationId - ID of the conversation to archive
   * @returns {Promise<ConversationActionResponse>} Promise with action response
   */
  archiveConversation: async (conversationId: number): Promise<ConversationActionResponse> => {
    try {
      const response = await axiosInstance.put(`/conversations/${conversationId}/archive`);
      return response.data;
    } catch (error) {
      console.error(`Error archiving conversation ${conversationId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a conversation
   * @param {number} conversationId - ID of the conversation to delete
   * @returns {Promise<ConversationActionResponse>} Promise with action response
   */
  deleteConversation: async (conversationId: number): Promise<ConversationActionResponse> => {
    try {
      const response = await axiosInstance.delete(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting conversation ${conversationId}:`, error);
      throw error;
    }
  },

  /**
   * Get unread message count
   * @returns {Promise<{count: number}>} Promise with unread count
   */
  getUnreadCount: async (): Promise<{count: number}> => {
    try {
      const response = await axiosInstance.get('/conversations/unread-count');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  /**
   * Start a new conversation with a match
   * @param {number} matchId - ID of the match
   * @param {string} initialMessage - First message content
   * @returns {Promise<{conversationId: number, message: Message}>} Promise with new conversation data
   */
  startConversation: async (matchId: string, initialMessage?: string): Promise<{conversationId: number, message?: Message}> => {
    try {
      const response = await axiosInstance.post('/conversations', {
        matchId,
        initialMessage
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error starting conversation with match ${matchId}:`, error);
      throw error;
    }
  },
  
  /**
   * Report a conversation for inappropriate content
   * @param {number} conversationId - ID of the conversation to report
   * @param {string} reason - Reason for reporting
   * @param {string} details - Additional details
   * @returns {Promise<ConversationActionResponse>} Promise with action response
   */
  reportConversation: async (
    conversationId: number, 
    reason: string, 
    details?: string
  ): Promise<ConversationActionResponse> => {
    try {
      const response = await axiosInstance.post(`/conversations/${conversationId}/report`, {
        reason,
        details
      });
      return response.data;
    } catch (error) {
      console.error(`Error reporting conversation ${conversationId}:`, error);
      throw error;
    }
  }
};

export default conversationService;