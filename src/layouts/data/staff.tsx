import React from "react";
import { HomeIcon, UserSquareIcon, CalendarCircleIcon } from "@/assets/icons";
type Item = {
  title: string;
  slug: string; // appended to /app/clients/:clientId
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  end?: boolean; // exact match (Overview should be exact)
};
type Group = { heading?: string; items: Item[] };
export const STAFF_NAV: Group[] = [
  {
    items: [
      { title: "Overview", slug: "overview", icon: HomeIcon, end: true },
      { title: "Profile", slug: "profile", icon: UserSquareIcon },
      { title: "Schedule", slug: "schedule", icon: CalendarCircleIcon },
    ],
  },
];
