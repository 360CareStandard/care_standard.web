import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // shadcn's class combiner
import { CircleAlert } from "lucide-react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  /** pass a string to show an error message; truthy boolean shows only styles */
  error?: string | boolean;
  containerClassName?: string;
};

export const TextField = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label,
      hint,
      error,
      className,
      containerClassName,
      required,
      ...inputProps
    },
    ref
  ) => {
    const inputId = id ?? React.useId();
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-error`;
    const hasError = !!error;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label ? (
          <Label
            htmlFor={inputId}
            className="mb-2 block text-sm font-normal text-slate-700"
          >
            {label}
            {required ? <span className="ml-0.5 text-red-600">*</span> : null}
          </Label>
        ) : null}

        <div className="relative">
          <Input
            id={inputId}
            ref={ref}
            aria-invalid={hasError || undefined}
            aria-describedby={cn(
              hint ? helpId : undefined,
              hasError ? errorId : undefined
            )}
            className={cn(
              "px-4 text-base h-11 placeholder:text-[#667085]",
              hasError
                ? "border-red-300 bg-red-50 text-red-900 placeholder:text-red-400 focus-visible:ring-red-500 focus-visible:border-red-500"
                : "focus-visible:ring-2",
              hasError ? "pr-10" : undefined, // <- conditional
              className
            )}
            {...inputProps}
          />

          {hasError && (
            <CircleAlert
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500"
            />
          )}
        </div>

        {hasError && typeof error === "string" ? (
          <p id={errorId} role="alert" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        ) : hint ? (
          <p id={helpId} className="mt-2 text-sm text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
TextField.displayName = "TextField";
