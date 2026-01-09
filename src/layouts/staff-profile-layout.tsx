// layouts/client-profile-layout.tsx
import { Outlet } from "react-router-dom";
import { Main } from "./main";
import { LayoutProvider } from "@/context/layout-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getCookie } from "@/lib/cookies";
import { StaffSidebar } from "./staff-sidebar";

export default function StaffProfileLayout() {
  const defaultOpen = getCookie("sidebar_state") !== "false";
  return (
    <LayoutProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="mx-auto w-full px-4  py-2  flex  ">
          <StaffSidebar />

          <Main>
            <Outlet />
          </Main>
        </div>
      </SidebarProvider>
    </LayoutProvider>
  );
}
