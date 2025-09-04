// types/sidebar.ts
import type React from "react";
import type { To } from "react-router-dom"; // either To or LinkProps['to'] works

type User = {
  name: string;
  email: string;
  avatar: string;
};

type Team = {
  name: string;
  logo: React.ElementType; // or tighten: React.ComponentType<React.SVGProps<SVGSVGElement>>
  plan: string;
};

type BaseNavItem = {
  title: string;
  badge?: string;
  icon?: React.ElementType; // same note as above
};

// prefer To (includes string | Partial<Path>)
type Url = To; // or: type Url = LinkProps['to'];

type NavLink = BaseNavItem & {
  url: Url;
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: Url })[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

type NavGroup = {
  title: string;
  items: NavItem[];
};

type SidebarData = {
  user: User;
  teams: Team[];
  navGroups: NavGroup[];
};

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink };
