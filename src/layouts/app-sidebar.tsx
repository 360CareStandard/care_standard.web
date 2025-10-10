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
import { NavLink, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
// import { NavUser } from "./nav-user";

import { ShieldAlert, Settings, Download } from "lucide-react";
import {
  HomeIcon,
  UserSquareIcon,
  CalendarCircleIcon,
  NoteIcon,
  HashtagIcon,
} from "@/assets/icons";
import { ClientQuickSwitcher } from "@/components/nav/ClientQuickSwitcher";

/* --- describe nav with slugs; we'll build full URLs from clientId --- */
type Item = {
  title: string;
  slug: string; // appended to /app/clients/:clientId
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  end?: boolean; // exact match (Overview should be exact)
};
type Group = { heading?: string; items: Item[] };

const NAV: Group[] = [
  {
    items: [
      { title: "Overview", slug: "overview", icon: HomeIcon, end: true },
      { title: "Client Info", slug: "info", icon: UserSquareIcon },
      {
        title: "Visit Schedule",
        slug: "visit-schedule",
        icon: CalendarCircleIcon,
      },
      { title: "Care Plan", slug: "care-plan", icon: NoteIcon },
    ],
  },
  {
    heading: "Health & Care",
    items: [
      { title: "Health & Meds", slug: "health", icon: HashtagIcon },
      { title: "Notes Media", slug: "notes", icon: HashtagIcon },
      { title: "Care Circle", slug: "circle", icon: HashtagIcon },
      { title: "Safety Risks", slug: "risks", icon: ShieldAlert },
    ],
  },
  {
    heading: "More Actions",
    items: [
      { title: "Clients Docs", slug: "docs", icon: HashtagIcon },
      { title: "Settings", slug: "settings", icon: Settings },
      { title: "Download Info", slug: "download", icon: Download },
    ],
  },
];

export function AppSidebar() {
  const { setOpenMobile } = useSidebar();
  const { clientId } = useParams<{ clientId: string }>();

  // Guard so we don't build malformed URLs if clientId isn't available yet.
  const base = clientId ? `/app/clients/${clientId}` : "/app/clients";

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="!bg-white pt-20 !w-[272px]"
    >
      {/* Top user block */}
      <SidebarHeader className="border-b bg-white">
        {/* <NavUser
          user={{
            name: "Jemmy Wilson",
            email: "Female • ~64 Years",
            avatar: "/images/smiley-elder-woman-standing-kitchen.png",
          }}
        /> */}

        <ClientQuickSwitcher />
      </SidebarHeader>

      <SidebarGroupContent className="px-3 !bg-white">
        {NAV.map((group, gi) => (
          <div key={group.heading ?? gi} className="py-2">
            {gi > 0 && <div className="mx-2 mb-2 h-px bg-muted" />}
            {group.heading ? (
              <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">
                {group.heading}
              </div>
            ) : null}

            <SidebarMenu>
              {group.items.map((item) => {
                const to = `${base}/${item.slug}`;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.slug}>
                    {/* NavLink render prop exposes isActive correctly even with dynamic params */}
                    <NavLink to={to} end={item.end}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={cn(
                            "group relative my-1 flex items-center gap-2 !rounded-[4px] px-2 !py-4 text-[15px]",
                            "hover:bg-muted",
                            isActive &&
                              "!bg-primary-accent text-primary  hover:bg-primary/15"
                          )}
                          onClick={() => setOpenMobile(false)}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="grid size-8 place-items-center text-muted-foreground">
                              <Icon />
                            </span>
                            <span
                              className={cn(
                                "truncate text-[14px]",
                                isActive && "font-medium"
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
