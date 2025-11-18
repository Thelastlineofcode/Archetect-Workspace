import { profileRepository } from '../db/repositories';
import { questionnaireService } from './QuestionnaireService';
import { transformationService } from './TransformationService';
import { Profile } from '@archetect/shared/types';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';
import logger from '../utils/logger';

interface QuestionnaireResponse {
  questionId: string;
  response: number;
}

interface CreateProfileFromQuestionnaireParams {
  userId: string;
  responses: QuestionnaireResponse[];
}

export class ProfileService {
  /**
   * Create a profile from Big Five questionnaire responses
   */
  public async createFromQuestionnaire(
    params: CreateProfileFromQuestionnaireParams
  ): Promise<Profile> {
    const { userId, responses } = params;

    logger.info('Creating profile from questionnaire', { userId });

    // Step 1: Score the questionnaire
    const bigFiveTraits = questionnaireService.scoreQuestionnaire(responses);

    // Step 2: Transform Big Five traits into Archetect profile
    const transformation = transformationService.transformBigFiveData(bigFiveTraits);

    // Step 3: Create profile in database
    const profile = await profileRepository.create({
      userId,
      approach: 'big_five',
      discType: transformation.archetectType as any, // TODO: Update schema to remove discType
      archetectType: transformation.archetectType,
      energyStyle: transformation.energyStyle,
      flowMode: transformation.flowMode,
      season: transformation.season,
      bigFiveTraits,
      strengths: transformation.strengths,
      challenges: transformation.challenges,
      workStyle: transformation.workStyle,
      communicationStyle: transformation.communicationStyle,
      confidenceScore: transformation.confidenceScore,
    });

    logger.info('Profile created successfully', {
      userId,
      profileId: profile.id,
      archetectType: transformation.archetectType,
    });

    return profile;
  }

  /**
   * Get a profile by ID
   */
  public async getById(profileId: string): Promise<Profile> {
    const profile = await profileRepository.findById(profileId);

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    return profile;
  }

  /**
   * Get a profile by user ID
   */
  public async getByUserId(userId: string): Promise<Profile | null> {
    return await profileRepository.findByUserId(userId);
  }

  /**
   * Update a profile (e.g., after retaking questionnaire)
   */
  public async updateFromQuestionnaire(
    profileId: string,
    responses: QuestionnaireResponse[]
  ): Promise<Profile> {
    // Score the questionnaire
    const bigFiveTraits = questionnaireService.scoreQuestionnaire(responses);

    // Transform Big Five traits into Archetect profile
    const transformation = transformationService.transformBigFiveData(bigFiveTraits);

    // Update profile
    const updatedProfile = await profileRepository.update(profileId, {
      archetectType: transformation.archetectType,
      energyStyle: transformation.energyStyle,
      flowMode: transformation.flowMode,
      season: transformation.season,
      bigFiveTraits,
      strengths: transformation.strengths,
      challenges: transformation.challenges,
      workStyle: transformation.workStyle,
      communicationStyle: transformation.communicationStyle,
      confidenceScore: transformation.confidenceScore,
    });

    if (!updatedProfile) {
      throw new NotFoundError('Profile not found');
    }

    logger.info('Profile updated successfully', {
      profileId,
      archetectType: transformation.archetectType,
    });

    return updatedProfile;
  }

  /**
   * Delete a profile
   */
  public async delete(profileId: string): Promise<boolean> {
    return await profileRepository.delete(profileId);
  }

  /**
   * Delete a profile by user ID
   */
  public async deleteByUserId(userId: string): Promise<boolean> {
    return await profileRepository.deleteByUserId(userId);
  }

  /**
   * Get profiles by Archetect Type
   */
  public async getByArchetectType(archetectType: string): Promise<Profile[]> {
    return await profileRepository.findByArchetectType(archetectType as any);
  }
}

export const profileService = new ProfileService();
