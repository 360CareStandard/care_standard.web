import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PreferencesForm } from "../../../../../schemas/preferences"; // adjust path

function TogglePill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
        active
          ? "bg-emerald-100 text-emerald-900 border-emerald-200"
          : "bg-transparent text-foreground border-border hover:bg-muted/60"
      )}
    >
      <span
        className={cn(
          "grid h-5 w-5 place-items-center rounded-[6px] border",
          active
            ? "bg-emerald-600 text-white border-emerald-600"
            : "border-muted-foreground/30 text-transparent"
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
      {label}
    </button>
  );
}

const VISIT_TIMES = ["Morning", "Afternoon", "Evening"] as const;

export function RoutinesLifestyleFields() {
  const { register, watch, setValue } = useFormContext<PreferencesForm>();

  const selectedTimes = watch("preferredVisitTimes") || [];

  const toggleTime = (time: (typeof VISIT_TIMES)[number]) => {
    if (selectedTimes.includes(time)) {
      setValue(
        "preferredVisitTimes",
        selectedTimes.filter((t) => t !== time)
      );
    } else {
      setValue("preferredVisitTimes", [...selectedTimes, time]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Morning Routine */}
      <div className="space-y-1.5">
        <Label className="font-medium">Morning Routine</Label>
        <Textarea
          {...register("morningRoutine")}
          placeholder="Describe typical morning routine..."
          className="min-h-[84px] resize-y"
        />
      </div>

      {/* Sleeping Habits */}
      <div className="space-y-1.5">
        <Label className="font-medium">Sleeping Habits</Label>
        <Textarea
          {...register("sleepingHabits")}
          placeholder="Bedtime, napping habits..."
          className="min-h-[84px] resize-y"
        />
      </div>

      {/* Daily Activities */}
      <div className="space-y-1.5">
        <Label className="font-medium">Daily Activities & Hobbies</Label>
        <Textarea
          {...register("dailyActivities")}
          placeholder="Favourite activities and hobbies..."
          className="min-h-[84px] resize-y"
        />
      </div>

      {/* Preferred Visit Times */}
      <div className="space-y-2">
        <Label className="font-medium">Preferred Visit Times</Label>

        <div className="flex flex-wrap gap-3">
          {VISIT_TIMES.map((time) => (
            <TogglePill
              key={time}
              active={selectedTimes.includes(time)}
              label={time}
              onClick={() => toggleTime(time)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
