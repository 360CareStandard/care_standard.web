import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "react-hot-toast";

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
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          removeDelay: 300,
          style: {
            fontSize: "13px",
            fontWeight: 500,
            borderRadius: "8px",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "#16a34a",
              color: "#ffffff",
              border: "1px solid #15803d",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#16a34a",
            },
          },
          error: {
            style: {
              background: "#dc2626",
              color: "#ffffff",
              border: "1px solid #b91c1c",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#dc2626",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}
