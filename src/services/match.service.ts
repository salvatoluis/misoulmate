import axiosInstance from "./axiosInstance";

interface Match {
  id: number;
  name: string;
  age: number;
  location: string;
  distance: number;
  matchPercentage: number;
  bio: string;
  photos: string[];
  interests: string[];
  lastActive: string;
  occupation: string;
}

interface MatchesResponse {
  data: Match[];
  total: number;
  page: number;
  limit: number;
}

interface MatchFilters {
  ageRange?: [number, number];
  distance?: number;
  interests?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'matchPercentage' | 'distance' | 'lastActive';
  sortOrder?: 'asc' | 'desc';
}

interface MatchActionResponse {
  success: boolean;
  message: string;
}

interface ConversationMessage {
  id: number;
  matchId: number;
  senderId: number;
  recipientId: number;
  content: string;
  timestamp: string;
  read: boolean;
}

interface ConversationResponse {
  data: ConversationMessage[];
  matchDetails: {
    id: number;
    name: string;
    photo: string;
    lastActive: string;
  };
}

const matchService = {
  getMatches: async (filters?: MatchFilters): Promise<MatchesResponse> => {
    try {
      const response = await axiosInstance.get('/matches', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  },

  getMatchById: async (matchId: number): Promise<Match> => {
    try {
      const response = await axiosInstance.get(`/matches/${matchId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching match ${matchId}:`, error);
      throw error;
    }
  },

  likeMatch: async (matchId: number): Promise<MatchActionResponse> => {
    try {
      const response = await axiosInstance.post(`/matches/${matchId}/like`);
      return response.data;
    } catch (error) {
      console.error(`Error liking match ${matchId}:`, error);
      throw error;
    }
  },

  passMatch: async (matchId: number): Promise<MatchActionResponse> => {
    try {
      const response = await axiosInstance.post(`/matches/${matchId}/pass`);
      return response.data;
    } catch (error) {
      console.error(`Error passing on match ${matchId}:`, error);
      throw error;
    }
  },

  /**
   * Unmatch with an existing match
   * @param {number} matchId - ID of the match to unmatch
   * @returns {Promise<MatchActionResponse>} Promise with action response
   */
  unmatch: async (matchId: number): Promise<MatchActionResponse> => {
    try {
      const response = await axiosInstance.delete(`/matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.error(`Error unmatching with ${matchId}:`, error);
      throw error;
    }
  },

  getConversation: async (matchId: number, page: number = 1, limit: number = 20): Promise<ConversationResponse> => {
    try {
      const response = await axiosInstance.get(`/matches/${matchId}/conversation`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching conversation with match ${matchId}:`, error);
      throw error;
    }
  },

  sendMessage: async (matchId: number, content: string): Promise<ConversationMessage> => {
    try {
      const response = await axiosInstance.post(`/matches/${matchId}/message`, { content });
      return response.data.data;
    } catch (error) {
      console.error(`Error sending message to match ${matchId}:`, error);
      throw error;
    }
  },

  markConversationAsRead: async (matchId: number): Promise<MatchActionResponse> => {
    try {
      const response = await axiosInstance.put(`/matches/${matchId}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking conversation as read for match ${matchId}:`, error);
      throw error;
    }
  },

  getAllInterests: async (): Promise<string[]> => {
    try {
      const response = await axiosInstance.get('/interests');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching interests:', error);
      throw error;
    }
  },

  reportMatch: async (matchId: number, reason: string, details?: string): Promise<MatchActionResponse> => {
    try {
      const response = await axiosInstance.post(`/matches/${matchId}/report`, {
        reason,
        details
      });
      return response.data;
    } catch (error) {
      console.error(`Error reporting match ${matchId}:`, error);
      throw error;
    }
  },

  blockMatch: async (matchId: number): Promise<MatchActionResponse> => {
    try {
      const response = await axiosInstance.post(`/matches/${matchId}/block`);
      return response.data;
    } catch (error) {
      console.error(`Error blocking match ${matchId}:`, error);
      throw error;
    }
  },

  getRecommendations: async (filters?: any): Promise<any> => {
    try {
      const response = await axiosInstance.get('/recommendations', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },
};

export default matchService;