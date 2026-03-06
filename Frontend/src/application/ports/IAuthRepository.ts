import type { CurrentUser } from '@/domain/entities';

export interface IAuthRepository {
  register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
  }): Promise<
    | { success: true; user: CurrentUser }
    | { success: false; message: string }
  >;
  login(email: string, password: string): Promise<
    | { success: true; user: CurrentUser }
    | { success: false; message: string }
  >;
  me(): Promise<
    | { success: true; user: CurrentUser }
    | { success: false; message: string }
  >;
  logout(): void;
}
