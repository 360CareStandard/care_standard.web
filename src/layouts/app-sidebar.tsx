import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { AppTitle } from './app-title'
import { sidebarData } from "./data/sidebar-data";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { useLayout } from "@/context/layout-provider";

export function AppSidebar() {
  const { collapsible, variant } = useLayout();
  return (
    <Sidebar
      collapsible={collapsible}
      variant={variant}
      className=" bg-white pt-20"
    >
      <SidebarHeader className="border border-b">
        {/* <TeamSwitcher teams={sidebarData.teams} /> */}
        <NavUser user={sidebarData.user} />
        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent className=" bg-white">
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
