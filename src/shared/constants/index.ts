/**
 * Archetect Shared Constants
 *
 * Constants used across the application
 */

import type { DISCType, ArchetectType, EnergyStyle, FlowMode, Season, Modality, Element } from '../types';

// ============================================================================
// PERSONALITY TYPE CONSTANTS
// ============================================================================

export const DISC_TYPES: DISCType[] = ['D', 'I', 'S', 'C'];

export const ARCHETECT_TYPES: ArchetectType[] = [
  'Architect',
  'Maverick',
  'Sage',
];

export const ENERGY_STYLES: EnergyStyle[] = [
  'Energetic',
  'Focused',
  'Balanced',
];

export const FLOW_MODES: FlowMode[] = [
  'Structured',
  'Deep Work',
  'Exploration',
  'Collaboration',
];

export const SEASONS: Season[] = [
  'Spring',
  'Summer',
  'Autumn',
  'Winter',
];

export const MODALITIES: Modality[] = ['Cardinal', 'Fixed', 'Mutable'];

export const ELEMENTS: Element[] = ['Fire', 'Earth', 'Air', 'Water'];

// ============================================================================
// TRANSFORMATION MAPPINGS
// ============================================================================

/**
 * Modality to DISC Primary Type Mapping (Approach 1)
 */
export const MODALITY_TO_DISC: Record<Modality, DISCType> = {
  Cardinal: 'D', // Initiators, leaders
  Fixed: 'C',    // Direction-focused, stable
  Mutable: 'I',  // Adaptable, flexible (could also be 'S')
};

/**
 * Element to DISC Refinement Mapping (Approach 1)
 */
export const ELEMENT_INFLUENCE: Record<Element, string> = {
  Fire: 'Intensifies D, adds speed and passion to I',
  Earth: 'Enhances C, adds stability and detail to S',
  Air: 'Enhances I, adds logic and collaboration to C',
  Water: 'Enhances S, adds empathy and depth to I',
};

/**
 * DISC Weighted Scoring Algorithm Weights (Approach 1)
 */
export const DISC_WEIGHTS = {
  MODALITY: 0.40,
  ELEMENT: 0.25,
  MERCURY: 0.20,
  ASCENDANT: 0.15,
};

// ============================================================================
// BIG FIVE CONSTANTS
// ============================================================================

/**
 * Big Five Trait Names
 */
export const BIG_FIVE_TRAITS = {
  OPENNESS: 'openness',
  CONSCIENTIOUSNESS: 'conscientiousness',
  EXTRAVERSION: 'extraversion',
  AGREEABLENESS: 'agreeableness',
  NEUROTICISM: 'neuroticism',
} as const;

/**
 * Trait Score Ranges
 */
export const TRAIT_RANGES = {
  MIN: 0,
  MAX: 100,
  LOW_THRESHOLD: 33,
  MEDIUM_THRESHOLD: 66,
};

// ============================================================================
// SUBSCRIPTION TIERS
// ============================================================================

export const SUBSCRIPTION_LIMITS = {
  free: {
    profilesPerMonth: 5,
    teamMembers: 3,
    integrationsAllowed: 0,
    apiCallsPerDay: 100,
  },
  professional: {
    profilesPerMonth: -1, // unlimited
    teamMembers: 50,
    integrationsAllowed: 5,
    apiCallsPerDay: 10000,
  },
  enterprise: {
    profilesPerMonth: -1, // unlimited
    teamMembers: -1, // unlimited
    integrationsAllowed: -1, // unlimited
    apiCallsPerDay: -1, // unlimited
  },
};

export const SUBSCRIPTION_PRICES = {
  free: 0,
  professional: 39,
  enterprise: 500,
};

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_ENDPOINTS = {
  // Profiles
  CREATE_PROFILE: '/api/v1/profiles/create',
  GET_PROFILE: '/api/v1/profiles/:id',
  UPDATE_PROFILE: '/api/v1/profiles/:id',
  DELETE_PROFILE: '/api/v1/profiles/:id',

  // Compatibility
  CALCULATE_COMPATIBILITY: '/api/v1/compatibility/calculate',
  GET_TEAM_COMPATIBILITY: '/api/v1/compatibility/team/:teamId',

  // Communication
  GET_COMMUNICATION_TIPS: '/api/v1/communication-tips/:type',
  GET_MEETING_PREP: '/api/v1/meeting-prep',

  // Enrichment
  ENRICH_PROFILE: '/api/v1/enrichment/enrich',

  // Auth
  LOGIN: '/api/v1/auth/login',
  SIGNUP: '/api/v1/auth/signup',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH: '/api/v1/auth/refresh',

  // CRM
  CONNECT_CRM: '/api/v1/crm/connect',
  SYNC_CRM: '/api/v1/crm/sync',
  DISCONNECT_CRM: '/api/v1/crm/disconnect',
};

