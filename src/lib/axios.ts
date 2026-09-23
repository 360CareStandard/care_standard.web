
// lib/axios.ts
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

// Request: attach bearer
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response: handle auth / authorization / API errors
api.interceptors.response.use(
  (res) => res,

  async (error) => {
    const status = error?.response?.status;

    // 1. Authentication failure
    if (status === 401) {
      useAuthStore.getState().clearAuth();

      if (typeof window !== "undefined") {
        const current = window.location.pathname;

        window.location.href = `/login?next=${encodeURIComponent(current)}`;
      }

      return Promise.reject(error);
    }

    // 2. Authorization failure
    if (status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/403";
      }

      return Promise.reject(error);
    }

    // 3. Validation / business logic errors
    if (status === 400 || status === 422) {
      return Promise.reject(error);
    }

    // 4. Fallback: normalize unknown server errors
    return Promise.reject({
      ...error,
      response: {
        ...error.response,
        data: {
          message:
            error?.response?.data?.message ??
            "Something went wrong. Please try again.",
        },
      },
    });
  },
);
