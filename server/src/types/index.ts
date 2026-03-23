import { Request } from 'express';

// ─── Auth Types ─────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// ─── Query Types ────────────────────────────────────────

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface ItemFilterQuery extends PaginationQuery {
  status?: string;
  category?: string;
  search?: string;
  lat?: string;
  lng?: string;
  radius?: string;
}

// ─── Response Types ─────────────────────────────────────

export interface ApiResponseType<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponseType<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
