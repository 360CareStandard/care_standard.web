// lib/axios.ts
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // set true if your API uses cookies
});

// request: attach bearer
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response: handle 401/expired token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // clear auth and optionally redirect
      useAuthStore.getState().clearAuth();
      // if you want a soft redirect on client pages:
      if (typeof window !== "undefined") {
        const current = window.location.pathname;
        window.location.href = `/login?next=${encodeURIComponent(current)}`;
      }
    }
    return Promise.reject(error);
  }
);
