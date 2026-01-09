// layouts/client-profile-layout.tsx
import { Outlet } from "react-router-dom";
import { Main } from "./main";
import { LayoutProvider } from "@/context/layout-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getCookie } from "@/lib/cookies";
import { ClientSidebar } from "./client-sidebar";

export default function ClientProfileLayout() {
  const defaultOpen = getCookie("sidebar_state") !== "false";
  return (
    <LayoutProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="mx-auto w-full px-4  py-2  flex  ">
          <ClientSidebar />

          <Main>
            <Outlet />
          </Main>
        </div>
      </SidebarProvider>
    </LayoutProvider>
  );
}
