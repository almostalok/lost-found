import { claimRepository } from '../repositories/claim.repository';
import { itemRepository } from '../repositories/item.repository';
import { ApiError } from '../lib/utils';
import { ClaimStatus } from '@prisma/client';
import prisma from '../lib/prisma';

export class ClaimService {
  /**
   * Create a new claim for an item.
   */
  async createClaim(claimantId: string, itemId: string, message: string, evidence: string[] = []) {
    const item = await itemRepository.findById(itemId);
    if (!item) {
      throw new ApiError(404, 'Item not found');
    }
    if (item.userId === claimantId) {
      throw new ApiError(400, 'You cannot claim your own item');
    }
    
    const existingClaim = await claimRepository.findByItemId(itemId);
    const hasAlreadyClaimed = existingClaim.some(c => c.claimantId === claimantId);
    if (hasAlreadyClaimed) {
      throw new ApiError(400, 'You have already submitted a claim for this item');
    }

    const claim = await claimRepository.create({
      message,
      evidence,
      item: { connect: { id: itemId } },
      claimant: { connect: { id: claimantId } },
    });

    // Notify the item owner
    import('./notification.service').then(({ notificationService }) => {
      notificationService.create(
        item.userId,
        'CLAIM_UPDATE',
        'New Claim Submitted',
        `Someone has submitted a claim for your item: ${item.title}`,
        { claimId: claim.id, itemId: item.id }
      ).catch(console.error);
    });

    return claim;
  }

  /**
   * Get claims for an item.
   */
  async getClaimsByItem(itemId: string) {
    return claimRepository.findByItemId(itemId);
  }

  /**
   * Get all claims for a user (either as claimant or item owner).
   */
  async getUserChats(userId: string) {
    const claims = await prisma.claim.findMany({
      where: {
        OR: [
          { claimantId: userId },
          { item: { userId: userId } }
        ]
      },
      include: {
        item: { select: { id: true, title: true, images: true, userId: true } },
        claimant: { select: { id: true, name: true, avatar: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' },
    });

    return claims;
  }

  /**
   * Get claims made by a user.
   */
  async getClaimsByUser(userId: string) {
    return claimRepository.findByClaimantId(userId);
  }

  /**
   * Update claim status (approve/reject).
   */
  async updateClaimStatus(claimId: string, userId: string, status: ClaimStatus) {
    const claim = await claimRepository.findById(claimId);
    if (!claim) {
      throw new ApiError(404, 'Claim not found');
    }

    // Only the item owner can approve/reject claims
    if (claim.item.userId !== userId) {
      throw new ApiError(403, 'Not authorized to update this claim');
    }

    const updatedClaim = await claimRepository.updateStatus(claimId, status);

    // Notify the claimant about the status change
    import('./notification.service').then(({ notificationService }) => {
      notificationService.create(
        claim.claimantId,
        'CLAIM_UPDATE',
        `Claim ${status}`,
        `Your claim for "${claim.item.title}" has been ${status.toLowerCase()}.`,
        { claimId: claim.id, itemId: claim.item.id }
      ).catch(console.error);
    });

    // If approved, update item status to CLAIMED
    if (status === ClaimStatus.APPROVED) {
      await itemRepository.updateStatus(claim.itemId, 'CLAIMED');
      
      // Bonus: reject all other pending claims for this item
      const otherClaims = await claimRepository.findByItemId(claim.itemId);
      for (const otherClaim of otherClaims) {
        if (otherClaim.id !== claimId && otherClaim.status === ClaimStatus.PENDING) {
          await claimRepository.updateStatus(otherClaim.id, ClaimStatus.REJECTED);
        }
      }
    }

    return updatedClaim;
  }
  /**
   * Get messages for a claim.
   */
  async getMessages(claimId: string, userId: string) {
    const claim = await claimRepository.findById(claimId);
    if (!claim) {
      throw new ApiError(404, 'Claim not found');
    }

    if (claim.item.userId !== userId && claim.claimantId !== userId) {
      throw new ApiError(403, 'Not authorized to view these messages');
    }

    return prisma.message.findMany({
      where: { claimId },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'asc' }
    });
  }

  /**
   * Add a message to a claim chat.
   */
  async addMessage(claimId: string, userId: string, text: string) {
    const claim = await claimRepository.findById(claimId);
    if (!claim) throw new ApiError(404, 'Claim not found');
    
    if (claim.item.userId !== userId && claim.claimantId !== userId) {
      throw new ApiError(403, 'Not authorized to message on this claim');
    }

    const message = await prisma.message.create({
      data: {
        text,
        claimId,
        senderId: userId
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } }
      }
    });

    // Notify the other party
    const receiverId = claim.item.userId === userId ? claim.claimantId : claim.item.userId;
    import('./notification.service').then(({ notificationService }) => {
      notificationService.create(
        receiverId,
        'CLAIM_UPDATE',
        'New Message',
        `You have a new message regarding a claim.`,
        { claimId: claim.id }
      ).catch(console.error);
    });

    return message;
  }
}

export const claimService = new ClaimService();
