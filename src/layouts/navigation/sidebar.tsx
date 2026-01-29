import {
  Sidebar,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

type NavItem = {
  title: string;
  slug: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  end?: boolean;
};

type NavGroup = {
  heading?: string;
  items: NavItem[];
};

type SidebarNavProps = {
  basePath: string;
  nav: NavGroup[];
  header?: React.ReactNode;
};

export function SidebarNav({ basePath, nav, header }: SidebarNavProps) {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="!bg-white pt-20 !w-[272px]"
    >
      {header && (
        <SidebarHeader className="border-b bg-white">{header}</SidebarHeader>
      )}

      <SidebarGroupContent className="px-3 !bg-white">
        {nav.map((group, gi) => (
          <div key={group.heading ?? gi} className="py-2">
            {gi > 0 && <div className="mx-2 mb-2 h-px bg-muted" />}

            {group.heading && (
              <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">
                {group.heading}
              </div>
            )}

            <SidebarMenu>
              {group.items.map((item) => {
                const to = `${basePath}/${item.slug}`;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.slug}>
                    <NavLink to={to} end={item.end}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          onClick={() => setOpenMobile(false)}
                          className={cn(
                            "group my-1 flex h-9 items-center gap-2 rounded px-2 text-[15px]",
                            "hover:bg-muted",
                            isActive &&
                              "!bg-primary-accent text-primary hover:bg-primary/15",
                          )}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="grid size-8 place-items-center text-muted-foreground">
                              <Icon className="w-5 h-5" />
                            </span>
                            <span
                              className={cn(
                                "truncate text-[14px]",
                                isActive && "font-medium",
                              )}
                            >
                              {item.title}
                            </span>
                          </span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        ))}
      </SidebarGroupContent>

      <SidebarRail />
    </Sidebar>
  );
}
