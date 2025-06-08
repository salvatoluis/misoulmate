import axiosInstance from "./axiosInstance";

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
  getRecommendations: async (filters?: RecommendationFilters): Promise<RecommendationsResponse> => {
    try {
      const response = await axiosInstance.get('/recommendations', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },
  getRecommendationById: async (recommendationId: string): Promise<Recommendation> => {
    try {
      const response = await axiosInstance.get(`/recommendations/${recommendationId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching recommendation ${recommendationId}:`, error);
      throw error;
    }
  },

  likeProfile: async (recommendationId: string): Promise<RecommendationActionResponse> => {
    try {
      const response = await axiosInstance.post(`/recommendations/${recommendationId}/like`);
      return response.data;
    } catch (error) {
      console.error(`Error liking recommendation ${recommendationId}:`, error);
      throw error;
    }
  },

  superLikeProfile: async (recommendationId: string): Promise<RecommendationActionResponse> => {
    try {
      const response = await axiosInstance.post(`/recommendations/${recommendationId}/superlike`);
      return response.data;
    } catch (error) {
      console.error(`Error super-liking recommendation ${recommendationId}:`, error);
      throw error;
    }
  },

  passProfile: async (recommendationId: string): Promise<RecommendationActionResponse> => {
    try {
      const response = await axiosInstance.post(`/recommendations/${recommendationId}/pass`);
      return response.data;
    } catch (error) {
      console.error(`Error passing on recommendation ${recommendationId}:`, error);
      throw error;
    }
  },

  superLikeRecommendation: async (recommendationId: number): Promise<RecommendationActionResponse> => {
    try {
      const response = await axiosInstance.post(`/recommendations/${recommendationId}/superlike`);
      return response.data;
    } catch (error) {
      console.error(`Error super-liking recommendation ${recommendationId}:`, error);
      throw error;
    }
  },

  getCompatibleInterests: async (): Promise<string[]> => {
    try {
      const response = await axiosInstance.get('/recommendations/interests');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching compatible interests:', error);
      throw error;
    }
  },

  updatePreferences: async (preferences: any): Promise<RecommendationActionResponse> => {
    try {
      const response = await axiosInstance.put('/user/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating recommendation preferences:', error);
      throw error;
    }
  },

  refreshRecommendations: async (): Promise<RecommendationsResponse> => {
    try {
      const response = await axiosInstance.post('/recommendations/refresh');
      return response.data;
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      throw error;
    }
  },

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