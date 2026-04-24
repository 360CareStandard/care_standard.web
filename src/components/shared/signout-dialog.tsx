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
      cancelBtnText="Cancel"
      onOpenChange={onOpenChange}
      className="!bg-[#F9FAFB] max-w-md!"
      title="Are You Sure?"
      desc="Before you go, make sure you’ve saved your progress. We’ll be here when you’re ready to return!"
      confirmText="Log Out"
      handleConfirm={handleSignOut}
    />
  );
}
