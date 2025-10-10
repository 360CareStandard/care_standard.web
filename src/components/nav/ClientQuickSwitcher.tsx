// components/nav/ClientQuickSwitcher.tsx
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

type Client = {
  id: string;
  name: string;
  meta?: string; // e.g. "Female • ~64 Years"
  avatar?: string;
};

type Props = {
  clients?: Client[]; // optional; falls back to DEMO_CLIENTS
  className?: string;
};

const DEMO_CLIENTS: Client[] = [
  {
    id: "jemmy-w",
    name: "Jemmy Wilson",
    meta: "Female • ~64 Years",
    avatar: "/images/smiley-elder-woman-standing-kitchen.png",
  },
  { id: "robert-w", name: "Robert Wilson", meta: "Male • ~68 Years" },
  { id: "eliza-w", name: "Elizabeth Wilson", meta: "Female • ~36 Years" },
];

export function ClientQuickSwitcher({
  clients = DEMO_CLIENTS,
  className,
}: Props) {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const loc = useLocation();
  const { setOpenMobile } = useSidebar();

  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  // current subpath after /app/clients/:clientId
  // e.g. "/visit-schedule", "/overview" (default)
  const sub = React.useMemo(() => {
    const m = loc.pathname.match(/^\/app\/clients\/[^/]+(\/.*)?$/);
    return m?.[1] ?? "/overview";
  }, [loc.pathname]);

  const activeId = clientId ?? clients[0]?.id;
  const active = clients.find((c) => c.id === activeId) ?? clients[0];

  const filtered = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(t) || c.meta?.toLowerCase().includes(t)
    );
  }, [clients, q]);

  const goTo = (id: string) => {
    navigate(`/app/clients/${id}${sub}`);
    setOpen(false);
    setOpenMobile(false);
  };

  // simple keyboard nav
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
            className
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <Avatar className="h-8 w-8">
            {active?.avatar ? (
              <AvatarImage src={active.avatar} alt={active.name} />
            ) : (
              <AvatarFallback>
                {active?.name?.slice(0, 2).toUpperCase() || "CL"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-sm font-semibold">
              {active?.name ?? "Select client"}
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
            placeholder="Search client…"
            className="h-8 border-0 shadow-none focus-visible:ring-0"
          />
        </div>

        {/* List */}
        <div
          ref={listRef}
          role="listbox"
          className="max-h-72 overflow-y-auto px-1 py-1"
        >
          <div className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">
            Clients list
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
              navigate("/app/clients/new");
            }}
          >
            <Plus className="h-4 w-4" />
            Add new client
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-sm"
            onClick={() => {
              setOpen(false);
              navigate("/app/clients");
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
