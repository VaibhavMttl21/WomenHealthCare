import { Request, Response } from 'express';
import profileService from '../services/profile.service';

export class ProfileController {
  /**
   * Get user profile
   */
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId || (req as any).user?.id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const profile = await profileService.getProfile(userId);

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      console.error('Error in getProfile:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch profile',
      });
    }
  }

  /**
   * Update complete profile
   */
  async updateCompleteProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId || (req as any).user?.id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const result = await profileService.updateCompleteProfile(userId, req.body);

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: result.profile,
        completionPercentage: result.completionPercentage,
      });
    } catch (error: any) {
      console.error('Error in updateCompleteProfile:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update profile',
      });
    }
  }

  /**
   * Get profile completion status
   */
  async getCompletionStatus(req: Request, res: Response) {
    try {
      const userId = req.params.userId || (req as any).user?.id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const status = await profileService.getProfileCompletionStatus(userId);

      return res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error: any) {
      console.error('Error in getCompletionStatus:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch completion status',
      });
    }
  }
}

export default new ProfileController();
