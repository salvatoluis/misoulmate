export interface ProfileQuestion {
    question: string;
    answer: string;
  }
  
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
    gender?: string;
    subscription?: string;
  }
  
  export interface ExtendedProfile extends Profile {
    notifications?: boolean;
    subscription?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
    gender?: string;

  }
  
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
    [key: string]: any;
  }
  
  export interface ProfileSettings {
    notifications?: boolean;
    lookingFor?: string;
    showMe?: string;
    ageRange?: [number, number];
    maxDistance?: number;
    [key: string]: any;
  }
  
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
  }
  
  export interface ValidationResult {
    isValid: boolean;
    errors: string[];
  }