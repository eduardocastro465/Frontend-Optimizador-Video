import type { User } from "./user.type";

import { type registerForm } from "../schemas/auth.schema";

export type Role = "admin" | "user";

export const routes: Record<Role, string> = {
  admin: "/admin",
  user: "/user",
};

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  loginAuth: (identifier: string, password: string) => Promise<any>; // identifier = email o usuario
  loginAuthGoogle: (credentialResponse: any) => Promise<any>;
  logoutAuth: () => void;
  registerAuth: (data: registerForm) => Promise<any>;
  clearError: () => void;
}
