import { cn } from "@/lib/utils";

export const SPINNER_SIZES = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  icon: "h-4 w-4",
} as const;
export type SpinnerKey = keyof typeof SPINNER_SIZES;

export function Spinner({ size = "md" as SpinnerKey }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current/60 border-t-transparent",
        SPINNER_SIZES[size]
      )}
    />
  );
}
