import { ApiResponse, Profile, ProfileSettings } from '@/types/profile.type';
import axiosInstance from './axiosInstance';

const profileService = {
  getProfile: async (): Promise<Profile> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Profile>>('/profiles/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  createProfile: async (profileData: Profile): Promise<Profile> => {
    try {
      const response = await axiosInstance.post<ApiResponse<Profile>>('/profiles', profileData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  updateProfile: async (profileData: any, id: string): Promise<any> => {
    try {
      const response = await axiosInstance.patch<ApiResponse<Profile>>(`/profiles/${id}`, profileData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  uploadPhoto: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await axiosInstance.post<ApiResponse<{url: string}>>('/profile/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.url;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  },

  deletePhoto: async (photoUrl: string): Promise<boolean> => {
    try {
      await axiosInstance.delete('/profile/photos', {
        data: { photoUrl }
      });
      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  },

  reorderPhotos: async (photoUrls: string[]): Promise<string[]> => {
    try {
      const response = await axiosInstance.put<ApiResponse<{photos: string[]}>>('/profile/photos/reorder', { 
        photos: photoUrls 
      });
      return response.data.data.photos;
    } catch (error) {
      console.error('Error reordering photos:', error);
      throw error;
    }
  },

  updateSettings: async (settings: ProfileSettings): Promise<ProfileSettings> => {
    try {
      const response = await axiosInstance.put<ApiResponse<ProfileSettings>>('/profile/settings', settings);
      return response.data.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
};

export default profileService;