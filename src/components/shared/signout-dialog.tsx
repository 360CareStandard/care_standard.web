import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmDialog } from "./confirm-dialog";
import { useAuthStore } from "@/stores/auth-store";

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.clearAuth);

  const handleSignOut = async () => {
    // Close dialog (optional)
    // Build current path string
    logout();
    onOpenChange(false);
    const currentPath = location.pathname + location.search + location.hash;
    const params = new URLSearchParams({ redirect: currentPath }).toString();
    navigate(`/sign-in?${params}`, { replace: true });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      className="!bg-[#F9FAFB] "
      title="Sign out"
      desc="Are you sure you want to sign out? You will need to sign in again to access your account."
      confirmText="Sign out"
      handleConfirm={handleSignOut}
      destructive
    />
  );
}
