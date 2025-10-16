import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

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
