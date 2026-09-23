// routes/app.routes.tsx
import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import ContainerLayout from "@/layouts/container-layout";

//SuperAdmin
const Agencies = lazy(() => import("@/pages/admin"));

const adminChildRoutes = (
  <>
    <Route index element={<Navigate to="agencies" replace />} />

    {/* pages that should be boxed/padded */}
    <Route element={<ContainerLayout />}>
      <Route path="agencies" element={<Agencies />} />
      <Route
        path="*"
        element={<Navigate to="/care-standard360/agencies" replace />}
      />
    </Route>

    {/* <Route path="clients/:clientId" element={<ClientProfileLayout />}>
      <Route index element={<Navigate to="overview" replace />} />
      <Route path="overview" element={<ClientOverview />} />
      <Route path="info" element={<ClientInformation />} />
      <Route path="visit-schedule" element={<VisitSchedule />} />
      <Route path="care-plan" element={<CarePlan />} />
      <Route path="medication" element={<Medication />} />
      <Route path="care-circle" element={<CareCircle />} />
      <Route path="settings" element={<ClientSettings />} />
      <Route path="download" element={<ClientInfoDownload />} />
    </Route> */}
  </>
);

export default adminChildRoutes;
