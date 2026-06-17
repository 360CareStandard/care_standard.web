import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Search, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type Workspace = {
  id: string;
  name: string;
  meta?: string;
  avatar?: string;
};

type Props = {
  workspaces: Workspace[];
  activeId?: string;
  triggerLabel?: string;
  onSelect: (ws: Workspace) => void; // now required, no internal fallback
  isPending?: boolean; // passed from parent so trigger shows "Switching..."
  className?: string;
};

export function WorkspaceQuickSwitcher({
  workspaces,
  activeId,
  triggerLabel,
  onSelect,
  isPending = false,
  className,
}: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  const active =
    workspaces.find((w) => w.id === activeId) ?? workspaces[0] ?? undefined;

  const filtered = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return workspaces;
    return workspaces.filter(
      (w) =>
        w.name.toLowerCase().includes(t) ||
        (w.meta ? w.meta.toLowerCase().includes(t) : false),
    );
  }, [q, workspaces]);

  const goTo = (w: Workspace) => {
    onSelect(w);
    setOpen(false);
  };

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
        <button
          className={cn(
            "hidden md:flex gap-1 items-center text-sm font-semibold tracking-wide uppercase text-white/90 hover:text-white",
            className,
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={isPending}
        >
          {isPending
            ? "Switching..."
            : (triggerLabel ?? active?.name ?? "Select workspace")}
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
                disabled={isPending}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(-1)}
                onClick={() => goTo(w)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2",
                  isPending ? "opacity-50 cursor-not-allowed" : "",
                  isActive || isHover ? "bg-primary-accent" : "hover:bg-muted",
                )}
              >
                <Avatar>
                  {w.avatar ? (
                    <AvatarImage src={w.avatar} alt={w.name} />
                  ) : (
                    <AvatarFallback className="text-sm">
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

        <div className="flex items-center gap-2 border-t px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-sm"
            onClick={() => {
              setOpen(false);
              navigate("/select-workspace");
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
