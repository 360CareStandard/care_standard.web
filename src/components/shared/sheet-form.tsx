// components/shared/sheet-form.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type SheetFormProps = {
  /** Optional trigger button or custom element */
  trigger?: React.ReactNode;
  /** Controlled props (optional) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Sheet UI */
  side?: "left" | "right" | "top" | "bottom";
  className?: string; // extra classes for SheetContent
  headerClassName?: string; // classes for SheetHeader
  bodyClassName?: string; // classes for body wrapper
  footerClassName?: string; // classes for footer

  /** Header content */
  title: React.ReactNode;
  description?: React.ReactNode;

  /** Form */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  submitLoading?: boolean;
  submitDisabled?: boolean;
  hideCancel?: boolean;
  /** Extra nodes */
  footerExtra?: React.ReactNode;

  /** Form body goes here */
  children: React.ReactNode;
  sheetContentRef?: React.MutableRefObject<null>;
};

/**
 * A reusable sheet + form scaffold.
 * - Works controlled or uncontrolled
 * - You can pass any trigger
 * - Provides consistent header/body/footer layout
 */
export function SheetForm({
  trigger,
  open,
  onOpenChange,
  side = "right",
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  title,
  description,
  onSubmit,
  submitLabel = "Save changes",
  cancelLabel = "Close",
  submitDisabled,
  // submitLoading,
  hideCancel = false,
  sheetContentRef,
  footerExtra,

  children,
}: SheetFormProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : null}

      <SheetContent
        ref={sheetContentRef}
        side={side}
        className={cn("sm:max-w-[500px] w-full", className)}
      >
        {/* Form fills the sheet so footer stays at bottom */}
        <form onSubmit={onSubmit} className="flex h-full flex-col">
          <SheetHeader className={cn(headerClassName)}>
            <SheetTitle>{title}</SheetTitle>
            {description ? (
              <SheetDescription className="text-xs">
                {description}
              </SheetDescription>
            ) : null}
          </SheetHeader>

          <div
            className={cn(
              "flex-1 overflow-auto bg-white rounded-t-2xl px-4 py-4",
              bodyClassName,
            )}
          >
            {children}
          </div>

          <SheetFooter className={cn("border-t px-4 py-3 ", footerClassName)}>
            <div className="ml-auto flex items-center gap-3">
              {footerExtra}

              {!hideCancel && (
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    {cancelLabel}
                  </Button>
                </SheetClose>
              )}
              {submitLabel && (
                <Button type="submit" disabled={submitDisabled}>
                  {/* {submitLoading ? <Spinner size="sm" /> : null} */}
                  {submitLabel}
                </Button>
              )}
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
