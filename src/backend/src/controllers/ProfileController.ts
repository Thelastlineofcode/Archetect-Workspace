import { Request, Response } from 'express';
import { profileService } from '../services/ProfileService';
import { questionnaireService } from '../services/QuestionnaireService';
import { asyncHandler } from '../middleware/errorHandler';

export class ProfileController {
  /**
   * Get questionnaire items
   */
  public getQuestionnaire = asyncHandler(async (req: Request, res: Response) => {
    const questionnaire = questionnaireService.getQuestionnaire();

    res.json({
      success: true,
      data: {
        items: questionnaire,
        totalItems: questionnaire.length,
      },
    });
  });

  /**
   * Create profile from questionnaire responses
   */
  public createProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { responses } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        error: 'Responses array is required',
      });
    }

    // Check if profile already exists
    const existingProfile = await profileService.getByUserId(userId);
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        error: 'Profile already exists. Use PUT /api/v1/profiles/:id to update.',
      });
    }

    const profile = await profileService.createFromQuestionnaire({
      userId,
      responses,
    });

    res.status(201).json({
      success: true,
      data: profile,
    });
  });

  /**
   * Get user's own profile
   */
  public getMyProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const profile = await profileService.getByUserId(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found. Please complete the questionnaire first.',
      });
    }

    res.json({
      success: true,
      data: profile,
    });
  });

  /**
   * Get profile by ID
   */
  public getProfile = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const profile = await profileService.getById(id);

    res.json({
      success: true,
      data: profile,
    });
  });

  /**
   * Update profile from questionnaire responses
   */
  public updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { responses } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        error: 'Responses array is required',
      });
    }

    // Verify ownership
    const profile = await profileService.getById(id);
    if (profile.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own profile',
      });
    }

    const updatedProfile = await profileService.updateFromQuestionnaire(
      id,
      responses
    );

    res.json({
      success: true,
      data: updatedProfile,
    });
  });

  /**
   * Delete profile
   */
  public deleteProfile = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    // Verify ownership
    const profile = await profileService.getById(id);
    if (profile.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own profile',
      });
    }

    await profileService.delete(id);

    res.json({
      success: true,
      message: 'Profile deleted successfully',
    });
  });
}

export const profileController = new ProfileController();
