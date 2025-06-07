import { useState, useCallback } from 'react';
import { Profile, ValidationResult } from '@/types/profile.type';
import profileService from '@/services/profile.service';
import { validateProfile, prepareProfileData } from '@/utils/schemaValidator';

interface UseProfileApiReturn {
  loading: boolean;
  error: string | null;
  profile: Profile | null;
  validationErrors: string[];
  fetchProfile: () => Promise<Profile | null>;
  createProfile: (data: Record<string, any>) => Promise<Profile | null>;
  updateProfile: (data: Record<string, any>) => Promise<Profile | null>;
  uploadPhoto: (file: File) => Promise<string | null>;
  deletePhoto: (photoUrl: string) => Promise<boolean>;
  reorderPhotos: (photoUrls: string[]) => Promise<string[] | null>;
  validateData: (data: Record<string, any>) => ValidationResult;
  clearError: () => void;
}

/**
 * Custom hook for profile API operations
 */
const useProfileApi = (): UseProfileApiReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Fetch user profile
   */
  const fetchProfile = useCallback(async (): Promise<Profile | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await profileService.getProfile();
      setProfile(data);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
      setLoading(false);
      return null;
    }
  }, []);

  const createProfile = useCallback(async (data: Record<string, any>): Promise<Profile | null> => {
    try {
      setLoading(true);
      setError(null);
      setValidationErrors([]);
      const apiData = prepareProfileData(data);
      
      // Send to API
      const newProfile = await profileService.createProfile(apiData);
      
      setProfile(newProfile);
      setLoading(false);
      return newProfile;
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('Failed to create profile. Please try again.');
      setLoading(false);
      return null;
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (data: Record<string, any>): Promise<Profile | null> => {
    try {
      setLoading(true);
      setError(null);
      setValidationErrors([]);
      
      // Validate data
      const validation = validateProfile(data);
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setLoading(false);
        return null;
      }
      
      // Prepare data for API
      const apiData = prepareProfileData(data);
      
      // Send to API
      const updatedProfile = await profileService.updateProfile(apiData);
      
      setProfile(updatedProfile);
      setLoading(false);
      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      setLoading(false);
      return null;
    }
  }, []);

  /**
   * Upload a photo
   */
  const uploadPhoto = useCallback(async (file: File): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const photoUrl = await profileService.uploadPhoto(file);
      
      // Update local profile state with new photo
      if (profile) {
        const updatedPhotos = [...(profile.photos || []), photoUrl];
        setProfile({
          ...profile,
          photos: updatedPhotos
        });
      }
      
      setLoading(false);
      return photoUrl;
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Failed to upload photo. Please try again.');
      setLoading(false);
      return null;
    }
  }, [profile]);

  /**
   * Delete a photo
   */
  const deletePhoto = useCallback(async (photoUrl: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await profileService.deletePhoto(photoUrl);
      
      // Update local profile state by removing the photo
      if (profile) {
        const updatedPhotos = profile.photos?.filter(url => url !== photoUrl) || [];
        setProfile({
          ...profile,
          photos: updatedPhotos
        });
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('Failed to delete photo. Please try again.');
      setLoading(false);
      return false;
    }
  }, [profile]);

  /**
   * Reorder photos
   */
  const reorderPhotos = useCallback(async (photoUrls: string[]): Promise<string[] | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedPhotoUrls = await profileService.reorderPhotos(photoUrls);
      
      // Update local profile state with reordered photos
      if (profile) {
        setProfile({
          ...profile,
          photos: updatedPhotoUrls
        });
      }
      
      setLoading(false);
      return updatedPhotoUrls;
    } catch (err) {
      console.error('Error reordering photos:', err);
      setError('Failed to reorder photos. Please try again.');
      setLoading(false);
      return null;
    }
  }, [profile]);

  /**
   * Validate profile data
   */
  const validateData = useCallback((data: Record<string, any>): ValidationResult => {
    return validateProfile(data);
  }, []);

  return {
    loading,
    error,
    profile,
    validationErrors,
    fetchProfile,
    createProfile,
    updateProfile,
    uploadPhoto,
    deletePhoto,
    reorderPhotos,
    validateData,
    clearError
  };
};

export default useProfileApi;