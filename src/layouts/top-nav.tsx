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
          {/* NOTE: remove modal={false} for better touch behavior */}
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="md:size-7 bg-transparent"
              aria-label="Open menu"
            >
              <Menu />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            {links.map(({ title, href, disabled }) => (
              <DropdownMenuItem
                key={`${title}-${href}`}
                disabled={!!disabled}
                // Use onSelect for Radix items; navigate imperatively
                onSelect={(e) => {
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

      {/* Desktop: horizontal nav */}
      <nav
        className={cn("hidden items-center lg:flex gap-6 xl:gap-8", className)}
        {...props}
      >
        {links.map(({ title, href, disabled }) => {
          const active = isActive(href);
          return disabled ? (
            <span
              key={`${title}-${href}`}
              className="text-sm font-medium text-white/50 cursor-not-allowed"
              aria-disabled="true"
            >
              {title}
            </span>
          ) : (
            <Link
              key={`${title}-${href}`}
              to={appPath(href)}
              className={cn(
                "text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white rounded-lg px-3 py-1.5 shadow-sm"
                  : "text-white/80 hover:text-white"
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
