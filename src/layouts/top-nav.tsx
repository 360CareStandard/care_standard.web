import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appPath } from "@/lib/app-path";

type TopNavProps = React.HTMLAttributes<HTMLElement> & {
  links: { title: string; href: string; disabled?: boolean }[];
};

export function TopNav({ className, links, ...props }: TopNavProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) => {
    const target = appPath(href);
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  return (
    <>
      {/* Mobile: hamburger dropdown */}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 text-white hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="start" sideOffset={8}>
            {links.map(({ title, href, disabled }) => (
              <DropdownMenuItem
                key={`${title}-${href}`}
                disabled={!!disabled}
                onSelect={() => {
                  if (disabled) return;
                  navigate(appPath(href));
                }}
                className={cn(
                  "cursor-pointer",
                  isActive(href) && "font-semibold"
                )}
              >
                {title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop: horizontal nav (no wrap, scroll if overflow) */}
      <nav
        className={cn(
          "hidden lg:flex items-center gap-2",
          "max-w-full overflow-x-auto whitespace-nowrap scrollbar-none nav-mask",
          className
        )}
        aria-label="Primary"
        {...props}
      >
        {links.map(({ title, href, disabled }) => {
          const active = isActive(href);

          if (disabled) {
            return (
              <span
                key={`${title}-${href}`}
                className="px-3 py-1.5 text-sm font-medium text-white/50 cursor-not-allowed"
                aria-disabled="true"
              >
                {title}
              </span>
            );
          }

          return (
            <Link
              key={`${title}-${href}`}
              to={appPath(href)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              {title}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
