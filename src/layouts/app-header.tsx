import { ChevronDown, Bell } from "lucide-react";
import { Header } from "./header";
import { TopNav } from "./top-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProfileDropdown from "@/components/shared/profile-dropdown";

import {
  Workspace,
  WorkspaceQuickSwitcher,
} from "@/components/nav/WorkspaceSwitcher";

import { useAuthStore } from "@/stores/auth-store";
import { useWorkspace, useSelectWorkspace } from "@/hooks/useWorkspace";
import * as React from "react";
import { useNavigate } from "react-router-dom";

/** ===== Helpers to keep role/meta consistent with onboarding page ===== */
type Role = "Owner" | "Admin" | "Coordinator" | "Viewer";
const mapRole = (roles: string[]): Role => {
  const r = roles[0]?.toLowerCase() ?? "";
  if (r.includes("owner")) return "Owner";
  if (r.includes("admin")) return "Admin";
  if (r.includes("coordinator")) return "Coordinator";
  return "Viewer";
};

function Logo() {
  return (
    <a
      href="/"
      className="flex justify-center w-28 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm"
      aria-label="Care360 Standard home"
      title="Care360 Standard"
      draggable={false}
    >
      <img
        src="/logo/logo-care-standard.svg"
        alt="Care360 Standard"
        className="h-12 w-auto select-none"
        draggable={false}
      />
    </a>
  );
}

const links = [
  { title: "Clients", href: "/clients" },
  { title: "Staff", href: "/staff" },
  { title: "Shift Roster", href: "/shift-roster" },
  // { title: "Inbox", href: "/inbox" },
  { title: "Activity", href: "/activity" },
  { title: "Finance", href: "/finance" },
  { title: "Safeguarding", href: "/safeguarding" },
];

function getInitials(first?: string | null, last?: string | null) {
  const f = (first ?? "").trim();
  const l = (last ?? "").trim();
  if (!f && !l) return "U";
  return `${f[0] ?? ""}${l[0] ?? ""}`.toUpperCase() || "U";
}

export function AppHeader() {
  const { user, workspace: activeWsFromState } = useAuthStore();
  const initials = getInitials(user?.firstname, user?.lastname);

  const { data, isLoading } = useWorkspace();
  const { mutate: selectAgency, isPending: selecting } = useSelectWorkspace();

  const navigate = useNavigate();

  /** Same robustness you used on onboarding */
  const agencies =
    (data as any)?.data?.agencies ?? (data as any)?.agencies ?? [];

  /** Map API -> switcher Workspaces */
  const workspaces: Workspace[] = React.useMemo(
    () =>
      agencies.map((a: any) => ({
        id: a.agencyId,
        name: a.agencyName,
        meta: mapRole(a.roles), // "Owner" | "Admin" | ...
        avatar: a.logoUrl, // if you have one; harmless if undefined
      })),
    [agencies],
  );

  /** Currently active workspace id (fallback to first if absent) */
  const activeId =
    activeWsFromState?.id ?? (workspaces.length ? workspaces[0].id : undefined);

  const handleSelect = React.useCallback(
    (w: Workspace) => {
      selectAgency(
        { agencyId: w.id },
        {
          onSuccess: () => navigate("/app", { replace: true }), // ← your actual root route
          onError: () =>
            alert("Unable to switch workspace right now. Please try again."),
        },
      );
    },
    [selectAgency, navigate],
  );

  return (
    <Header
      fixed
      role="banner"
      className="fixed top-0 z-50 text-white backdrop-blur border-b border-white/10 pt-[max(env(safe-area-inset-top),0px)] bg-[#01301F]"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-black px-3 py-2 rounded"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex w-full items-center gap-3 sm:gap-6 px-3 sm:px-6 h-14">
        {/* left: logo */}
        <Logo />

        {/* middle: primary nav */}
        <TopNav links={links} className="ml-2 hidden md:flex" />

        {/* right: actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Notifications"
            title="Notifications"
            type="button"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Workspace switcher — now using real data & updating workspace */}
          <WorkspaceQuickSwitcher
            workspaces={workspaces}
            activeId={activeId}
            triggerLabel={
              activeWsFromState?.tradingName ||
              activeWsFromState?.legalName ||
              "Select workspace"
            }
            onSelect={handleSelect}
            // ← remove buildPath, sub logic, and selecting/isLoading className — all handled inside handleSelect now
            className={
              selecting || isLoading ? "opacity-60 pointer-events-none" : ""
            }
          />

          <ProfileDropdown
            name={
              `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() ||
              "User"
            }
            email={user?.email ?? ""}
            role={
              Array.isArray((user as any)?.roles)
                ? (user as any).roles[0]
                : "Admin"
            }
            workspaceName={
              activeWsFromState?.tradingName || activeWsFromState?.legalName
            }
            onOpenWorkspaceSwitcher={() => navigate("/app/workspaces")}
            onOpenAccount={() => navigate("/user/settings")}
            onOpenOrgSettings={() =>
              navigate(
                `/app/w/${encodeURIComponent(
                  activeWsFromState?.id ?? "",
                )}/settings`,
              )
            }
          >
            <button
              type="button"
              className="flex items-center gap-3 rounded-full hover:bg-white/10 px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              aria-label="Open profile menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#FFECE5] font-medium text-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col leading-tight text-left">
                <span className="text-sm">
                  {user?.firstname ?? "User"} {user?.lastname ?? ""}
                </span>
                <span className="text-xs text-white/70">
                  {Array.isArray((user as any)?.roles) && (user as any).roles[0]
                    ? (user as any).roles[0]
                    : "Admin"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-80" aria-hidden="true" />
            </button>
          </ProfileDropdown>
        </div>
      </div>
    </Header>
  );
}
