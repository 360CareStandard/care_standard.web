import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmDialog } from "./confirm-dialog";

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    // Close dialog (optional)
    onOpenChange(false);

    // Build current path string
    const currentPath = location.pathname + location.search + location.hash;

    // Create `?redirect=...`
    const params = new URLSearchParams({ redirect: currentPath }).toString();

    // React Router: navigate(string, options)
    navigate(`/sign-in?${params}`, { replace: true });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out"
      desc="Are you sure you want to sign out? You will need to sign in again to access your account."
      confirmText="Sign out"
      handleConfirm={handleSignOut}
      className="sm:max-w-sm"
    />
  );
}
