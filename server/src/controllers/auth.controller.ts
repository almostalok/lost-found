import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler, apiResponse } from '../lib/utils';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json(apiResponse(result, 'User registered successfully', 201));
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json(apiResponse(result, 'Login successful'));
  });

  getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await authService.getProfile(req.user!.userId);
    res.status(200).json(apiResponse(user));
  });
}

export const authController = new AuthController();
