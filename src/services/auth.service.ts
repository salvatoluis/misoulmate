import axiosInstance from "./axiosInstance";

interface RegisterData {
  email: string;
  password: string;
  profile: {
    name: string;
    age?: number;
    bio?: string;
    location?: string;
    photos?: string[];
    interests?: string[];
    languages?: string[];
    lookingFor?: string;
    showMe?: string;
    ageRange?: [number, number];
    maxDistance?: number;
    questions?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    profile?: {
      name: string;
      isComplete: boolean;
    };
  };
}

interface ResetPasswordData {
  email: string;
}

interface UpdatePasswordData {
  resetToken: string;
  newPassword: string;
}

const authService = {
  /**
   * Register a new user
   * @param {RegisterData} userData - User registration data
   * @returns {Promise<AuthResponse>} Promise with auth token and user data
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  /**
   * Login an existing user
   * @param {LoginData} credentials - User login credentials
   * @returns {Promise<AuthResponse>} Promise with auth token and user data
   */
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  /**
   * Logout the current user
   */
  logout: (): void => {
    localStorage.removeItem('authToken');
    // You can also make an API call to invalidate the token on the server
    // await axiosInstance.post('/auth/logout');
  },

  /**
   * Check if user is logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Get the current authentication token
   * @returns {string|null} Auth token or null if not logged in
   */
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  /**
   * Request password reset
   * @param {ResetPasswordData} data - Password reset data
   * @returns {Promise<{success: boolean, message: string}>} Promise with result
   */
  requestPasswordReset: async (data: ResetPasswordData): Promise<{success: boolean, message: string}> => {
    try {
      const response = await axiosInstance.post('/auth/request-reset', data);
      return response.data;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  /**
   * Reset password with token
   * @param {UpdatePasswordData} data - New password data with reset token
   * @returns {Promise<{success: boolean, message: string}>} Promise with result
   */
  resetPassword: async (data: UpdatePasswordData): Promise<{success: boolean, message: string}> => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  /**
   * Register with OAuth provider
   * @param {string} provider - OAuth provider (e.g., 'google', 'apple')
   * @param {string} token - OAuth token
   * @returns {Promise<AuthResponse>} Promise with auth token and user data
   */
  oauthRegister: async (provider: string, token: string): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post(`/auth/${provider}`, { token });
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error(`Error during ${provider} registration:`, error);
      throw error;
    }
  },

  /**
   * Verify email address
   * @param {string} token - Email verification token
   * @returns {Promise<{success: boolean, message: string}>} Promise with result
   */
  verifyEmail: async (token: string): Promise<{success: boolean, message: string}> => {
    try {
      const response = await axiosInstance.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  },

  /**
   * Resend verification email
   * @returns {Promise<{success: boolean, message: string}>} Promise with result
   */
  resendVerification: async (): Promise<{success: boolean, message: string}> => {
    try {
      const response = await axiosInstance.post('/auth/resend-verification');
      return response.data;
    } catch (error) {
      console.error('Error resending verification:', error);
      throw error;
    }
  }
};

export default authService;