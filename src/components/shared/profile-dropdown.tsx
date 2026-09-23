// src/components/shared/profile-dropdown.tsx
import { ReactNode, useState } from "react";
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
import { useNavigate } from "react-router-dom";

type ProfileDropdownProps = {
  /** The trigger (avatar pill) */
  children: ReactNode;

  /** Display info */
  name: string;
  email: string;
  role?: string;
  workspaceName?: string;
  isSuperAdmin?: boolean;

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
  isSuperAdmin,
  // onOpenWorkspaceSwitcher,
  // onOpenAccount,
  // onOpenOrgSettings,
}: ProfileDropdownProps) {
  // const navigate = useNavigate();
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex gap-2 space-y-1">
              <div className="">
                <p className="text-sm font-medium leading-none truncate">
                  {name || "User"}
                </p>
                <p className="text-xs w-full leading-none text-muted-foreground truncate ...">
                  {email}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                {role && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5",
                      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
                    )}
                  >
                    {role}
                  </span>
                )}
                {/* {workspaceName && (
                  <span className="truncate" title={workspaceName}>
                    • {workspaceName}
                  </span>
                )} */}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => navigate("/app/company-settings")}>
            Company settings
            <DropdownMenuShortcut />
          </DropdownMenuItem>

          {!isSuperAdmin && (
            <DropdownMenuItem onClick={() => navigate("/app/care-packages")}>
              Care packages
              <DropdownMenuShortcut />
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="mt-2"
            // onClick={
            //   onOpenWorkspaceSwitcher
            //     ? onOpenWorkspaceSwitcher
            //     : () => navigate("/app/workspaces")
            // }
          >
            <svg
              width={22}
              height={22}
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.55385 16.7751L10.4315 14.7649C11.2126 12.9761 12.6184 11.5521 14.372 10.7737L16.7877 9.70139C17.5557 9.36049 17.5557 8.24317 16.7877 7.90226L14.4474 6.86343C12.6487 6.06501 11.2177 4.5883 10.45 2.73843L9.56095 0.596223C9.23105 -0.198742 8.13264 -0.19874 7.80275 0.596223L6.91372 2.73841C6.14602 4.5883 4.71498 6.06501 2.9163 6.86343L0.576033 7.90226C-0.19201 8.24317 -0.192011 9.36049 0.576033 9.70139L2.99175 10.7737C4.74534 11.5521 6.15116 12.9761 6.9322 14.7649L7.80985 16.7751C8.14721 17.5477 9.21645 17.5477 9.55385 16.7751ZM18.3409 21.6694L18.5877 21.1037C19.0277 20.0951 19.8202 19.292 20.809 18.8527L21.5694 18.5148C21.9807 18.3321 21.9807 17.7344 21.5694 17.5517L20.8516 17.2327C19.8373 16.7821 19.0306 15.9493 18.5981 14.9064L18.3447 14.2951C18.168 13.8691 17.579 13.8691 17.4023 14.2951L17.1489 14.9064C16.7165 15.9493 15.9098 16.7821 14.8955 17.2327L14.1776 17.5517C13.7664 17.7344 13.7664 18.3321 14.1776 18.5148L14.938 18.8527C15.9269 19.292 16.7193 20.0951 17.1593 21.1037L17.4062 21.6694C17.5868 22.0835 18.1602 22.0835 18.3409 21.6694Z"
                fill="#8F78E8"
              />
            </svg>
            What's New?
            <DropdownMenuShortcut />
          </DropdownMenuItem>
          {!isSuperAdmin && (
            <DropdownMenuItem className="mt-2">
              Help and Support
              <DropdownMenuShortcut />
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-primary mt-2"
            onClick={() => setLogoutModal(true)}
          >
            Log out
            <DropdownMenuShortcut />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!logoutModal} onOpenChange={setLogoutModal} />
    </>
  );
}
