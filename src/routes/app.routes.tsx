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
// const ClientPersonal = lazy(() => import("@/pages/app/client/personal"));
// const ClientContacts = lazy(() => import("@/pages/app/client/contacts"));
// const ClientAddresses = lazy(() => import("@/pages/app/client/addresses"));

const appChildRoutes = (
  <>
    <Route index element={<Navigate to="clients" replace />} />

    {/* pages that should be boxed/padded */}
    <Route element={<ContainerLayout />}>
      <Route path="clients" element={<Clients />} />
      <Route path="staff" element={<Staff />} />
      {/* add other “boxed” pages here */}
    </Route>

    {/* client profile: its own layout & spacing */}
    <Route path="clients/:clientId" element={<ClientProfileLayout />}>
      <Route index element={<Navigate to="overview" replace />} />
      <Route path="overview" element={<ClientOverview />} />
      {/* <Route path="personal" element={<ClientPersonal />} />
      <Route path="contacts" element={<ClientContacts />} />
      <Route path="addresses" element={<ClientAddresses />} /> */}
    </Route>

    <Route path="*" element={<Navigate to="/app/clients" replace />} />
  </>
);

export default appChildRoutes;
