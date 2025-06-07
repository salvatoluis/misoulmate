// Question interface for profile questions
export interface ProfileQuestion {
    question: string;
    answer: string;
  }
  
  // Main profile interface that matches the backend schema
  export interface Profile {
    id?: string;
    name: string;
    age?: number;
    bio?: string;
    location?: string;
    occupation?: string;
    education?: string;
    height?: string;
    photos?: string[];
    interests?: string[];
    languages?: string[];
    lookingFor?: string;
    showMe?: string;
    ageRange?: [number, number];
    maxDistance?: number;
    drinking?: string;
    smoking?: string;
    zodiac?: string;
    instagram?: string;
    spotifyArtists?: string[];
    questions?: ProfileQuestion[];
  }
  
  // Extended profile interface with UI-specific fields
  export interface ExtendedProfile extends Profile {
    notifications?: boolean;
    subscription?: string;
  }
  
  // Form data interface for editing profile
  export interface ProfileFormData {
    name?: string;
    age?: number;
    bio?: string;
    location?: string;
    occupation?: string;
    education?: string;
    interests?: string[];
    languages?: string[];
    height?: string;
    drinking?: string;
    smoking?: string;
    zodiac?: string;
    questions?: ProfileQuestion[];
    [key: string]: any; // Allow dynamic property access
  }
  
  // Settings interface
  export interface ProfileSettings {
    notifications?: boolean;
    lookingFor?: string;
    showMe?: string;
    ageRange?: [number, number];
    maxDistance?: number;
    [key: string]: any;
  }
  
  // API response types
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
  }
  
  // Validation result interface
  export interface ValidationResult {
    isValid: boolean;
    errors: string[];
  }