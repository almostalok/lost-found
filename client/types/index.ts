// ─── User ───────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  aadhar?: string;
  avatar?: string;
  createdAt: string;
}

// ─── Item ───────────────────────────────────────────────
export type ItemStatus = "LOST" | "FOUND" | "CLAIMED" | "RETURNED";

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
  user?: Pick<User, "id" | "name" | "avatar">;
}

// ─── Claim ──────────────────────────────────────────────
export type ClaimStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Claim {
  id: string;
  message: string;
  status: ClaimStatus;
  evidence: string[];
  createdAt: string;
  itemId: string;
  claimantId: string;
  item?: Item;
  claimant?: Pick<User, "id" | "name" | "avatar">;
}

// ─── Notification ───────────────────────────────────────
export type NotificationType = "MATCH_FOUND" | "CLAIM_UPDATE" | "ITEM_UPDATE" | "SYSTEM";

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

// ─── API Response ───────────────────────────────────────
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Auth ───────────────────────────────────────────────
export interface AuthResponse {
  user: User;
  token: string;
}
