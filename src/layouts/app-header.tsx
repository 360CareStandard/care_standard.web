// AppHeader.tsx
import { ChevronDown, Bell } from "lucide-react";
import { Header } from "./header";
import { TopNav } from "./top-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { cn } from "@/lib/utils";
import ProfileDropdown from "@/components/shared/profile-dropdown";

function Logo() {
  // Replace with your SVG/logo component
  return (
    <div className=" flex justify-center w-28">
      <img
        src="/logo/logo-care-standard.svg"
        alt="Care Standard 360+"
        className="h-12 w-auto"
        draggable={false}
      />
    </div>
  );
}

const links = [
  { title: "Clients", href: "/clients" },
  { title: "Staff", href: "/staff" },
  { title: "Shift Roster", href: "/shift-roster" },
  { title: "Inbox", href: "/inbox" },
  { title: "Activity", href: "/activity" },
  { title: "Finance", href: "/finance" },
  { title: "Safeguarding", href: "/safeguarding" },
];

export function AppHeader() {
  return (
    <Header
      fixed
      className="
    fixed top-0 z-50 bg-[#01301F] text-white backdrop-blur
    border-b border-white/10
    pt-[max(env(safe-area-inset-top),0px)]
  "
    >
      <div className="mx-auto flex w-full items-center gap-3 sm:gap-6 px-3 sm:px-6 h-14">
        {/* left: logo */}
        <Logo />

        {/* middle: primary nav */}
        <TopNav links={links} className="ml-2" />

        {/* right: actions */}
        <div className="ml-auto flex items-center gap-6">
          {/* bell */}
          <button
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* org name */}
          <div className="hidden md:block text-sm font-semibold tracking-wide uppercase text-white/90">
            Lighthouse Homecare Ltd
          </div>

          {/* user pill */}
          <ProfileDropdown>
            <button className="flex items-center gap-3 rounded-full hover:bg-white/10 px-2 py-1">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#FFECE5] font-medium text-black">
                  Ts
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col leading-tight text-left">
                <span className="text-sm">Temilowa Samuel</span>
                <span className="text-xs text-white/70">Admin</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-80" />
            </button>
          </ProfileDropdown>
        </div>
      </div>
    </Header>
  );
}
