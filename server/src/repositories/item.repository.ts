import prisma from '../lib/prisma';
import { Prisma, ItemStatus } from '@prisma/client';

export class ItemRepository {
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      }),
      prisma.item.count({ where }),
    ]);
    return { items, total };
  }

  async findById(id: string) {
    return prisma.item.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        claims: { include: { claimant: { select: { id: true, name: true, avatar: true } } } },
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.item.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.ItemCreateInput) {
    return prisma.item.create({ data });
  }

  async update(id: string, data: Prisma.ItemUpdateInput) {
    return prisma.item.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.item.delete({ where: { id } });
  }

  async updateStatus(id: string, status: ItemStatus) {
    return prisma.item.update({ where: { id }, data: { status } });
  }
}

export const itemRepository = new ItemRepository();
