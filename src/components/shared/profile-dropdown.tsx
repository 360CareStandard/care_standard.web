// src/components/shared/profile-dropdown.tsx
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
import { cn } from "@/lib/utils";

type ProfileDropdownProps = {
  /** The trigger (avatar pill) */
  children: ReactNode;

  /** Display info */
  name: string;
  email: string;
  role?: string;
  workspaceName?: string;

  /** Optional actions (wire from AppHeader) */
  onOpenWorkspaceSwitcher?: () => void;
  onOpenAccount?: () => void; // e.g. /user/settings
  onOpenOrgSettings?: () => void; // e.g. /app/w/:id/settings
};

export default function ProfileDropdown({
  children,
  name,
  email,
  role,
  workspaceName,
  onOpenWorkspaceSwitcher,
  onOpenAccount,
  onOpenOrgSettings,
}: ProfileDropdownProps) {
  const navigate = useNavigate();
  const [logoutModal, setLogoutModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none truncate">
                {name || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {email}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                {role && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5",
                      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                    )}
                  >
                    {role}
                  </span>
                )}
                {workspaceName && (
                  <span className="truncate" title={workspaceName}>
                    • {workspaceName}
                  </span>
                )}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={
              onOpenAccount ? onOpenAccount : () => navigate("/user/settings")
            }
          >
            Profile
            <DropdownMenuShortcut />
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={
              onOpenOrgSettings
                ? onOpenOrgSettings
                : () => navigate("/app/settings")
            }
          >
            Organisation settings
            <DropdownMenuShortcut />
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={
              onOpenWorkspaceSwitcher
                ? onOpenWorkspaceSwitcher
                : () => navigate("/app/workspaces")
            }
          >
            Switch workspace…
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
