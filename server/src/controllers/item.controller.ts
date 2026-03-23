import { Request, Response } from 'express';
import { itemService } from '../services/item.service';
import { matchService } from '../services/match.service';
import { asyncHandler, apiResponse } from '../lib/utils';
import { AuthenticatedRequest, ItemFilterQuery } from '../types';

export class ItemController {
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await itemService.getItems(req.query as ItemFilterQuery);
    res.status(200).json({
      ...apiResponse(result.items),
      pagination: result.pagination,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const item = await itemService.getItemById(req.params.id as string);
    res.status(200).json(apiResponse(item));
  });

  getMyItems = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const items = await itemService.getItemsByUser(req.user!.userId);
    res.status(200).json(apiResponse(items));
  });

  create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const item = await itemService.createItem(req.user!.userId, req.body);
    res.status(201).json(apiResponse(item, 'Item created successfully', 201));
  });

  update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const item = await itemService.updateItem(req.params.id as string, req.user!.userId, req.body);
    res.status(200).json(apiResponse(item, 'Item updated successfully'));
  });

  delete = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await itemService.deleteItem(req.params.id as string, req.user!.userId);
    res.status(200).json(apiResponse(null, 'Item deleted successfully'));
  });

  getMatches = asyncHandler(async (req: Request, res: Response) => {
    const matches = await matchService.findMatches(req.params.id as string);
    res.status(200).json(apiResponse(matches));
  });
}

export const itemController = new ItemController();
