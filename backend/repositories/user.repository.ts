import { IUser, User } from '../models/User';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+password');
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async create(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
  }): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    return !!user;
  }
}

