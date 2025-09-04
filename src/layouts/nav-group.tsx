import { type ReactNode } from "react";
import { Link, type To, useMatch, useResolvedPath } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type NavGroup as NavGroupProps,
} from "./types/sidebar";

/* --- helpers --- */
function useIsActive(to: To, opts?: { end?: boolean }) {
  const path = useResolvedPath(to);
  const match = useMatch({ path: path.pathname, end: opts?.end ?? true });
  return !!match;
}
function toUrlString(to?: To): string {
  if (!to) return "";
  if (typeof to === "string") return to;
  const pathname = to.pathname ?? "";
  const search = to.search ?? "";
  const hash = to.hash ?? "";
  return `${pathname}${search}${hash}`;
}
function isCollapsible(i: NavItem): i is NavCollapsible {
  return "items" in i && Array.isArray(i.items);
}
function isLink(i: NavItem): i is NavLink {
  return "url" in i;
}

/* --- components --- */
export function NavGroup({ title, items }: NavGroupProps) {
  const { state, isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = isLink(item)
            ? `${item.title}-${toUrlString(item.url)}`
            : `${item.title}-group`;

          if (isLink(item)) {
            return <SidebarMenuLink key={key} item={item} />; // ⬅ no href
          }

          if (state === "collapsed" && !isMobile) {
            return <SidebarMenuCollapsedDropdown key={key} item={item} />;
          }

          return <SidebarMenuCollapsible key={key} item={item} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>;
}

function SidebarMenuLink({ item }: { item: NavLink }) {
  const { setOpenMobile } = useSidebar();
  const isActive = useIsActive(item.url, { end: true });

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className="relative py-4 data-[active=true]:bg-primary-accent data-[active=true]:text-primary
                   data-[active=true]:font-medium
                   data-[active=true]:before:absolute data-[active=true]:before:left-0
                   data-[active=true]:before:w-1 data-[active=true]:before:rounded-full
                   data-[active=true]:before:bg-primary"
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarMenuCollapsible({ item }: { item: NavCollapsible }) {
  // NB: keep hooks at top level; compute child actives inside a child component (see SubItem)
  const anyChildActive = item.items.some((sub) => useIsActive(sub.url));
  return (
    <Collapsible
      asChild
      defaultOpen={anyChildActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={anyChildActive}
            className="relative data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map((sub) => (
              <SubItem
                key={`${sub.title}-${toUrlString(sub.url)}`}
                item={sub}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

/* sub-item as its own component so we can use hooks safely */
function SubItem({ item }: { item: NavLink }) {
  const { setOpenMobile } = useSidebar();
  const active = useIsActive(item.url, { end: true });
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        asChild
        isActive={active}
        className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

function SidebarMenuCollapsedDropdown({ item }: { item: NavCollapsible }) {
  const anyChildActive = item.items.some((sub) => useIsActive(sub.url));

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={anyChildActive}
            className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => {
            const active = useIsActive(sub.url, { end: true });
            return (
              <DropdownMenuItem
                key={`${sub.title}-${toUrlString(sub.url)}`}
                asChild
              >
                <Link
                  to={sub.url}
                  className={active ? "bg-primary/10 text-primary" : ""}
                >
                  {sub.icon && <sub.icon />}
                  <span className="max-w-52 text-wrap">{sub.title}</span>
                  {sub.badge && (
                    <span className="ms-auto text-xs">{sub.badge}</span>
                  )}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
