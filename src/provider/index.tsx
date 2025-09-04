import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AxiosError } from "axios";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// import { toast, Toaster } from 'sonner'
// If you have these in your project, keep them.
// If not, remove the lines or stub them.
// import { useAuthStore } from '@/stores/auth-store'
// import { handleServerError } from '@/lib/handle-server-error'

// Export if you ever need the client elsewhere
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // DEV: no retries (fail fast). PROD: up to 3 retries. Never retry 401/403.
      retry: (failureCount, error) => {
        if (import.meta.env.DEV) return false;
        if (failureCount > 3) return false;

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        );
      },
      // Refetch on focus only in prod
      refetchOnWindowFocus: import.meta.env.PROD,
      // Cache freshness window
      staleTime: 10_000, // 10s
    },
    mutations: {
      onError: (error) => {
        // Your central error mapping/logging
        try {
          // Optional if you have it
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // (handleServerError as any)?.(error)
        } catch {}

        if (error instanceof AxiosError && error.response?.status === 304) {
          // toast.error('Content not modified!')
        }
      },
    },
  },
  // Global query error hook (not mutations)
  queryCache: new QueryCache({
    onError: (error) => {
      if (!(error instanceof AxiosError)) return;
      const status = error.response?.status;

      if (status === 401) {
        // toast.error('Session expired!')
        try {
          // If you use Zustand auth store
          // useAuthStore.getState().auth.reset()
        } catch {}

        // We’re in a non-React callback; use hard navigation.
        const redirect = window.location.href;
        window.location.assign(
          `/sign-in?redirect=${encodeURIComponent(redirect)}`
        );
      } else if (status === 500) {
        // toast.error('Internal Server Error!')
        window.location.assign("/500");
      } else if (status === 403) {
        // toast.error('Forbidden')
        // window.location.assign('/forbidden')
      }
    },
  }),
});

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const defaultOpen = getCookie("sidebar_state") !== "false";
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>

      {/* Sonner toasts */}
      {/* <Toaster richColors position="top-right" /> */}
    </QueryClientProvider>
  );
}
