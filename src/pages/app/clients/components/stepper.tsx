import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = { id: number; label: string };
type Props = {
  steps: Step[];
  current: number; // current step id
  completed: number[]; // completed step ids
  onStepClick?: (id: number) => void;
};

export function Stepper({ steps, current, completed, onStepClick }: Props) {
  return (
    <div className=" pt-2 pb-4">
      <div className="relative w-full">
        {/* track */}
        <div className="absolute left-0 right-0 top-[10px] h-0.5 bg-muted max-w-[24rem] mx-auto" />

        <div className="relative z-10 flex  justify-between gap-2">
          {steps.map((s) => {
            const isCurrent = s.id === current;
            const isDone = completed.includes(s.id) || s.id < current;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onStepClick?.(s.id)}
                aria-current={isCurrent ? "step" : undefined}
                className="flex flex-col items-center gap-2 focus:outline-none"
              >
                <span
                  className={cn(
                    "grid h-5 border-muted-foreground/20 w-5 place-items-center rounded-full border text-white shadow-sm",
                    isDone
                      ? "bg-primary border-neutral-300"
                      : isCurrent
                      ? "bg-primary border-neutral-300"
                      : "bg-muted border-muted-foreground/20 text-muted-foreground"
                  )}
                >
                  {isDone ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
