import { Settings } from "lucide-react";
import {
  HomeIcon,
  UserSquareIcon,
  CalendarCircleIcon,
  NoteIcon,
  CapsuleIcon,
  PeopleIcon,
  DocumentDownloadIcon,
} from "@/assets/icons";
import React from "react";

type Item = {
  title: string;
  slug: string; // appended to /app/clients/:clientId
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  end?: boolean; // exact match (Overview should be exact)
};
type Group = { heading?: string; items: Item[] };

export const CLIENT_NAV: Group[] = [
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
      { title: "Health & Meds", slug: "medication", icon: CapsuleIcon },
      { title: "Care Circle", slug: "care-circle", icon: PeopleIcon },
    ],
  },
  {
    heading: "More Actions",
    items: [
      { title: "Settings", slug: "settings", icon: Settings },
      { title: "Download Info", slug: "download", icon: DocumentDownloadIcon },
    ],
  },
];
