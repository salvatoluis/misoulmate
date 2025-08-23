import { ApiResponse, Profile, ProfileSettings } from '@/types/profile.type';
import axiosInstance from './axiosInstance';
import { handleError } from '@/utils/handleError';

const profileService = {
  getProfile: async (): Promise<Profile> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Profile>>(
        "/profiles/me"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  blockUser: async (userId: string): Promise<any> => {
    try {
      const response = await axiosInstance.post(`/block/users/${userId}/block`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getProfileViews: async () => {
    try {
      const response = await axiosInstance.get(
        "/profile-views/me/profile-views"
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getProfileViewsCount: async (profileId: string) => {
    try {
      const response = await axiosInstance.get(
        `/profile-views/profiles/${profileId}/views/count`
      );
      return response.data.count;
    } catch (error) {
      handleError(error);
    }
  },

  unblockUser: async (userId: string) => {
    try {
      await axiosInstance.delete(`/block/users/${userId}/block`);
      return true;
    } catch (error) {
      handleError(error);
    }
  },

  getBlockedUsers: async () => {
    try {
      const response = await axiosInstance.get("/block/blocked-users");
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  createProfile: async (profileData: Profile): Promise<Profile> => {
    try {
      const response = await axiosInstance.post<ApiResponse<Profile>>(
        "/profiles",
        profileData
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  },

  updateProfile: async (profileData: any, id: string): Promise<any> => {
    try {
      const response = await axiosInstance.patch<ApiResponse<Profile>>(
        `/profiles/${id}`,
        profileData
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  uploadPhoto: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await axiosInstance.post<ApiResponse<{ url: string }>>(
        "/profile/photos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data.url;
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw error;
    }
  },

  deletePhoto: async (photoUrl: string): Promise<boolean> => {
    try {
      await axiosInstance.delete("/profile/photos", {
        data: { photoUrl },
      });
      return true;
    } catch (error) {
      console.error("Error deleting photo:", error);
      throw error;
    }
  },

  reorderPhotos: async (photoUrls: string[]): Promise<string[]> => {
    try {
      const response = await axiosInstance.put<
        ApiResponse<{ photos: string[] }>
      >("/profile/photos/reorder", {
        photos: photoUrls,
      });
      return response.data.data.photos;
    } catch (error) {
      console.error("Error reordering photos:", error);
      throw error;
    }
  },

  updateSettings: async (
    settings: ProfileSettings
  ): Promise<ProfileSettings> => {
    try {
      const response = await axiosInstance.put<ApiResponse<ProfileSettings>>(
        "/profile/settings",
        settings
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  },
};

export default profileService;