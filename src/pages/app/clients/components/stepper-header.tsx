// components/stepper-header.tsx
import * as React from "react";
import {
  Stepper as UiStepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { cn } from "@/lib/utils";

export type Step = { id: number; label: string; description?: string };

export function StepperHeader({
  steps,
  current, // step.id
  onStepClick,
  className,
}: {
  steps: Step[];
  current: number; // current step id
  onStepClick?: (id: number) => void;
  className?: string;
}) {
  // map ids → index
  const byId = React.useMemo(
    () => new Map(steps.map((s, i) => [s.id, i])),
    [steps]
  );
  const currentIdx = byId.get(current) ?? 0;

  return (
    <UiStepper
      value={currentIdx + 1} // shadcn step numbers are 1-based
      className={cn("w-full text-center mb-4", className)}
    >
      {steps.map((s, i) => {
        const stepNumber = i + 1;
        const isCurrent = i === currentIdx;

        return (
          <StepperItem
            key={s.id}
            step={stepNumber}
            className="relative flex-1 flex-col!"
          >
            <StepperTrigger
              onClick={() => onStepClick?.(s.id)}
              className={cn(
                "flex-col gap-2 rounded transition-colors",
                isCurrent ? "text-primary" : "text-foreground"
              )}
            >
              <StepperIndicator /> {/* renders the circle (✓ / number) */}
              <div className="space-y-0.5 ">
                <StepperTitle className="text-xs ">{s.label}</StepperTitle>
                {s.description ? (
                  <StepperDescription className="max-sm:hidden">
                    {s.description}
                  </StepperDescription>
                ) : null}
              </div>
            </StepperTrigger>

            {/* Progress line to the next step — OriginUI positioning */}
            {stepNumber < steps.length && (
              <StepperSeparator
                className="
                  absolute inset-x-0 top-3
                  left-[calc(50%+0.75rem+0.125rem)]
                  -order-1 m-0 -translate-y-1/2
                  group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)]
                  group-data-[orientation=horizontal]/stepper:flex-none
                "
              />
            )}
          </StepperItem>
        );
      })}
    </UiStepper>
  );
}
