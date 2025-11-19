import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { randomBytes } from 'crypto';

export interface JWTPayload extends JwtPayload {
  userId: string;
  email: string;
  subscriptionTier: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class JWTUtil {
  private static accessTokenSecret = config.jwt.secret;
  private static refreshTokenSecret = config.jwt.refreshSecret;
  private static accessTokenExpiry = config.jwt.expiresIn;
  private static refreshTokenExpiry = config.jwt.refreshExpiresIn;

  public static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(
      payload as object,
      this.accessTokenSecret,
      {
        expiresIn: this.accessTokenExpiry as any,
        issuer: 'archetect-api',
        audience: 'archetect-users',
      }
    );
  }

  public static generateRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }

  public static generateTokenPair(payload: JWTPayload): TokenPair {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken();

    // Convert expiry time to seconds
    const expiresIn = this.parseExpiryToSeconds(this.accessTokenExpiry);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  public static verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'archetect-api',
        audience: 'archetect-users',
      }) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Access token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid access token');
      }
      throw error;
    }
  }

  public static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }

  public static getRefreshTokenExpiry(): Date {
    const seconds = this.parseExpiryToSeconds(this.refreshTokenExpiry);
    return new Date(Date.now() + seconds * 1000);
  }

  private static parseExpiryToSeconds(expiry: string): number {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1));

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 3600; // Default to 1 hour
    }
  }
}
