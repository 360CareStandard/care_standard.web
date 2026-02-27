import React from "react";
import { HomeIcon, UserSquareIcon } from "@/assets/icons";
import {
  Calendar2,
  Clock,
  DocumentText,
  People,
} from "iconsax-react";
type Item = {
  title: string;
  slug: string; // appended to /app/clients/:clientId
  icon:
  | React.ComponentType<React.SVGProps<SVGSVGElement>>
  | React.JSXElementConstructor<any>;
  end?: boolean; // exact match (Overview should be exact)
};
type Group = { heading?: string; items: Item[] };
export const STAFF_NAV: Group[] = [
  {
    items: [
      { title: "Overview", slug: "overview", icon: HomeIcon, end: true },
      { title: "Staff Info", slug: "info", icon: UserSquareIcon },
      {
        title: "Onboarding & Documents",
        slug: "documents",
        icon: DocumentText,
      },
    ],
  },
  {
    heading: "Work & Care",
    items: [
      { title: "Clients", slug: "clients", icon: People },
      { title: "Availability", slug: "availability", icon: Calendar2 },
      { title: "Visits", slug: "visits", icon: Clock },
    ],
  },
  // {
  //   heading: "Access & Activity",
  //   items: [
  //     { title: "Permissions", slug: "permissions", icon: Setting2 },
  //     { title: "Activity Log", slug: "activity-log", icon: Activity },
  //   ],
  // },
];
