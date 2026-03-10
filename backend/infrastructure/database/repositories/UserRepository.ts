import type { IUserRepository, UserWithPassword } from '../../../application/ports/IUserRepository.js';
import type { IUser } from '../../../domain/entities/index.js';
import { User } from '../UserModel.js';

function toUser(doc: { _id: { toString: () => string }; name: string; email: string; phone?: string; role?: string }): IUser {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    phone: doc.phone ?? '',
    role: doc.role as 'user' | 'admin',
  };
}

export const userRepository: IUserRepository = {
  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const user = await User.findOne({ email });
    if (!user) return null;
    return {
      ...toUser(user),
      role: user.role,
      comparePassword: (candidate: string) => user.comparePassword(candidate),
    };
  },

  async findById(id: string): Promise<IUser | null> {
    const user = await User.findById(id).select('-password');
    if (!user) return null;
    return toUser(user);
  },

  async create(data: { name: string; email: string; password: string; phone?: string; role?: 'user' | 'admin' }): Promise<IUser> {
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone || '',
      role: data.role || 'user',
    });
    return toUser(user);
  },
};
