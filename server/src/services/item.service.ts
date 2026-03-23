import { itemRepository } from '../repositories/item.repository';
import { ApiError, getPaginationParams } from '../lib/utils';
import { CreateItemInput, UpdateItemInput } from '../validations/item.validation';
import { ItemFilterQuery } from '../types';
import { Prisma } from '@prisma/client';

export class ItemService {
  /**
   * Get all items with filtering and pagination.
   */
  async getItems(query: ItemFilterQuery) {
    const { skip, limit, page } = getPaginationParams(query.page, query.limit);

    const where: Prisma.ItemWhereInput = {};

    if (query.status) {
      where.status = query.status as any;
    }
    if (query.category) {
      where.category = query.category;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { items, total } = await itemRepository.findAll({
      skip,
      take: limit,
      where,
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single item by ID.
   */
  async getItemById(id: string) {
    const item = await itemRepository.findById(id);
    if (!item) {
      throw new ApiError(404, 'Item not found');
    }
    return item;
  }

  /**
   * Get items by user ID.
   */
  async getItemsByUser(userId: string) {
    return itemRepository.findByUserId(userId);
  }

  /**
   * Create a new item.
   */
  async createItem(userId: string, input: CreateItemInput) {
    const item = await itemRepository.create({
      ...input,
      user: { connect: { id: userId } },
    });

    // Fire & forget background match generation
    import('./match.service').then(({ matchService }) => {
      matchService.findMatches(item.id).catch(console.error);
    });

    return item;
  }

  /**
   * Update an item.
   */
  async updateItem(id: string, userId: string, input: UpdateItemInput) {
    const item = await itemRepository.findById(id);
    if (!item) {
      throw new ApiError(404, 'Item not found');
    }
    if (item.userId !== userId) {
      throw new ApiError(403, 'Not authorized to update this item');
    }
    return itemRepository.update(id, input);
  }

  /**
   * Delete an item.
   */
  async deleteItem(id: string, userId: string) {
    const item = await itemRepository.findById(id);
    if (!item) {
      throw new ApiError(404, 'Item not found');
    }
    if (item.userId !== userId) {
      throw new ApiError(403, 'Not authorized to delete this item');
    }
    return itemRepository.delete(id);
  }
}

export const itemService = new ItemService();
