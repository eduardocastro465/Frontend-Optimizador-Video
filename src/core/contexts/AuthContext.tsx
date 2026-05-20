/* @refresh reset */
import { createContext, useContext, useState, type ReactNode } from "react";
import { useAuthStore } from "../store/authStore";
import { isAxiosError } from "../api/axiosConfig";
import type { AuthContextType } from "../types/auth.types";
import type { registerForm } from "../schemas/auth.schema";
import { login, loginGoogle, register } from "../services/auth.services";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, setUser, clearUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loginAuth(identifier: string, password: string): Promise<boolean> {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await login({ identifier, password });
      setUser(data.user);
      return true;
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? err.message
        : "Ocurrió un error inesperado";
      setError(message);
      throw new Error(message); // ← relanza para que Login.tsx lo capture
    } finally {
      setIsLoading(false);
    }
  }

  async function loginAuthGoogle(credential: string) {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await loginGoogle(credential);
      console.log(data)
      setUser(data.user);
      return true;
    } catch (err) {
      const message = isAxiosError(err)
        ? err.message
        : "Ocurrió un error inesperado";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function registerAuth(data: registerForm) {
    setIsLoading(true);
    setError(null);
    try {
      const { data: response } = await register(data);

      if (response.user) setUser(response.user);

      return true;
    } catch (err) {
      const message = isAxiosError(err)
        ? err.message
        : "Ocurrió un error inesperado";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }

  function logoutAuth() {
    clearUser();
    setError(null);
  }

  function clearError() {
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginAuth,
        registerAuth,
        loginAuthGoogle,
        logoutAuth,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
