import type { IUser } from '../../domain/entities/index.js';

export type UserWithPassword = IUser & {
  comparePassword(candidate: string): Promise<boolean>;
};

export interface IUserRepository {
  findByEmail(email: string): Promise<UserWithPassword | null>;
  findById(id: string): Promise<IUser | null>;
  create(data: { name: string; email: string; password: string; phone?: string; role?: 'user' | 'admin' }): Promise<IUser>;
}
