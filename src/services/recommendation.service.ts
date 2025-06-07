import axiosInstance from "./axiosInstance";

// Define basic types for the recommendation service
interface Recommendation {
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

interface RecommendationsResponse {
  data: Recommendation[];
  total: number;
  page: number;
  limit: number;
}

interface RecommendationFilters {
  ageRange?: [number, number];
  distance?: number;
  interests?: string[];
  page?: number;
  limit?: number;
}

interface RecommendationActionResponse {
  success: boolean;
  message: string;
}

const recommendationService = {
  /**
   * Get recommended potential matches
   * @param {RecommendationFilters} filters - Optional filters for recommendations
   * @returns {Promise<RecommendationsResponse>} Promise with recommendation data
   */
  getRecommendations: async (filters?: RecommendationFilters): Promise<RecommendationsResponse> => {
    try {
      const response = await axiosInstance.get('/recommendations', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  /**
   * Get a single recommendation by ID
   * @param {number} recommendationId - ID of the recommendation to retrieve
   * @returns {Promise<Recommendation>} Promise with recommendation data
   */
  getRecommendationById: async (recommendationId: number): Promise<Recommendation> => {
    try {
      const response = await axiosInstance.get(`/recommendations/${recommendationId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching recommendation ${recommendationId}:`, error);
      throw error;
    }
  },

  /**
   * Like a recommendation (potential match)
   * @param {number} recommendationId - ID of the recommendation to like
   * @returns {Promise<RecommendationActionResponse>} Promise with action response
   */
  likeRecommendation: async (recommendationId: number): Promise<RecommendationActionResponse> => {
    try {
      const response = await axiosInstance.post(`/recommendations/${recommendationId}/like`);
      return response.data;
    } catch (error) {
      console.error(`Error liking recommendation ${recommendationId}:`, error);
      throw error;
    }
  },

  /**
   * Pass on a recommendation (potential match)
   * @param {number} recommendationId - ID of the recommendation to pass on
   * @returns {Promise<RecommendationActionResponse>} Promise with action response
   */
  passRecommendation: async (recommendationId: number): Promise<RecommendationActionResponse> => {
    try {
      const response = await axiosInstance.post(`/recommendations/${recommendationId}/pass`);
      return response.data;
    } catch (error) {
      console.error(`Error passing on recommendation ${recommendationId}:`, error);
      throw error;
    }
  },

  /**
   * Super-like a recommendation (premium feature)
   * @param {number} recommendationId - ID of the recommendation to super-like
   * @returns {Promise<RecommendationActionResponse>} Promise with action response
   */
  superLikeRecommendation: async (recommendationId: number): Promise<RecommendationActionResponse> => {
    try {
      const response = await axiosInstance.post(`/recommendations/${recommendationId}/superlike`);
      return response.data;
    } catch (error) {
      console.error(`Error super-liking recommendation ${recommendationId}:`, error);
      throw error;
    }
  },

  /**
   * Get compatible interests based on user profile
   * @returns {Promise<string[]>} Promise with array of compatible interests
   */
  getCompatibleInterests: async (): Promise<string[]> => {
    try {
      const response = await axiosInstance.get('/recommendations/interests');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching compatible interests:', error);
      throw error;
    }
  },

  /**
   * Update recommendation preferences
   * @param {object} preferences - User preferences for recommendations
   * @returns {Promise<RecommendationActionResponse>} Promise with action response
   */
  updatePreferences: async (preferences: any): Promise<RecommendationActionResponse> => {
    try {
      const response = await axiosInstance.put('/user/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating recommendation preferences:', error);
      throw error;
    }
  },

  /**
   * Refresh recommendations
   * @returns {Promise<RecommendationsResponse>} Promise with fresh recommendations
   */
  refreshRecommendations: async (): Promise<RecommendationsResponse> => {
    try {
      const response = await axiosInstance.post('/recommendations/refresh');
      return response.data;
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      throw error;
    }
  },

  /**
   * Report a recommendation for inappropriate content
   * @param {number} recommendationId - ID of the recommendation to report
   * @param {string} reason - Reason for reporting
   * @param {string} details - Additional details
   * @returns {Promise<RecommendationActionResponse>} Promise with action response
   */
  reportRecommendation: async (
    recommendationId: number, 
    reason: string, 
    details?: string
  ): Promise<RecommendationActionResponse> => {
    try {
      const response = await axiosInstance.post(`/recommendations/${recommendationId}/report`, {
        reason,
        details
      });
      return response.data;
    } catch (error) {
      console.error(`Error reporting recommendation ${recommendationId}:`, error);
      throw error;
    }
  }
};

export default recommendationService;