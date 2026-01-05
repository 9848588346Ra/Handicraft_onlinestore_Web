import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDTO } from '../dto/register.dto';
import { LoginDTO } from '../dto/login.dto';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerData: RegisterDTO = req.body;
      const result = await this.authService.register(registerData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: result.user._id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            createdAt: result.user.createdAt,
          },
          token: result.token,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginDTO = req.body;
      const result = await this.authService.login(loginData);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: result.user._id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            createdAt: result.user.createdAt,
          },
          token: result.token,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json({
        success: false,
        message: errorMessage,
      });
    }
  };
}

