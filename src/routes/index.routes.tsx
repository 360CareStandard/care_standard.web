// routes/index.tsx
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "@/App";
import SplashVisual from "@/layouts/splash-visual";
import AppLayout from "@/layouts/app-layout";
import appChildRoutes from "./app.routes";
import NotFound from "@/pages/404";
import WorkspaceSelectionPage from "@/pages/workplace";
import PublicOnlyRoute from "./public";
import ProtectedRoute from "./protected";

const AuthLayout = lazy(() => import("@/layouts/auth-layout"));
const Login = lazy(() => import("@/pages/auth/login-page"));
const CheckEmailPage = lazy(() => import("@/pages/auth/check-email-page"));
const MagicLinkCallback = lazy(() => import("@/pages/auth/magic-link"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<SplashVisual message="Loading…" />}>
      <Routes>
        <Route path="workspace" element={<WorkspaceSelectionPage />} />
        <Route path="/design" element={<App />} />

        {/* Public auth area only when not logged in */}
        <Route
          element={
            <PublicOnlyRoute>
              <AuthLayout />
            </PublicOnlyRoute>
          }
        >
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="login/check-email" element={<CheckEmailPage />} />
          <Route path="login/magic" element={<MagicLinkCallback />} />
          <Route path="/404" element={<NotFound />} />
        </Route>

        {/* Protected application area */}
        <Route
          path="app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {appChildRoutes}
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
