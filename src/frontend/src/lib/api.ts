import { apiClient } from './api-client';
import type {
  User,
  Profile,
  BigFiveTrait,
  ArchetectType,
  EnergyStyle,
  FlowMode,
  Season,
} from '@archetect/shared/types';

// Auth API
export const authApi = {
  signup: async (data: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/logout', { refreshToken });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  },
};

// Profile API
export const profileApi = {
  getQuestionnaire: async () => {
    const response = await apiClient.get('/profiles/questionnaire');
    return response.data;
  },

  createProfile: async (responses: { questionId: string; response: number }[]) => {
    const response = await apiClient.post('/profiles', { responses });
    return response.data;
  },

  getMyProfile: async () => {
    const response = await apiClient.get('/profiles/me');
    return response.data;
  },

  getProfile: async (id: string) => {
    const response = await apiClient.get(`/profiles/${id}`);
    return response.data;
  },

  updateProfile: async (
    id: string,
    responses: { questionId: string; response: number }[]
  ) => {
    const response = await apiClient.put(`/profiles/${id}`, { responses });
    return response.data;
  },

  deleteProfile: async (id: string) => {
    const response = await apiClient.delete(`/profiles/${id}`);
    return response.data;
  },
};

// Compatibility API
export const compatibilityApi = {
  calculatePair: async (profile1Id: string, profile2Id: string) => {
    const response = await apiClient.post('/compatibility/pair', {
      profile1Id,
      profile2Id,
    });
    return response.data;
  },

  calculateTeam: async (profileIds: string[]) => {
    const response = await apiClient.post('/compatibility/team', {
      profileIds,
    });
    return response.data;
  },
};

// Types for API responses
export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: Profile;
}

export interface QuestionnaireResponse {
  success: boolean;
  data: {
    items: QuestionnaireItem[];
    totalItems: number;
  };
}

export interface QuestionnaireItem {
  id: string;
  trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  text: string;
  reversed: boolean;
}

export interface CompatibilityResponse {
  success: boolean;
  data: {
    profile1Id: string;
    profile2Id: string;
    compatibilityScore: number;
    archetypeCompatibility: number;
    energyCompatibility: number;
    flowCompatibility: number;
    complementarity: string;
    workingStyle: string;
    communicationTips: string[];
    potentialChallenges: string[];
    strengths: string[];
  };
}

export interface TeamCompatibilityResponse {
  success: boolean;
  data: {
    averageCompatibility: number;
    pairwiseScores: CompatibilityResponse['data'][];
    teamDynamics: string;
    recommendations: string[];
  };
}
