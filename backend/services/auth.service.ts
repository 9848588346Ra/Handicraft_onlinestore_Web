import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDTO } from '../dto/register.dto';
import { LoginDTO } from '../dto/login.dto';
import { IUser } from '../models/User';
import { config } from '../config/env';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(registerData: RegisterDTO): Promise<{ user: IUser; token: string }> {
    const emailExists = await this.userRepository.emailExists(registerData.email);
    if (emailExists) {
      throw new Error('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerData.password, salt);

    const user = await this.userRepository.create({
      name: registerData.name,
      email: registerData.email,
      password: hashedPassword,
      role: 'user',
    });

    const token = this.generateToken(user._id.toString());

    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: userObject as IUser,
      token,
    };
  }

  async login(loginData: LoginDTO): Promise<{ user: IUser; token: string }> {
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user._id.toString());

    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: userObject as IUser,
      token,
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }
}

