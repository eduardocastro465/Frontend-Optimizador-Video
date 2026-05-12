export interface Usuario {
  id: string;
  name: string;
  email: string;
  role: "admin" | "owner" | "user";
  image?: string;
}

export interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
