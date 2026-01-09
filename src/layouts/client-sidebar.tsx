import { useParams } from "react-router-dom";
import { SidebarNav } from "./navigation/sidebar";
import { CLIENT_NAV } from "./data/client";
import ClientQuickSwitcher from "@/components/nav/ClientQuickSwitcher";

export function ClientSidebar() {
  const { clientId } = useParams<{ clientId: string }>();

  const basePath = clientId ? `/app/clients/${clientId}` : "/app/clients";

  return (
    <SidebarNav
      basePath={basePath}
      nav={CLIENT_NAV}
      header={<ClientQuickSwitcher />}
    />
  );
}
