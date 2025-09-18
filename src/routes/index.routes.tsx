// routes/index.tsx
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "@/App";
import SplashVisual from "@/layouts/splash-visual";
import AppLayout from "@/layouts/app-layout";
import appChildRoutes from "./app.routes";
import NotFound from "@/pages/404";

const AuthLayout = lazy(() => import("@/layouts/auth-layout"));
const Login = lazy(() => import("@/pages/auth/login-page"));
const CheckEmailPage = lazy(() => import("@/pages/auth/check-email-page"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<SplashVisual message="Loading…" />}>
      <Routes>
        <Route path="/design" element={<App />} />

        <Route element={<AuthLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="login/check-email" element={<CheckEmailPage />} />
          <Route path="/404" element={<NotFound />} />
        </Route>

        <Route path="app" element={<AppLayout />}>
          {appChildRoutes}
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
