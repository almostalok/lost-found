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

  getMyChats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const chats = await claimService.getUserChats(req.user!.userId);
    res.status(200).json(apiResponse(chats));
  });

  updateStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { status } = req.body;
    const claim = await claimService.updateClaimStatus(req.params.id as string, req.user!.userId, status);
    res.status(200).json(apiResponse(claim, 'Claim status updated'));
  });

  getMessages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const messages = await claimService.getMessages(req.params.id as string, req.user!.userId);
    res.status(200).json(apiResponse(messages));
  });

  addMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { text } = req.body;
    const message = await claimService.addMessage(req.params.id as string, req.user!.userId, text);
    res.status(201).json(apiResponse(message, 'Message sent', 201));
  });
}

export const claimController = new ClaimController();
