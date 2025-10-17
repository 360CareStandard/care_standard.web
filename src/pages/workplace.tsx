// src/pages/WorkspaceSelectionPage.tsx
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter as FilterIcon,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { useSelectWorkspace, useWorkspace } from "@/hooks/useWorkspace";
import type { AgencyMembership } from "@/types/workspace";
import { WorkspaceSelectionSkeleton } from "@/components/loading/workspace-selection-skeleton";
import SplashVisual from "@/layouts/splash-visual";

type Role = "Owner" | "Admin" | "Coordinator" | "Viewer";

// map API roles -> UI role badges
const mapRole = (roles: string[]): Role => {
  const r = roles[0]?.toLowerCase() ?? "";
  if (r.includes("owner")) return "Owner";
  if (r.includes("admin")) return "Admin";
  if (r.includes("coordinator")) return "Coordinator";
  return "Viewer";
};

const roleColor: Record<Role, string> = {
  Owner: "bg-slate-100 text-slate-700",
  Admin: "bg-emerald-100 text-emerald-800",
  Coordinator: "bg-blue-100 text-blue-800",
  Viewer: "bg-zinc-100 text-zinc-700",
};
const circleColors = [
  "bg-emerald-700",
  "bg-sky-700",
  "bg-amber-700",
  "bg-purple-700",
  "bg-stone-700",
  "bg-indigo-700",
  "bg-rose-700",
];
const colorFor = (id: string) =>
  circleColors[Math.abs(hash(id)) % circleColors.length];
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
}
const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function WorkspaceSelectionPage() {
  const navigate = useNavigate();

  const [q, setQ] = React.useState("");
  const [openFilter, setOpenFilter] = React.useState(false);
  const [roles, setRoles] = React.useState<Record<Role, boolean>>({
    Owner: false,
    Admin: false,
    Coordinator: false,
    Viewer: false,
  });
  const activeFilters = (Object.keys(roles) as Role[]).filter((r) => roles[r]);

  const { data, isLoading, isError, refetch } = useWorkspace();
  const { mutate: selectAgency, isPending: selecting } = useSelectWorkspace();

  // make this robust to your helper returning either {status,data:{agencies:[]}} or just {agencies:[]}
  const agencies: AgencyMembership[] =
    (data as any)?.data?.agencies ?? (data as any)?.agencies ?? [];

  const display = React.useMemo(
    () =>
      agencies.map((a) => ({
        agencyId: a.agencyId,
        name: a.agencyName,
        role: mapRole(a.roles) as Role,
      })),
    [agencies]
  );

  const filtered = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    return display.filter((w) => {
      const textOk = !t || w.name.toLowerCase().includes(t);
      const roleOk = activeFilters.length
        ? activeFilters.includes(w.role)
        : true;
      return textOk && roleOk;
    });
  }, [q, display, activeFilters]);

  const [hoverIdx, setHoverIdx] = React.useState(-1);

  const selectWs = (agencyId: string) => {
    selectAgency(
      { agencyId },
      {
        onSuccess: () => navigate("/app", { replace: true }),
        onError: () => alert("Unable to select workspace. Please try again."),
      }
    );
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filtered.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHoverIdx((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHoverIdx((i) => (i <= 0 ? filtered.length - 1 : i - 1));
    } else if (e.key === "Enter" && hoverIdx >= 0) {
      e.preventDefault();
      selectWs(filtered[hoverIdx].agencyId);
    }
  };

  if (selecting) {
    return <SplashVisual message="Loading Dashboard " />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Top brand bar */}
      <div className="fixed top-0 z-10 py-4 w-full flex justify-center bg-[#0A5A44] px-6">
        <Link to="/app">
          <img
            src="/logo/logo-care-standard.svg"
            alt="Care Standard 360+"
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-10 mt-20 space-y-6">
        <header className="mb-10">
          <h1 className="text-xl font-semibold">
            Care360 – Workspace Selection
          </h1>
          <p className="text-sm text-muted-foreground">Browse all workspaces</p>
        </header>

        {isLoading && <WorkspaceSelectionSkeleton />}
        {isError && (
          <div className="rounded-lg border bg-white px-6 py-10 text-center text-sm text-red-600">
            Could not load workspaces.{" "}
            <button className="underline" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Search + Filter */}
            <div className="mb-10 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search for a workspace"
                  className="pl-9 bg-white"
                  type="search"
                />
              </div>

              <Popover open={openFilter} onOpenChange={setOpenFilter}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <FilterIcon className="h-4 w-4" />
                    Filter
                    {activeFilters.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFilters.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Role
                  </p>
                  <div className="space-y-2">
                    {(
                      ["Owner", "Admin", "Coordinator", "Viewer"] as Role[]
                    ).map((role) => (
                      <label
                        key={role}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={roles[role]}
                          onCheckedChange={(v) =>
                            setRoles((s) => ({ ...s, [role]: Boolean(v) }))
                          }
                        />
                        <span>{role}</span>
                      </label>
                    ))}
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setRoles({
                          Owner: false,
                          Admin: false,
                          Coordinator: false,
                          Viewer: false,
                        })
                      }
                    >
                      Clear
                    </Button>
                    <Button size="sm" onClick={() => setOpenFilter(false)}>
                      Apply
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="mb-2 px-1 text-sm font-medium text-muted-foreground">
              All Workspaces
            </div>

            <section className="space-y-2">
              {filtered.map((w, i) => (
                <button
                  key={w.agencyId}
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(-1)}
                  onClick={() => selectWs(w.agencyId)}
                  disabled={selecting}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border bg-white px-3 py-4 text-left transition",
                    selecting ? "opacity-70 cursor-not-allowed" : "",
                    hoverIdx === i ? "bg-emerald-50" : "hover:bg-muted"
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        className={cn("text-white", colorFor(w.agencyId))}
                      >
                        {initials(w.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {w.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Workspace
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      className={cn("pointer-events-none", roleColor[w.role])}
                    >
                      {w.role}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}

              {!filtered.length && (
                <div className="flex flex-col  items-center justify-center  gap-3 ">
                  <img
                    src="/EmptyState.png"
                    alt="empty"
                    className="mx-auto  opacity-90"
                  />
                  <p className="font-semibold text-muted-foreground">
                    No workspaces available
                  </p>
                  <p className="text-sm text-muted-foreground ">
                    You don’t have any workspaces with this role assigned.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <button
        aria-label="Help & support"
        className="fixed bottom-6 right-6 grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-white shadow-lg"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
}
