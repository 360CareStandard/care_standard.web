// src/components/shared/loading-button.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BaseButtonProps = React.ComponentProps<typeof Button>;

export type LoadingButtonProps = Omit<BaseButtonProps, "children"> & {
  children?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  spinnerPlacement?: "start" | "end" | "center";
  /** center the label; place icons on the edges */
  centerLabel?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

const SPINNER_SIZES = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  icon: "h-4 w-4",
} as const;
type SpinnerKey = keyof typeof SPINNER_SIZES;

function Spinner({ size = "md" as SpinnerKey }) {
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

export function LoadingButton({
  children,
  className,
  loading = false,
  loadingText,
  spinnerPlacement = "start",
  disabled,
  size,
  centerLabel = false,
  iconLeft,
  iconRight,
  ...props
}: LoadingButtonProps) {
  const spinnerSize = (size ?? "md") as SpinnerKey;
  const isDisabled = disabled || loading;

  return (
    <Button
      size={size}
      className={cn("relative", className)}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      {...props}
    >
      {loading && spinnerPlacement === "center" && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner size={spinnerSize} />
        </span>
      )}

      {/* content */}
      <span
        className={cn(
          centerLabel
            ? "flex w-full items-center justify-center gap-2"
            : "inline-flex items-center gap-2",
          loading && spinnerPlacement === "center" && "opacity-0"
        )}
      >
        {centerLabel ? (
          <>
            <span className="justify-self-center">{iconLeft}</span>
            <span className="justify-self-center">
              {loading && loadingText !== undefined ? loadingText : children}
            </span>
            <span className="justify-self-end">{iconRight}</span>
          </>
        ) : (
          <>
            {loading && spinnerPlacement === "start" && (
              <Spinner size={spinnerSize} />
            )}
            <span>
              {loading && loadingText !== undefined ? loadingText : children}
            </span>
            {loading && spinnerPlacement === "end" && (
              <Spinner size={spinnerSize} />
            )}
          </>
        )}
      </span>
    </Button>
  );
}
