import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Plus, Search, LayoutGrid } from "lucide-react";

/** Basic shape for workspaces */
export type Workspace = {
  id: string;
  name: string;
  meta?: string; // e.g. "Admin" / "Member" / plan name
  avatar?: string; // optional logo
};

type Props = {
  workspaces: Workspace[];
  /** Current active workspace id */
  activeId?: string;
  /** Text used as the trigger label (e.g., org name) */
  triggerLabel?: string;
  /** Optional: override what happens when a workspace is selected */
  onSelect?: (ws: Workspace) => void;
  /**
   * Optional: customize the dest path from current subpath
   * Default: `/app/w/${id}${sub}`
   */
  buildPath?: (id: string, sub: string) => string;
  /** Default subpath when none is present in URL */
  defaultSubpath?: string; // default "/overview"
  /** ClassName for the trigger wrapper in the header */
  className?: string;
};

export function WorkspaceQuickSwitcher({
  workspaces,
  activeId,
  triggerLabel,
  onSelect,
  buildPath,
  defaultSubpath = "/overview",
  className,
}: Props) {
  const navigate = useNavigate();
  const loc = useLocation();

  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  const active =
    workspaces.find((w) => w.id === activeId) ?? workspaces[0] ?? undefined;

  // Preserve whatever subpath the user is on after /app/w/:workspaceId
  // Example: /app/w/abc/clients -> sub: /clients
  // If not on that pattern, we still keep the tail after "/app"
  const sub = React.useMemo(() => {
    // Try to match /app/w/:id/(sub?)
    const m = loc.pathname.match(/^\/app\/w\/[^/]+(\/.*)?$/);
    if (m?.[1]) return m[1];
    // Fallback: anything following "/app"
    const m2 = loc.pathname.match(/^\/app(\/.*)?$/);
    return m2?.[1] ?? defaultSubpath;
  }, [loc.pathname, defaultSubpath]);

  const filtered = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return workspaces;
    return workspaces.filter(
      (w) =>
        w.name.toLowerCase().includes(t) ||
        (w.meta ? w.meta.toLowerCase().includes(t) : false)
    );
  }, [q, workspaces]);

  const goTo = (w: Workspace) => {
    if (onSelect) {
      onSelect(w);
    } else {
      const dest =
        buildPath?.(w.id, sub) ?? `/app/w/${encodeURIComponent(w.id)}${sub}`;
      navigate(dest);
    }
    setOpen(false);
  };

  // keyboard nav
  const [hoverIdx, setHoverIdx] = React.useState(-1);
  React.useEffect(() => setHoverIdx(-1), [q, open]);

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
      goTo(filtered[hoverIdx]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* header trigger: org name + tiny triangle svg (your exact one) */}
        <button
          className={cn(
            "hidden md:flex gap-1 items-center text-sm font-semibold tracking-wide uppercase text-white/90 hover:text-white",
            className
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {triggerLabel ?? active?.name ?? "Select workspace"}
          <span className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-white/10">
            <svg
              width={14}
              height={10}
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M0.292114 0L7.00012 10.0002L13.2921 0H0.292114Z"
                fill="#98A2B3"
              />
            </svg>
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={8}
        className="w-[320px] p-0 shadow-2xl"
      >
        {/* Search */}
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search workspace…"
            className="h-8 border-0 shadow-none focus-visible:ring-0"
          />
        </div>

        {/* List */}
        <div role="listbox" className="max-h-72 overflow-y-auto px-1 py-1">
          <div className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">
            Your workspaces
          </div>
          {filtered.map((w, i) => {
            const isActive = w.id === active?.id;
            const isHover = i === hoverIdx;
            return (
              <button
                key={w.id}
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(-1)}
                onClick={() => goTo(w)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2",
                  isActive || isHover ? "bg-primary-accent" : "hover:bg-muted"
                )}
              >
                <Avatar>
                  {w.avatar ? (
                    <AvatarImage src={w.avatar} alt={w.name} />
                  ) : (
                    <AvatarFallback>
                      {w.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="min-w-0 text-left">
                  <div className="truncate text-sm font-medium">{w.name}</div>
                  {w.meta && (
                    <div className="truncate text-[11px] text-muted-foreground">
                      {w.meta}
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {!filtered.length && (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No matches
            </div>
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
              navigate("/app/workspaces/new");
            }}
          >
            <Plus className="h-4 w-4" />
            Create workspace
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-sm"
            onClick={() => {
              setOpen(false);
              navigate("/app/workspaces");
            }}
          >
            <LayoutGrid className="h-4 w-4" />
            Manage
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
