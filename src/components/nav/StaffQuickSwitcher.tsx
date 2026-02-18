// src/components/nav/ClientQuickSwitcher.tsx
import * as React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Plus, Search, ChevronDown, LayoutGrid, RefreshCw } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useStaff } from "@/hooks/staff/useStaff";

type StaffSmall = {
  id: string;
  name: string;
  meta?: string;
  avatar?: string | null;
};

type Props = {
  className?: string;
};

export function StaffQuickSwitcher({ className }: Props) {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  const loc = useLocation();
  const { setOpenMobile } = useSidebar();

  // Fetch a small page of clients from the API (page 1, limit 10)
  const {
    data: staffData,
    isLoading,
    isFetching,
    isError,
    // error,
    refetch,
  } = useStaff({
    page: 1,
    limit: 10,
  });

  // Map server response -> lightweight client objects used by the switcher.
  const apiStaff: StaffSmall[] = React.useMemo(() => {
    if (!staffData) return [];
    return staffData.staffs.map((c) => ({
      id: c.id,
      name:
        `${c.user?.firstname ?? ""} ${c.user?.lastname ?? ""}`.trim() ||
        "Unknown",
      meta:
        (c?.gender
          ? `${String(c.gender).replace(/^\w/, (s) => s.toUpperCase())} • `
          : "") +
        (c?.dob
          ? `${Math.max(
              0,
              new Date().getFullYear() - new Date(c.dob).getFullYear(),
            )} years`
          : ""),
      avatar: c.profilePicture ?? null, // API currently provides no avatars; keep null fallback
    }));
  }, [staffData]);

  // Use only API staff (no demo fallback). When empty -> show "No staff".
  const staff = apiStaff;

  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  // current subpath after /app/staff/:staffId (e.g. "/visit-schedule")
  const sub = React.useMemo(() => {
    const m = loc.pathname.match(/^\/app\/staff\/[^/]+(\/.*)?$/);
    return m?.[1] ?? "/overview";
  }, [loc.pathname]);

  // Prefer route param for active staff; if absent and staff exist use first
  const activeId = staffId ?? staff[0]?.id;
  const active = staff.find((c) => c.id === activeId) ?? staff[0];

  const filtered = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return staff;
    return staff.filter(
      (c) =>
        c.name.toLowerCase().includes(t) || c.meta?.toLowerCase().includes(t),
    );
  }, [staff, q]);

  const goTo = (id: string) => {
    navigate(`/app/staff/${id}${sub}`);
    setOpen(false);
    setOpenMobile(false);
  };

  // keyboard navigation
  const listRef = React.useRef<HTMLDivElement>(null);
  const [hoverIdx, setHoverIdx] = React.useState<number>(-1);
  React.useEffect(() => setHoverIdx(-1), [q, open]); // reset when query or open changes

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
      goTo(filtered[hoverIdx].id);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:bg-muted",
            className,
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <Avatar className="h-11 w-11 text-black">
            {active?.avatar ? (
              <AvatarImage
                src={active?.avatar || ""}
                alt={`${active?.name} avatar`}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback>
              {active?.name?.slice(0, 2).toUpperCase() || "CL"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-sm font-semibold">
              {active?.name ??
                (isLoading ? <span>Loading…</span> : "Select client")}
            </div>

            {isFetching && !isLoading && (
              <div className="truncate text-xs text-muted-foreground">
                Updating…
              </div>
            )}

            {!isFetching && active?.meta && (
              <div className="truncate text-xs text-muted-foreground">
                {active.meta}
              </div>
            )}
          </div>

          <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-[320px] p-0 shadow-2xl"
      >
        {/* Header: search + actions */}
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search staff…"
            className="h-8 border-0 shadow-none focus-visible:ring-0"
          />

          <div className="ml-auto flex items-center gap-2">
            {isLoading ? (
              <Skeleton className="h-8 w-8 rounded" />
            ) : isError ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  refetch();
                }}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/app/staff")}
                className="gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* List */}
        <div
          ref={listRef}
          role="listbox"
          className="max-h-72 overflow-y-auto px-1 py-1"
        >
          <div className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">
            Staff
          </div>

          {/* Loading skeleton */}
          {isLoading ? (
            <div className="space-y-2 px-2 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2"
                >
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-36 mb-1" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="px-3 py-4 text-sm text-center text-red-600">
              Failed to load staff.
            </div>
          ) : staff.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No staff found.
            </div>
          ) : (
            filtered.map((c, i) => {
              const isActive = c.id === activeId;
              const isHover = i === hoverIdx;
              return (
                <button
                  key={c.id}
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(-1)}
                  onClick={() => goTo(c.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left",
                    isActive || isHover
                      ? "bg-primary-accent"
                      : "hover:bg-muted",
                  )}
                >
                  <Avatar className="h-9 w-9">
                    {c?.avatar ? (
                      <AvatarImage
                        src={c?.avatar || ""}
                        alt={`${c?.name} avatar`}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback>
                      {c.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    {c.meta && (
                      <div className="truncate text-[11px] text-muted-foreground">
                        {c.meta}
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-sm"
            onClick={() => {
              setOpen(false);
              navigate("/app/staff/new");
            }}
          >
            <Plus className="h-4 w-4" />
            Add new staff
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-sm"
            onClick={() => {
              setOpen(false);
              navigate("/app/staff");
            }}
          >
            <LayoutGrid className="h-4 w-4" />
            Browse all
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default StaffQuickSwitcher;
