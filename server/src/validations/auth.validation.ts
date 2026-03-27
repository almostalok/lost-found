import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().length(10, 'Phone must be exactly 10 digits').regex(/^\d+$/, 'Phone must contain only digits').optional(),
  aadhar: z.string().length(12, 'Aadhar must be exactly 12 digits').regex(/^\d+$/, 'Aadhar must contain only digits').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
