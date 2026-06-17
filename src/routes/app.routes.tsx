// routes/app.routes.tsx
import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import ContainerLayout from "@/layouts/container-layout";
import ClientProfileLayout from "@/layouts/client-profile-layout";
import StaffProfileLayout from "@/layouts/staff-profile-layout";

const Clients = lazy(() => import("@/pages/app/clients"));
const Staff = lazy(() => import("@/pages/app/staff"));
const ClientOverview = lazy(
  () => import("@/pages/app/clients/client/overview"),
);
const ClientInformation = lazy(
  () => import("@/pages/app/clients/client/information"),
);
const VisitSchedule = lazy(
  () => import("@/pages/app/clients/client/visit-schedule"),
);
const CarePlan = lazy(() => import("@/pages/app/clients/client/care-plan"));
const Medication = lazy(() => import("@/pages/app/clients/client/medications"));
const CareCircle = lazy(() => import("@/pages/app/clients/client/care-circle"));
const ClientSettings = lazy(
  () => import("@/pages/app/clients/client/settings"),
);
const ClientInfoDownload = lazy(
  () => import("@/pages/app/clients/client/download-info"),
);

//Staff
const StaffOverview = lazy(() => import("@/pages/app/staff/overview"));
const StaffInformation = lazy(() => import("@/pages/app/staff/information"));
const StaffDocuments = lazy(() => import("@/pages/app/staff/document"));
const StaffClients = lazy(() => import("@/pages/app/staff/clients"));
const StaffAvailability = lazy(() => import("@/pages/app/staff/availability"));
const StaffVisit = lazy(() => import("@/pages/app/staff/visits"));
const StaffPermissions = lazy(() => import("@/pages/app/staff/permissions"));

//Shift Roster
const ShiftRoster = lazy(() => import("@/pages/app/shift-roaster"));
//Activity
const Activity = lazy(() => import("@/pages/app/activity"));
//Safeguarding
const Safeguarding = lazy(() => import("@/pages/app/safeguarding"));
//Finance
const Finance = lazy(() => import("@/pages/app/finance"));
//Company Settings
const CompanySettings = lazy(() => import("@/pages/app/settings"));
const appChildRoutes = (
  <>
    <Route index element={<Navigate to="clients" replace />} />

    {/* pages that should be boxed/padded */}
    <Route element={<ContainerLayout />}>
      <Route path="clients" element={<Clients />} />
      <Route path="staff" element={<Staff />} />
      <Route path="activity" element={<Activity />} />
      <Route path="safeguarding" element={<Safeguarding />} />
      <Route path="company-settings" element={<CompanySettings />} />
    </Route>
    <Route>
      <Route path="shift-roster" element={<ShiftRoster />} />
      <Route path="finance" element={<Finance />} />
    </Route>

    {/* client profile: its own layout & spacing */}
    <Route path="clients/:clientId" element={<ClientProfileLayout />}>
      <Route index element={<Navigate to="overview" replace />} />
      <Route path="overview" element={<ClientOverview />} />
      <Route path="info" element={<ClientInformation />} />
      <Route path="visit-schedule" element={<VisitSchedule />} />
      <Route path="care-plan" element={<CarePlan />} />
      <Route path="medication" element={<Medication />} />
      <Route path="care-circle" element={<CareCircle />} />
      <Route path="settings" element={<ClientSettings />} />
      <Route path="download" element={<ClientInfoDownload />} />
      <Route path="*" element={<Navigate to="/app/clients" replace />} />
    </Route>
    <Route path="staff/:staffId" element={<StaffProfileLayout />}>
      <Route index element={<Navigate to="overview" replace />} />
      <Route path="overview" element={<StaffOverview />} />
      <Route path="info" element={<StaffInformation />} />
      <Route path="documents" element={<StaffDocuments />} />
      <Route path="clients" element={<StaffClients />} />
      <Route path="availability" element={<StaffAvailability />} />
      <Route path="visits" element={<StaffVisit />} />
      <Route path="permissions" element={<StaffPermissions />} />
      <Route path="*" element={<Navigate to="/app/staff" replace />} />
    </Route>
  </>
);

export default appChildRoutes;
