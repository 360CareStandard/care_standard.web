// components/preferences/RoutinesLifestyleFields.tsx
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function RoutinesLifestyleFields() {
  const [morningRoutine, setMorningRoutine] = React.useState("");
  const [sleepingHabits, setSleepingHabits] = React.useState("");
  const [dailyActivities, setDailyActivities] = React.useState("");

  const [prefTimes, setPrefTimes] = React.useState({
    Morning: true,
    Afternoon: false,
    Evening: false,
  });

  const toggleTime = (k: keyof typeof prefTimes) =>
    setPrefTimes((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className="space-y-4">
      {/* Morning Routine */}
      <div className="space-y-1.5">
        <Label className="font-medium">Morning Routine</Label>
        <Textarea
          placeholder="Describe typical morning routine, wake-up time, preferences..."
          value={morningRoutine}
          onChange={(e) => setMorningRoutine(e.target.value)}
          className="min-h-[84px] resize-y"
        />
      </div>

      {/* Sleeping Habits */}
      <div className="space-y-1.5">
        <Label className="font-medium">Sleeping Habits</Label>
        <Textarea
          placeholder="Bedtime, napping habits, sleep environment preferences..."
          value={sleepingHabits}
          onChange={(e) => setSleepingHabits(e.target.value)}
          className="min-h-[84px] resize-y"
        />
      </div>

      {/* Daily Activities & Hobbies */}
      <div className="space-y-1.5">
        <Label className="font-medium">Daily Activities & Hobbies</Label>
        <Textarea
          placeholder="Favourite activities, hobbies, social interest..."
          value={dailyActivities}
          onChange={(e) => setDailyActivities(e.target.value)}
          className="min-h-[84px] resize-y"
        />
      </div>

      {/* Preferred Visit Times */}
      <div className="space-y-2">
        <Label className="font-medium">Preferred Visit Times</Label>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(prefTimes) as Array<keyof typeof prefTimes>).map(
            (k) => (
              <TogglePill
                key={k}
                active={prefTimes[k]}
                label={k}
                onClick={() => toggleTime(k)}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
