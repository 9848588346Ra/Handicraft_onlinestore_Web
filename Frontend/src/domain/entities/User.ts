export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export type CurrentUser = Pick<User, 'name' | 'email' | 'phone' | 'role'>;
