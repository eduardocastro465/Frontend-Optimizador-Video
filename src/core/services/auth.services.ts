import { axiosClient } from "../api/axiosConfig";
import type { LoginForm, registerForm } from "../schemas/auth.schema";

//http://localhost:3000/api

export const register = (data: registerForm) => {
  return axiosClient.post(`/auth/register`, data);
};

export const login = (data: LoginForm) => {
  return axiosClient.post(`/auth/login`, data);
};

  export const loginGoogle = (token: string) => {
    return axiosClient.post(`/auth/google-auth/verify`, { token });
  };

export const validarUsername = async (username: string) => {
  return axiosClient.post(`/auth/register/validar-username`, { username });
};

export const enviarCodigoEmail = (email: string) =>
  axiosClient.post(`/auth/register/enviarCodigoEmail`, { email });

export const verificarCodigoEmail = (email: string, code: string) =>
  axiosClient.post(`/auth/register/verificarCodigoEmail`, { email, code });
