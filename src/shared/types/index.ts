/**
 * Archetect Shared Types
 *
 * Core type definitions used across backend, frontend, and extensions
 */

// ============================================================================
// USER TYPES
// ============================================================================

export type SubscriptionTier = 'free' | 'professional' | 'enterprise';

export type OAuthProvider = 'google' | 'github' | 'linkedin';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
  subscriptionTier: SubscriptionTier;
  oauthProvider?: OAuthProvider;
  oauthId?: string;
}

// ============================================================================
// PROFILE TYPES
// ============================================================================

export type ProfileApproach = 'astrological' | 'big_five';

export type DISCType = 'D' | 'I' | 'S' | 'C';

export type ArchetectType =
  | 'Trailblazer'
  | 'Anchor'
  | 'Bridge'
  | 'Seer'
  | 'Builder'
  | 'Connector'
  | 'Strategist'
  | 'Visionary';

export type EnergyStyle = 'Spark' | 'Stone' | 'Signal' | 'Current';

export type FlowMode = 'Initiator' | 'Keeper' | 'Shifter';

export type Season = 'Build' | 'Explore' | 'Connect' | 'Reset';

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';

export type Nakshatra =
  | 'Ashwini' | 'Bharani' | 'Krittika' | 'Rohini' | 'Mrigashira' | 'Ardra'
  | 'Punarvasu' | 'Pushya' | 'Ashlesha' | 'Magha' | 'Purva Phalguni' | 'Uttara Phalguni'
  | 'Hasta' | 'Chitra' | 'Swati' | 'Vishakha' | 'Anuradha' | 'Jyeshtha'
  | 'Mula' | 'Purva Ashadha' | 'Uttara Ashadha' | 'Shravana' | 'Dhanishta' | 'Shatabhisha'
  | 'Purva Bhadrapada' | 'Uttara Bhadrapada' | 'Revati';

// Birth Data
export interface BirthLocation {
  latitude: number;
  longitude: number;
  city: string;
  timezone: string;
}

export interface BirthData {
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM:SS
  birthLocation: BirthLocation;
}

// Astrological Data
export interface PlanetaryPosition {
  sign: ZodiacSign;
  siderealdegree: number;
  nakshatra?: Nakshatra;
  nakshatraRuler?: string;
  modality: Modality;
  element: Element;
}

export interface SiderealData {
  sunSign: PlanetaryPosition;
  moonSign: PlanetaryPosition;
  ascendant: PlanetaryPosition;
  mercurySign: PlanetaryPosition;
  venusSign?: PlanetaryPosition;
  marsSign?: PlanetaryPosition;
  _metadata: {
    ephemerisSource: string;
    ayanamsha: string;
    houseSystem: string;
    computedAt: Date;
  };
}

// Big Five Traits
export interface BigFiveTraits {
  openness: number; // 0-100
  conscientiousness: number; // 0-100
  extraversion: number; // 0-100
  agreeableness: number; // 0-100
  neuroticism: number; // 0-100
}

export interface QuestionnaireResponse {
  itemId: number;
  value: number; // 1-5 Likert scale
}

// DISC Profile
export interface DISCProfile {
  primaryType: DISCType;
  secondaryType?: DISCType;
  blendDescription: string;
  percentileScores: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
}

// Communication Style
export interface CommunicationStyle {
  pace: string;
  preference: string;
  strengths: string[];
  challenges: string[];
}

// Meeting Prep Tips
export interface MeetingPrepTips {
  withDTypes: string;
  withITypes: string;
  withSTypes: string;
  withCTypes: string;
}

// Complete Profile
export interface Profile {
  id: string;
  userId: string;
  approach: ProfileApproach;

  // Astrological approach data
  birthData?: BirthData;
  siderealData?: SiderealData;

  // Big Five approach data
  bigFiveTraits?: BigFiveTraits;
  questionnaireResponses?: QuestionnaireResponse[];

  // Common output (both approaches)
  personalityType: string; // DISC type or Archetect Type
  energyStyle?: EnergyStyle;
  flowMode?: FlowMode;
  seasonName?: Season;
  seasonNumber?: number; // 1-9

  communicationStyle: CommunicationStyle;
  disciplineType?: string; // Nakshatra-based or Season-based
  workEnvironmentFit: string[];
  meetingPrep?: MeetingPrepTips;

  confidenceScore: number; // 0-1

  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TEAM & COMPATIBILITY TYPES
// ============================================================================

export interface TeamMember {
  userId: string;
  profileId: string;
  name: string;
  email: string;
  personalityType: string;
  energyStyle?: EnergyStyle;
  role?: string;
}

export interface CompatibilityScore {
  user1Id: string;
  user2Id: string;
  score: number; // 0-1
  complementarity: string;
  recommendations: string[];
  calculatedAt: Date;
}

export interface TeamCompatibilityMatrix {
  teamId: string;
  members: TeamMember[];
  compatibilityScores: CompatibilityScore[];
  overallTeamScore: number;
  insights: string[];
}

// ============================================================================
// INTEGRATION TYPES
// ============================================================================

export type CRMType = 'hubspot' | 'salesforce' | 'pipedrive';

export interface CRMIntegration {
  id: string;
  userId: string;
  crmType: CRMType;
  accessToken: string;
  refreshToken: string;
  syncEnabled: boolean;
  lastSyncAt?: Date;
  createdAt: Date;
}

export interface CRMContact {
  externalId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  linkedInUrl?: string;
  profileId?: string;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

// Profile Creation Requests
export interface CreateProfileFromBirthDataRequest {
  birthData: BirthData;
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateProfileFromQuestionnaireRequest {
  responses: QuestionnaireResponse[];
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Profile Response
export interface ProfileResponse {
  success: boolean;
  profileId: string;
  personalityType: string;
  communicationStyle: CommunicationStyle;
  energyStyle?: EnergyStyle;
  flowMode?: FlowMode;
  disciplineType?: string;
  createdAt: Date;
}

// Compatibility Request
export interface CalculateCompatibilityRequest {
  user1Id: string;
  user2Id: string;
}

// Error Response
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// ============================================================================
// CHROME EXTENSION TYPES
// ============================================================================

export interface LinkedInProfile {
  url: string;
  name: string;
  headline?: string;
  location?: string;
  email?: string;
}

export interface PersonalityCardData {
  name: string;
  personalityType: string;
  energyStyle?: EnergyStyle;
  communicationTips: string[];
  strengths: string[];
  inTeam: boolean;
}

// ============================================================================
// QUESTIONNAIRE TYPES
// ============================================================================

export interface QuestionnaireItem {
  id: number;
  text: string;
  trait: keyof BigFiveTraits;
  reverse: boolean; // True if item is reverse-scored
}

export interface Questionnaire {
  id: string;
  version: string;
  items: QuestionnaireItem[];
  estimatedTimeMinutes: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Timestamp = Date | string;

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