export const API_RATE_LIMITS = {
  free: 100, // requests per minute
  professional: 1000,
  enterprise: -1, // unlimited
};

// ============================================================================
// PERFORMANCE TARGETS
// ============================================================================

export const PERFORMANCE_TARGETS = {
  PROFILE_GENERATION_MS: 2000,
  API_RESPONSE_P95_MS: 500,
  TEAM_COMPATIBILITY_MS: 1000,
  EXTENSION_LOAD_MS: 1000,
};

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  BIRTH_DATE_MIN_YEAR: 1900,
  BIRTH_DATE_MAX_YEAR: new Date().getFullYear(),
  LATITUDE_MIN: -90,
  LATITUDE_MAX: 90,
  LONGITUDE_MIN: -180,
  LONGITUDE_MAX: 180,
};

// ============================================================================
// ERROR CODES
// ============================================================================

export const ERROR_CODES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_BIRTH_DATA: 'INVALID_BIRTH_DATA',
  INVALID_QUESTIONNAIRE: 'INVALID_QUESTIONNAIRE',

  // Profile
  PROFILE_NOT_FOUND: 'PROFILE_NOT_FOUND',
  PROFILE_GENERATION_FAILED: 'PROFILE_GENERATION_FAILED',

  // Subscription
  SUBSCRIPTION_LIMIT_REACHED: 'SUBSCRIPTION_LIMIT_REACHED',
  SUBSCRIPTION_INVALID: 'SUBSCRIPTION_INVALID',

  // Integration
  INTEGRATION_CONNECTION_FAILED: 'INTEGRATION_CONNECTION_FAILED',
  INTEGRATION_SYNC_FAILED: 'INTEGRATION_SYNC_FAILED',

  // Server
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
};

// ============================================================================
// NAKSHATRA CONSTANTS
// ============================================================================

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
] as const;

/**
 * Nakshatra to Discipline Type Mapping
 * Maps each of the 27 Nakshatras to a work archetype
 */
export const NAKSHATRA_DISCIPLINE_TYPES: Record<string, string> = {
  Ashwini: 'Pioneer',
  Bharani: 'Transformer',
  Krittika: 'Refiner',
  Rohini: 'Creator',
  Mrigashira: 'Seeker',
  Ardra: 'Disruptor',
  Punarvasu: 'Renewer',
  Pushya: 'Nurturing Builder',
  Ashlesha: 'Strategic Thinker',
  Magha: 'Leader',
  'Purva Phalguni': 'Enjoyer',
  'Uttara Phalguni': 'Organizer',
  Hasta: 'Craftsman',
  Chitra: 'Architect',
  Swati: 'Independent',
  Vishakha: 'Goal-Oriented',
  Anuradha: 'Devotee',
  Jyeshtha: 'Protector',
  Mula: 'Investigator',
  'Purva Ashadha': 'Invincible',
  'Uttara Ashadha': 'Victor',
  Shravana: 'Listener',
  Dhanishta: 'Achiever',
  Shatabhisha: 'Healer',
  'Purva Bhadrapada': 'Idealist',
  'Uttara Bhadrapada': 'Compassionate',
  Revati: 'Nourisher',
};

// ============================================================================
// ASTROLOGY CONSTANTS
// ============================================================================

export const AYANAMSHA = 'lahiri'; // Standard for Vedic astrology

export const HOUSE_SYSTEM = 'placidus'; // Default house system

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

// ============================================================================
// CACHE KEYS
// ============================================================================

export const CACHE_KEYS = {
  PROFILE: (id: string) => `profile:${id}`,
  USER: (id: string) => `user:${id}`,
  COMPATIBILITY: (user1: string, user2: string) => `compatibility:${user1}:${user2}`,
  TEAM: (teamId: string) => `team:${teamId}`,
};

export const CACHE_TTL = {
  PROFILE: 3600, // 1 hour
  USER: 1800, // 30 minutes
  COMPATIBILITY: 7200, // 2 hours
  TEAM: 3600, // 1 hour
};
