import { ClientStatus } from "@/types/client";
import {
  Banknote,
  Shield,
  Users,
  UserCheck, // or UserCog / ShieldCheck
} from "lucide-react";

export const callTypes = new Map<ClientStatus, string>([
  ["active", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["inactive", "bg-neutral-300/40 border-neutral-300"],
  ["invited", "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300"],
  [
    "paused",
    "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
  ],
]);

export const userTypes = [
  {
    label: "Superadmin",
    value: "superadmin",
    icon: Shield,
  },
  {
    label: "Admin",
    value: "admin",
    icon: UserCheck,
  },
  {
    label: "Manager",
    value: "manager",
    icon: Users,
  },
  {
    label: "Cashier",
    value: "cashier",
    icon: Banknote,
  },
] as const;
