import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Crea la instancia de axios
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  timeout: 0,
  withCredentials: true,
});

export const isAxiosError = axios.isAxiosError;

// Maneja las respuestas del servidor: error 401 y 403
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      useAuthStore.getState().clearUser();
      window.location.href = "/";
    }
    const data = error.response?.data;
    error.message =
      data?.errors?.[0]?.mensaje ?? data?.message ?? error.message;
    return Promise.reject(error);
  },
);
