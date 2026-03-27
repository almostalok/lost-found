import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../lib/utils';
import { RegisterInput, LoginInput } from '../validations/auth.validation';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export class AuthService {
  /**
   * Register a new user.
   */
  async register(input: RegisterInput) {
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    if (input.phone) {
      const existingPhone = await userRepository.findByPhone(input.phone.trim());
      if (existingPhone) {
        throw new ApiError(409, 'User with this phone number already exists');
      }
    }

    if (input.aadhar) {
      const existingAadhar = await userRepository.findByAadhar(input.aadhar.trim());
      if (existingAadhar) {
        throw new ApiError(409, 'User with this Aadhar number already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      phone: input.phone?.trim() || undefined,
      aadhar: input.aadhar?.trim() || undefined,
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, config.jwt.secret, { expiresIn: config.jwt.expiresIn as any });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Login a user.
   */
  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(input.password, user.password);

    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, config.jwt.secret, { expiresIn: config.jwt.expiresIn as any });
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Get user profile by ID.
   */
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();
