// routes/index.tsx
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import SplashVisual from "@/layouts/splash-visual";
import AppLayout from "@/layouts/app-layout";
import appChildRoutes from "./app.routes";
import NotFound from "@/pages/404";
import PublicOnlyRoute from "./public";
import ProtectedRoute from "./protected";
import AdminLayout from "@/layouts/admin-layout";
import adminChildRoutes from "./admin.routes";
import Forbidden from "@/pages/403";

const AuthLayout = lazy(() => import("@/layouts/auth-layout"));
const Login = lazy(() => import("@/pages/auth/login-page"));
const CheckEmailPage = lazy(() => import("@/pages/auth/check-email-page"));
const WorkspaceSelectionPage = lazy(() => import("@/pages/workspace"));
const MagicLinkCallback = lazy(() => import("@/pages/auth/magic-link"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<SplashVisual message="Loading…" />}>
      <Routes>
        {/* Auth layout wraps ALL auth pages */}
        <Route element={<AuthLayout />}>
          {/* Public-only pages get the gate */}
          <Route
            element={
              <PublicOnlyRoute>
                <Outlet />
              </PublicOnlyRoute>
            }
          >
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="login/check-email" element={<CheckEmailPage />} />
          </Route>

          {/* Magic link stays OUTSIDE the public-only gate, but still in AuthLayout */}
          <Route path="login/magic" element={<MagicLinkCallback />} />
        </Route>

        {/* Always-accessible 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="/403" element={<Forbidden />} />

        {/* Workspace selection (protected) */}
        <Route
          path="select-workspace"
          element={
            <ProtectedRoute>
              <WorkspaceSelectionPage />
            </ProtectedRoute>
          }
        />
        {/* Workspace selection (protected) */}
        <Route
          path="care-standard360"
          element={
            <ProtectedRoute>
              <AdminLayout></AdminLayout>
            </ProtectedRoute>
          }
        >
          {adminChildRoutes}
        </Route>

        {/* Protected app */}
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

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
