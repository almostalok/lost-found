/**
 * Wraps an async function to catch errors and pass them to Express error handler.
 */
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Custom API Error class with status code.
 */
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Standard API response format.
 */
export const apiResponse = <T>(data: T, message = 'Success', statusCode = 200) => ({
  success: true,
  statusCode,
  message,
  data,
});

/**
 * Pagination helper.
 */
export const getPaginationParams = (page?: string | number, limit?: string | number) => {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
};
