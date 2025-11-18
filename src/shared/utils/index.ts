/**
 * Archetect Shared Utilities
 *
 * Common utility functions used across the application
 */

import { VALIDATION, TRAIT_RANGES } from '../constants';
import type { BigFiveTraits } from '../types';

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  return (
    password.length >= VALIDATION.PASSWORD_MIN_LENGTH &&
    VALIDATION.PASSWORD_REGEX.test(password)
  );
}

/**
 * Validate birth date
 */
export function isValidBirthDate(dateString: string): boolean {
  const date = new Date(dateString);
  const year = date.getFullYear();
  return (
    !isNaN(date.getTime()) &&
    year >= VALIDATION.BIRTH_DATE_MIN_YEAR &&
    year <= VALIDATION.BIRTH_DATE_MAX_YEAR
  );
}

/**
 * Validate geographic coordinates
 */
export function isValidCoordinates(latitude: number, longitude: number): boolean {
  return (
    latitude >= VALIDATION.LATITUDE_MIN &&
    latitude <= VALIDATION.LATITUDE_MAX &&
    longitude >= VALIDATION.LONGITUDE_MIN &&
    longitude <= VALIDATION.LONGITUDE_MAX
  );
}

/**
 * Validate Big Five trait score (0-100)
 */
export function isValidTraitScore(score: number): boolean {
  return score >= TRAIT_RANGES.MIN && score <= TRAIT_RANGES.MAX;
}

/**
 * Validate confidence score (0-1)
 */
export function isValidConfidenceScore(score: number): boolean {
  return score >= 0 && score <= 1;
}

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

/**
 * Format timestamp to ISO string
 */
export function formatTimestamp(date: Date | string): string {
  return new Date(date).toISOString();
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time to HH:MM:SS
 */
export function formatTime(date: Date | string): string {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format confidence score as percentage
 */
export function formatConfidenceScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/**
 * Format trait score with descriptor
 */
export function formatTraitScore(score: number): { score: number; descriptor: string } {
  let descriptor: string;
  if (score < TRAIT_RANGES.LOW_THRESHOLD) {
    descriptor = 'Low';
  } else if (score < TRAIT_RANGES.MEDIUM_THRESHOLD) {
    descriptor = 'Moderate';
  } else {
    descriptor = 'High';
  }
  return { score, descriptor };
}

// ============================================================================
// NORMALIZATION UTILITIES
// ============================================================================

/**
 * Normalize trait scores to 0-100 range
 */
export function normalizeTraitScore(rawScore: number, minRaw: number, maxRaw: number): number {
  const normalized = ((rawScore - minRaw) / (maxRaw - minRaw)) * 100;
  return Math.max(TRAIT_RANGES.MIN, Math.min(TRAIT_RANGES.MAX, normalized));
}

/**
 * Normalize Big Five traits object
 */
export function normalizeBigFiveTraits(traits: BigFiveTraits): BigFiveTraits {
  return {
    openness: Math.round(traits.openness),
    conscientiousness: Math.round(traits.conscientiousness),
    extraversion: Math.round(traits.extraversion),
    agreeableness: Math.round(traits.agreeableness),
    neuroticism: Math.round(traits.neuroticism),
  };
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Generate initials from name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Sanitize string for display (prevent XSS)
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Chunk array into smaller arrays
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Pick specific keys from object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omit specific keys from object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result as Omit<T, K>;
}

// ============================================================================
// ASYNC UTILITIES
// ============================================================================

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry async function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await sleep(delay);
      }
    }
  }

  throw lastError!;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// MATH UTILITIES
// ============================================================================

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  return total === 0 ? 0 : (value / total) * 100;
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

// ============================================================================
// ERROR UTILITIES
// ============================================================================

/**
 * Check if error is instance of Error
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Get error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  return String(error);
}

/**
 * Create error response object
 */
export function createErrorResponse(code: string, message: string, details?: Record<string, unknown>) {
  return {
    success: false as const,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
}

// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * Generate random UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate random alphanumeric ID
 */
export function generateId(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
