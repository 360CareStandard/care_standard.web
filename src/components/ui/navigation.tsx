import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, User, Hash, Settings, Download } from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  active?: boolean;
  badge?: string;
}

interface TopNavigationProps {
  logo?: string;
  items: NavItem[];
  userEmail?: string;
  className?: string;
}

export function TopNavigation({
  items,
  userEmail,
  className,
}: TopNavigationProps) {
  return (
    <nav
      className={cn(
        "flex items-center justify-between px-6 py-3 bg-[#01301F] text-white",
        className
      )}
    >
      <div className="flex items-center gap-8">
        <div className=" flex justify-center w-28">
          <img
            src="/logo/logo-care-standard.svg"
            alt="Care Standard 360+"
            className="h-12 w-auto"
            draggable={false}
          />
        </div>
        <div className="flex items-center gap-4">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                item.active
                  ? "bg-primary text-white"
                  : "text-green-100 hover:text-white hover:bg-green-700"
              )}
            >
              {item.label}
              {item.badge && (
                <Badge className="ml-2 bg-green-500 text-white text-xs">
                  {item.badge}
                </Badge>
              )}
            </a>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">Flag x Agency</span>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="text-sm">{userEmail || "Temiloluwa Samuel"}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </nav>
  );
}

interface SidebarProps {
  userName?: string;
  userRole?: string;
  className?: string;
}

export function Sidebar({
  userName = "Jeremy Wilson",
  userRole = "Admin • 2 hours",
  className,
}: SidebarProps) {
  const mainItems = [
    { icon: "overview", label: "Overview", active: true },
    { icon: "client", label: "Client Info" },
    { icon: "visit", label: "Visit Schedule" },
    { icon: "care", label: "Care Plan" },
  ];

  const mediaItems = [
    { icon: Hash, label: "Health & Media" },
    { icon: Hash, label: "News Media" },
    { icon: Hash, label: "Care Circle" },
    { icon: Hash, label: "Survey Rules" },
  ];

  const adminItems = [
    { icon: Hash, label: "Events Docs" },
    { icon: Settings, label: "Settings" },
    { icon: Download, label: "Download Info" },
  ];

  return (
    <div
      className={cn(
        "w-64 bg-white border-r border-gray-200 flex flex-col",
        className
      )}
    >
      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-sm">{userName}</div>
            <div className="text-xs text-gray-500">{userRole}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6">
        {/* Main Items */}
        <div className="space-y-1">
          {mainItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                item.active
                  ? "bg-green-50 text-green-700 border-l-2 border-green-600"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <div className="w-4 h-4 bg-gray-400 rounded-sm"></div>
              {item.label}
            </a>
          ))}
        </div>

        {/* Media Section */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
            Media
          </div>
          {mediaItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <item.icon className="w-4 h-4 text-gray-400" />
              {item.label}
            </a>
          ))}
        </div>

        {/* Admin Actions */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
            Admin Actions
          </div>
          {adminItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <item.icon className="w-4 h-4 text-gray-400" />
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">{userName}</div>
            <div className="text-xs text-gray-500">{userRole}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavLinkProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function NavLink({ children, active, className }: NavLinkProps) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      className={cn(
        "justify-start",
        active && "bg-green-600 hover:bg-green-700 text-white",
        className
      )}
    >
      {children}
    </Button>
  );
}
