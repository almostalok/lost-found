import { Request, Response } from 'express';
import { claimService } from '../services/claim.service';
import { asyncHandler, apiResponse } from '../lib/utils';
import { AuthenticatedRequest } from '../types';

export class ClaimController {
  create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { itemId, message, evidence } = req.body;
    const claim = await claimService.createClaim(req.user!.userId, itemId, message, evidence);
    res.status(201).json(apiResponse(claim, 'Claim submitted successfully', 201));
  });

  getByItem = asyncHandler(async (req: Request, res: Response) => {
    const claims = await claimService.getClaimsByItem(req.params.itemId as string);
    res.status(200).json(apiResponse(claims));
  });

  getMyClaims = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const claims = await claimService.getClaimsByUser(req.user!.userId);
    res.status(200).json(apiResponse(claims));
  });

  updateStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { status } = req.body;
    const claim = await claimService.updateClaimStatus(req.params.id as string, req.user!.userId, status);
    res.status(200).json(apiResponse(claim, 'Claim status updated'));
  });
}

export const claimController = new ClaimController();
