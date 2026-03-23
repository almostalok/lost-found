// ─── Shared Types ───────────────────────────────────────
// These types are shared between client and server.
// Keep this in sync with both client/types/index.ts and server/src/types/index.ts.

export type ItemStatus = "LOST" | "FOUND" | "CLAIMED" | "RETURNED";
export type ClaimStatus = "PENDING" | "APPROVED" | "REJECTED";
export type NotificationType = "MATCH_FOUND" | "CLAIM_UPDATE" | "ITEM_UPDATE" | "SYSTEM";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ItemStatus;
  images: string[];
  location?: string;
  latitude?: number;
  longitude?: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Claim {
  id: string;
  message: string;
  status: ClaimStatus;
  evidence: string[];
  createdAt: string;
  itemId: string;
  claimantId: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: string;
  userId: string;
}
