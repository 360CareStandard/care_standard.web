import { useParams } from "react-router-dom";
import { SidebarNav } from "./navigation/sidebar";
import { STAFF_NAV } from "./data/staff";
import StaffQuickSwitcher from "@/components/nav/StaffQuickSwitcher";

export function StaffSidebar() {
  const { staffId } = useParams<{ staffId: string }>();

  return (
    <SidebarNav
      basePath={`/app/staff/${staffId}`}
      nav={STAFF_NAV}
      header={<StaffQuickSwitcher />}
    />
  );
}
