import { Profile, ValidationResult } from "@/types/profile.type";

// Define schema rules
interface SchemaRule {
  required: boolean;
  type: 'string' | 'number' | 'array' | 'object' | 'boolean';
  min?: number;
  max?: number;
  positive?: boolean;
  length?: number;
}

// Schema that matches the backend Joi schema
const profileSchema: Record<keyof Profile | string, SchemaRule> = {
  name: { required: true, type: 'string' },
  age: { required: false, type: 'number', min: 18 },
  bio: { required: false, type: 'string' },
  location: { required: false, type: 'string' },
  occupation: { required: false, type: 'string' },
  education: { required: false, type: 'string' },
  height: { required: false, type: 'string' },
  photos: { required: false, type: 'array' },
  interests: { required: false, type: 'array' },
  languages: { required: false, type: 'array' },
  lookingFor: { required: false, type: 'string' },
  showMe: { required: false, type: 'string' },
  ageRange: { required: false, type: 'array', length: 2 },
  maxDistance: { required: false, type: 'number', positive: true },
  drinking: { required: false, type: 'string' },
  smoking: { required: false, type: 'string' },
  zodiac: { required: false, type: 'string' },
  instagram: { required: false, type: 'string' },
  spotifyArtists: { required: false, type: 'array' },
  questions: { required: false, type: 'array' }
};

/**
 * Validate profile data against schema
 * @param {Profile} data - Data to validate
 * @returns {ValidationResult} Object with isValid boolean and errors array
 */
export const validateProfile = (data: Partial<Profile>): ValidationResult => {
  const errors: string[] = [];

  // Check each field against schema
  Object.entries(profileSchema).forEach(([field, rules]) => {
    const key = field as keyof Profile;
    const value = data[key as keyof object];
    
    // Check required fields
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      return;
    }

    // Skip validation if field is not present and not required
    if (value === undefined || value === null) {
      return;
    }

    // Type validation
    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} must be a string`);
    }

    if (rules.type === 'number' && typeof value !== 'number') {
      errors.push(`${field} must be a number`);
    }

    // Array validation
    if (rules.type === 'array' && !Array.isArray(value)) {
      errors.push(`${field} must be an array`);
    }

    // Min value for numbers
    if (rules.type === 'number' && rules.min !== undefined && (value as number) < rules.min) {
      errors.push(`${field} must be at least ${rules.min}`);
    }

    // Positive number validation
    if (rules.type === 'number' && rules.positive && (value as number) <= 0) {
      errors.push(`${field} must be positive`);
    }

    // Array length validation
    if (rules.type === 'array' && rules.length && (value as Array<any>).length !== rules.length) {
      errors.push(`${field} must have exactly ${rules.length} items`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Prepare profile data for API submission by ensuring it matches the schema
 * @param {object} userData - User data from form
 * @returns {Profile} Cleaned data object ready for API
 */
export const prepareProfileData = (userData: Record<string, any>): Profile => {
  // Extract only the fields that are in the schema
  const cleanData: Partial<Profile> = {};
  
  Object.keys(profileSchema).forEach(field => {
    if (userData[field] !== undefined) {
      cleanData[field as keyof Profile] = userData[field];
    }
  });
  
  // Ensure name exists as it's required by the schema
  if (!cleanData.name && userData.name) {
    cleanData.name = userData.name;
  }
  
  return cleanData as Profile;
};