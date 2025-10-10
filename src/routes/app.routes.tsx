// routes/app.routes.tsx
import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import ContainerLayout from "@/layouts/container-layout";
import ClientProfileLayout from "@/layouts/client-profile-layout";

const Clients = lazy(() => import("@/pages/app/clients"));
const Staff = lazy(() => import("@/pages/app/staff"));
const ClientOverview = lazy(
  () => import("@/pages/app/clients/client/overview")
);
const ClientInformation = lazy(
  () => import("@/pages/app/clients/client/information")
);
const VisitSchedule = lazy(
  () => import("@/pages/app/clients/client/visit-schedule")
);

const appChildRoutes = (
  <>
    <Route index element={<Navigate to="clients" replace />} />

    {/* pages that should be boxed/padded */}
    <Route element={<ContainerLayout />}>
      <Route path="clients" element={<Clients />} />
      <Route path="staff" element={<Staff />} />
    </Route>

    {/* client profile: its own layout & spacing */}
    <Route path="clients/:clientId" element={<ClientProfileLayout />}>
      <Route index element={<Navigate to="overview" replace />} />
      <Route path="overview" element={<ClientOverview />} />
      <Route path="info" element={<ClientInformation />} />
      <Route path="visit-schedule" element={<VisitSchedule />} />
    </Route>

    <Route path="*" element={<Navigate to="/app/clients" replace />} />
  </>
);

export default appChildRoutes;
