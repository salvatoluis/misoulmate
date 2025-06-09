import axiosInstance from "./axiosInstance";

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

  getConversationById: async (conversationId: number): Promise<Conversation> => {
    try {
      const response = await axiosInstance.get(`/conversations/${conversationId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching conversation ${conversationId}:`, error);
      throw error;
    }
  },

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

  markAsRead: async (conversationId: number): Promise<ConversationActionResponse> => {
    try {
      const response = await axiosInstance.put(`/conversations/${conversationId}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking conversation ${conversationId} as read:`, error);
      throw error;
    }
  },

  archiveConversation: async (conversationId: number): Promise<ConversationActionResponse> => {
    try {
      const response = await axiosInstance.put(`/conversations/${conversationId}/archive`);
      return response.data;
    } catch (error) {
      console.error(`Error archiving conversation ${conversationId}:`, error);
      throw error;
    }
  },

  deleteConversation: async (conversationId: number): Promise<ConversationActionResponse> => {
    try {
      const response = await axiosInstance.delete(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting conversation ${conversationId}:`, error);
      throw error;
    }
  },

  getUnreadCount: async (): Promise<{count: number}> => {
    try {
      const response = await axiosInstance.get('/conversations/unread-count');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  startConversation: async (matchId: string, initialMessage?: string): Promise<{conversationId: number, message?: Message}> => {
    try {
      const response = await axiosInstance.post(`/messages/matches/${matchId}`, {
        matchId,
        content: initialMessage || "Let's chat!"
      });
      return response.data;
    } catch (error) {
      console.error(`Error starting conversation with match ${matchId}:`, error);
      throw error;
    }
  },

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