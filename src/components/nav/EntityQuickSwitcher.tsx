import * as React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Plus, Search, ChevronDown, LayoutGrid } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export type SwitcherItem = {
  id: string;
  name: string;
  meta?: string;
  avatar?: string;
};

type CommonButton = {
  label: string;
  onClick?: () => void;
  to?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type EntityQuickSwitcherProps = {
  /** Items to show in the list */
  items: SwitcherItem[];

  /** Key of the route param that holds the active id (e.g. "clientId", "staffId") */
  paramKey: string;

  /** Path segment that precedes the :id (e.g. "/app/clients", "/app/staff") */
  basePath: string;

  /** Compute destination when a row is chosen.
   *  Receives (id, preservedSubpath) -> full path string.
   *  Defaults to `${basePath}/${id}${preservedSubpath}`
   */
  buildPath?: (id: string, sub: string) => string;

  /** Default subpath if the URL has no extra segment (e.g. "/overview") */
  defaultSubpath?: string;

  /** Header label above the list */
  listLabel?: string;

  /** Placeholder for the search input */
  searchPlaceholder?: string;

  /** Text to show when there are no matches */
  emptyText?: string;

  /** Primary button (e.g. "Add new client") shown in the footer */
  primaryAction?: CommonButton;

  /** Secondary button (e.g. "Browse all") shown in the footer (right-aligned) */
  secondaryAction?: CommonButton;

  /** Optional className for the trigger button */
  className?: string;

  /** Optional controlled active id (overrides param value) */
  activeIdOverride?: string;
};

function Icon({ Cmp, className }: { Cmp?: any; className?: string }) {
  return Cmp ? <Cmp className={className} /> : null;
}

export function EntityQuickSwitcher({
  items,
  paramKey,
  basePath,
  buildPath,
  defaultSubpath = "/overview",
  listLabel = "Items",
  searchPlaceholder = "Search…",
  emptyText = "No matches",
  primaryAction,
  secondaryAction,
  className,
  activeIdOverride,
}: EntityQuickSwitcherProps) {
  const params = useParams();
  const activeIdFromParams = params[paramKey] as string | undefined;

  const activeId = activeIdOverride ?? activeIdFromParams ?? items[0]?.id;
  const active = items.find((c) => c.id === activeId) ?? items[0];

  const navigate = useNavigate();
  const loc = useLocation();
  const { setOpenMobile } = useSidebar();

  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  // Preserve whatever subpath the user is on *after* /basePath/:id
  // Example: pathname: /app/clients/abc/visit-schedule  -> sub: /visit-schedule
  // If pathname is exactly /app/clients/abc, fall back to defaultSubpath
  const sub = React.useMemo(() => {
    // Escape slashes for a safe regex
    const escapedBase = basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`^${escapedBase}\\/[^/]+(\\/.*)?$`);
    const m = loc.pathname.match(re);
    return m?.[1] ?? defaultSubpath;
  }, [loc.pathname, basePath, defaultSubpath]);

  const filtered = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter(
      (c) =>
        c.name.toLowerCase().includes(t) ||
        (c.meta ? c.meta.toLowerCase().includes(t) : false)
    );
  }, [items, q]);

  const goTo = (id: string) => {
    const dest =
      buildPath?.(id, sub) ??
      `${basePath}/${encodeURIComponent(id)}${sub || ""}`;
    navigate(dest);
    setOpen(false);
    setOpenMobile(false);
  };

  // simple keyboard nav
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
            className
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <Avatar className="h-8 w-8">
            {active?.avatar ? (
              <AvatarImage src={active.avatar} alt={active?.name ?? "Avatar"} />
            ) : (
              <AvatarFallback>
                {active?.name?.slice(0, 2).toUpperCase() || "??"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-sm font-semibold">
              {active?.name ?? "Select"}
            </div>
            {active?.meta && (
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
        {/* Search */}
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={searchPlaceholder}
            className="h-8 border-0 shadow-none focus-visible:ring-0"
          />
        </div>

        {/* List */}
        <div role="listbox" className="max-h-72 overflow-y-auto px-1 py-1">
          <div className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">
            {listLabel}
          </div>

          {filtered.map((c, i) => {
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
                  "flex w-full items-center gap-3 rounded-md px-3 py-2",
                  isActive || isHover ? "bg-primary-accent" : "hover:bg-muted"
                )}
              >
                <Avatar>
                  {c.avatar ? (
                    <AvatarImage src={c.avatar} alt={c.name} />
                  ) : (
                    <AvatarFallback>
                      {c.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="min-w-0 text-left">
                  <div className="truncate text-sm font-medium">{c.name}</div>
                  {c.meta && (
                    <div className="truncate text-[11px] text-muted-foreground">
                      {c.meta}
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {!filtered.length && (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {(primaryAction || secondaryAction) && (
          <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
            {primaryAction ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-sm"
                onClick={() => {
                  setOpen(false);
                  if (primaryAction.onClick) return primaryAction.onClick();
                  if (primaryAction.to) navigate(primaryAction.to);
                }}
              >
                <Icon Cmp={primaryAction.icon ?? Plus} className="h-4 w-4" />
                {primaryAction.label}
              </Button>
            ) : (
              <span />
            )}

            {secondaryAction ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-sm"
                onClick={() => {
                  setOpen(false);
                  if (secondaryAction.onClick) return secondaryAction.onClick();
                  if (secondaryAction.to) navigate(secondaryAction.to);
                }}
              >
                <Icon
                  Cmp={secondaryAction.icon ?? LayoutGrid}
                  className="h-4 w-4"
                />
                {secondaryAction.label}
              </Button>
            ) : null}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
