import { useState, useCallback } from 'react';
import { Profile, ValidationResult } from '@/types/profile.type';
import profileService from '@/services/profile.service';
import { validateProfile, prepareProfileData } from '@/utils/schemaValidator';
import toast from 'react-hot-toast';

interface UseProfileApiReturn {
  loading: boolean;
  error: string | null;
  profile: Profile | null;
  validationErrors: string[];
  fetchProfile: () => Promise<Profile | null>;
  createProfile: (data: Record<string, any>) => Promise<Profile | null>;
  updateProfile: (data: Record<string, any>, id: string) => Promise<Profile | null>;
  uploadPhoto: (file: File) => Promise<string | null>;
  deletePhoto: (photoUrl: string) => Promise<boolean>;
  reorderPhotos: (photoUrls: string[]) => Promise<string[] | null>;
  validateData: (data: Record<string, any>) => ValidationResult;
  clearError: () => void;
}

const useProfileApi = (): UseProfileApiReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);


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

  const updateProfile = useCallback(
    async (data: Record<string, any>, id: string): Promise<Profile | null> => {
      try {
        setLoading(true);
        setError(null);
        setValidationErrors([]);
  
        const validation = validateProfile(data);
        if (!validation.isValid) {
          setValidationErrors(validation.errors);
          setLoading(false);
          return null;
        }
  
        const apiData = prepareProfileData(data);
        const updatedProfile = await profileService.updateProfile(apiData, id);
  
        setProfile(updatedProfile);
        setLoading(false);
        return updatedProfile;
      } catch (err) {
        console.error('Error updating profile:', err);
        setError('Failed to update profile. Please try again.');
        setLoading(false);
        return null;
      }
    },
    []
  );
  

  const uploadPhoto = useCallback(async (file: File): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const photoUrl = await profileService.uploadPhoto(file);
      
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
      toast.error('Failed to upload photo. Please try again.');
      setLoading(false);
      return null;
    }
  }, [profile]);

  const deletePhoto = useCallback(async (photoUrl: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await profileService.deletePhoto(photoUrl);
      
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