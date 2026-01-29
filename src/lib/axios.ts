// lib/axios.ts
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // set true if your API uses cookies
  timeout: 15000,
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
// lib/axios.ts
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;

    // 1️⃣ Auth handling (keep as-is)
    if (status === 401) {
      useAuthStore.getState().clearAuth();

      if (typeof window !== "undefined") {
        const current = window.location.pathname;
        window.location.href = `/login?next=${encodeURIComponent(current)}`;
      }

      return Promise.reject(error);
    }

    // 2️⃣ Validation / business logic errors (IMPORTANT)
    if (status === 400 || status === 422) {
      // Ensure error shape is preserved
      return Promise.reject(error);
    }

    // 3️⃣ Fallback: normalize unknown server errors
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
