import { Request, Response } from 'express';
import { compatibilityService } from '../services/CompatibilityService';
import { asyncHandler } from '../middleware/errorHandler';

export class CompatibilityController {
  /**
   * Calculate compatibility between two profiles
   */
  public calculatePairCompatibility = asyncHandler(
    async (req: Request, res: Response) => {
      const { profile1Id, profile2Id } = req.body;

      if (!profile1Id || !profile2Id) {
        return res.status(400).json({
          success: false,
          error: 'Both profile1Id and profile2Id are required',
        });
      }

      if (profile1Id === profile2Id) {
        return res.status(400).json({
          success: false,
          error: 'Cannot calculate compatibility with the same profile',
        });
      }

      const compatibility = await compatibilityService.calculateCompatibility(
        profile1Id,
        profile2Id
      );

      res.json({
        success: true,
        data: compatibility,
      });
    }
  );

  /**
   * Calculate team compatibility for multiple members
   */
  public calculateTeamCompatibility = asyncHandler(
    async (req: Request, res: Response) => {
      const { profileIds } = req.body;

      if (!profileIds || !Array.isArray(profileIds)) {
        return res.status(400).json({
          success: false,
          error: 'profileIds array is required',
        });
      }

      if (profileIds.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'At least 2 profile IDs required',
        });
      }

      const teamCompatibility =
        await compatibilityService.calculateTeamCompatibility(profileIds);

      res.json({
        success: true,
        data: teamCompatibility,
      });
    }
  );
}

export const compatibilityController = new CompatibilityController();
