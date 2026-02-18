// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failures, err: any) => {
        const status = err?.response?.status;
        if (status && status < 500) return false;
        return failures < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 60_000,
    },
    mutations: { retry: 0 },
  },
});

// src/lib/react-query.ts

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 60_000,          // 1 min: data considered fresh
//       cacheTime: 5 * 60_000,      // 5 min in memory after unused
//       refetchOnWindowFocus: false,
//       refetchOnReconnect: true,
//       retry: 1,                   // don’t spam retries
//     },
//     mutations: {
//       retry: 0,
//     },
//   },
// });
