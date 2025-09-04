import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutDialog } from "./signout-dialog";

type ProfileDropdownProps = {
  children: ReactNode; // <-- your trigger (button/pill) will be passed in
};

export default function ProfileDropdown({ children }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const [logoutModal, setLogoutModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* whatever you pass as `children` becomes the trigger */}
          {children}
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Kelvin Black</p>
              <p className="text-xs leading-none text-muted-foreground">
                kelvin@gmail.com
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => navigate("/user/settings")}>
            Profile
            <DropdownMenuShortcut />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setLogoutModal(true)}>
            Log out
            <DropdownMenuShortcut />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SignOutDialog open={!!logoutModal} onOpenChange={setLogoutModal} />
    </>
  );
}
