import prisma from '../lib/prisma';
import { Prisma, ClaimStatus } from '@prisma/client';

export class ClaimRepository {
  async findById(id: string) {
    return prisma.claim.findUnique({
      where: { id },
      include: {
        item: true,
        claimant: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });
  }

  async findByItemId(itemId: string) {
    return prisma.claim.findMany({
      where: { itemId },
      include: { claimant: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByClaimantId(claimantId: string) {
    return prisma.claim.findMany({
      where: { claimantId },
      include: { item: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.ClaimCreateInput) {
    return prisma.claim.create({ data });
  }

  async updateStatus(id: string, status: ClaimStatus) {
    return prisma.claim.update({ where: { id }, data: { status } });
  }

  async delete(id: string) {
    return prisma.claim.delete({ where: { id } });
  }
}

export const claimRepository = new ClaimRepository();
