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
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  login: async (credentials: LoginData): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  requestPasswordReset: async (data: ResetPasswordData): Promise<{success: boolean, message: string}> => {
    try {
      const response = await axiosInstance.post('/auth/request-reset', data);
      return response.data;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  resetPassword: async (data: UpdatePasswordData): Promise<{success: boolean, message: string}> => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  oauthRegister: async (provider: string, token: string): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post(`/auth/${provider}`, { token });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error(`Error during ${provider} registration:`, error);
      throw error;
    }
  },

  verifyEmail: async (token: string): Promise<{success: boolean, message: string}> => {
    try {
      const response = await axiosInstance.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  },

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