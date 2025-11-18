import { userRepository, refreshTokenRepository } from '../db/repositories';
import { JWTUtil, TokenPair } from '../utils/jwt';
import { User, OAuthProvider } from '@archetect/shared/types';
import { ValidationError, AuthenticationError } from '../middleware/errorHandler';
import { isValidEmail, isValidPassword } from '@archetect/shared/utils';
import bcrypt from 'bcrypt';
import logger from '../utils/logger';

interface SignupParams {
  email: string;
  password: string;
  fullName: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface OAuthLoginParams {
  provider: OAuthProvider;
  oauthId: string;
  email: string;
  fullName: string;
}

export class AuthService {
  public async signup(params: SignupParams): Promise<{ user: User; tokens: TokenPair }> {
    const { email, password, fullName } = params;

    // Validate input
    if (!isValidEmail(email)) {
      throw new ValidationError('Invalid email address');
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.isValid) {
      throw new ValidationError(
        passwordValidation.errors?.join(', ') || 'Invalid password'
      );
    }

    if (!fullName || fullName.trim().length < 2) {
      throw new ValidationError('Full name must be at least 2 characters');
    }

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError('An account with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepository.create({
      email,
      passwordHash,
      fullName: fullName.trim(),
      subscriptionTier: 'free',
    });

    logger.info('User signed up', { userId: user.id, email: user.email });

    // Generate tokens
    const tokens = JWTUtil.generateTokenPair({
      userId: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
    });

    // Store refresh token
    await refreshTokenRepository.create(
      user.id,
      tokens.refreshToken,
      JWTUtil.getRefreshTokenExpiry()
    );

    // Update last login
    await userRepository.updateLastLogin(user.id);

    return { user, tokens };
  }

  public async login(params: LoginParams): Promise<{ user: User; tokens: TokenPair }> {
    const { email, password } = params;

    // Validate input
    if (!isValidEmail(email)) {
      throw new ValidationError('Invalid email address');
    }

    if (!password) {
      throw new ValidationError('Password is required');
    }

    // Verify credentials
    const user = await userRepository.verifyPassword(email, password);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    logger.info('User logged in', { userId: user.id, email: user.email });

    // Generate tokens
    const tokens = JWTUtil.generateTokenPair({
      userId: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
    });

    // Store refresh token
    await refreshTokenRepository.create(
      user.id,
      tokens.refreshToken,
      JWTUtil.getRefreshTokenExpiry()
    );

    // Update last login
    await userRepository.updateLastLogin(user.id);

    return { user, tokens };
  }

  public async oauthLogin(params: OAuthLoginParams): Promise<{ user: User; tokens: TokenPair }> {
    const { provider, oauthId, email, fullName } = params;

    // Try to find existing user by OAuth
    let user = await userRepository.findByOAuth(provider, oauthId);

    if (!user) {
      // Try to find by email
      user = await userRepository.findByEmail(email);

      if (user) {
        // User exists with email but not linked to OAuth
        // This is a security decision - you might want to handle this differently
        throw new AuthenticationError(
          'An account with this email already exists. Please login with password.'
        );
      }

      // Create new user
      user = await userRepository.create({
        email,
        fullName,
        oauthProvider: provider,
        oauthId,
        subscriptionTier: 'free',
      });

      logger.info('User created via OAuth', {
        userId: user.id,
        provider,
        email: user.email,
      });
    }

    logger.info('User logged in via OAuth', {
      userId: user.id,
      provider,
      email: user.email,
    });

    // Generate tokens
    const tokens = JWTUtil.generateTokenPair({
      userId: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
    });

    // Store refresh token
    await refreshTokenRepository.create(
      user.id,
      tokens.refreshToken,
      JWTUtil.getRefreshTokenExpiry()
    );

    // Update last login
    await userRepository.updateLastLogin(user.id);

    return { user, tokens };
  }

  public async refreshTokens(refreshToken: string): Promise<TokenPair> {
    // Find refresh token in database
    const storedToken = await refreshTokenRepository.findByToken(refreshToken);

    if (!storedToken) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    // Get user
    const user = await userRepository.findById(storedToken.userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Delete old refresh token
    await refreshTokenRepository.deleteByToken(refreshToken);

    // Generate new token pair
    const tokens = JWTUtil.generateTokenPair({
      userId: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
    });

    // Store new refresh token
    await refreshTokenRepository.create(
      user.id,
      tokens.refreshToken,
      JWTUtil.getRefreshTokenExpiry()
    );

    logger.info('Tokens refreshed', { userId: user.id });

    return tokens;
  }

  public async logout(refreshToken: string): Promise<void> {
    await refreshTokenRepository.deleteByToken(refreshToken);
    logger.info('User logged out');
  }

  public async logoutAll(userId: string): Promise<void> {
    await refreshTokenRepository.deleteByUserId(userId);
    logger.info('User logged out from all devices', { userId });
  }

  public async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Get user
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Verify current password
    if (!user.passwordHash) {
      throw new AuthenticationError('Password not set for this account');
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Validate new password
    const passwordValidation = isValidPassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new ValidationError(
        passwordValidation.errors?.join(', ') || 'Invalid password'
      );
    }

    // Update password
    await userRepository.updatePassword(userId, newPassword);

    // Logout from all devices
    await this.logoutAll(userId);

    logger.info('Password changed', { userId });
  }
}

export const authService = new AuthService();
