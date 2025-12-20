import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PreferencesForm } from "../../../../../schemas/preferences";

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
        "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
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

type Diet = "Vegetarian" | "Halal" | "Diabetic" | "Allergies";
const DIETS: Diet[] = ["Vegetarian", "Halal", "Diabetic", "Allergies"];

export function FoodDietFields() {
  const { register, watch, setValue } = useFormContext<PreferencesForm>(); // use PreferencesForm when available

  // read array from form
  const selected = watch("dietaryRestrictions") || [];

  const toggle = (diet: Diet) => {
    const exists = selected.includes(diet);

    if (exists) {
      setValue(
        "dietaryRestrictions",
        selected.filter((d: string) => d !== diet),
        { shouldDirty: true, shouldValidate: true }
      );
    } else {
      setValue("dietaryRestrictions", [...selected, diet], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Dietary Restrictions */}
      <div className="space-y-2">
        <Label className="font-medium">Dietary Restrictions</Label>
        <div className="flex flex-wrap gap-3">
          {DIETS.map((d) => (
            <TogglePill
              key={d}
              active={selected.includes(d)}
              label={d}
              onClick={() => toggle(d)}
            />
          ))}
        </div>
      </div>

      {/* Food Likes */}
      <div className="space-y-1.5">
        <Label className="font-medium">Food Likes</Label>
        <Textarea
          {...register("foodLikes")}
          placeholder="Favourite foods, drinks, snacks..."
          className="min-h-[84px] resize-y"
        />
      </div>

      {/* Food Dislikes */}
      <div className="space-y-1.5">
        <Label className="font-medium">Food Dislikes</Label>
        <Textarea
          {...register("foodDislikes")}
          placeholder="Food to avoid, dislikes"
          className="min-h-[84px] resize-y"
        />
      </div>

      {/* Favourite Meals */}
      <div className="space-y-1.5">
        <Label className="font-medium">Favourite Meals</Label>
        <Textarea
          {...register("favouriteMeals")}
          placeholder="Special occasion meals, comfort foods..."
          className="min-h-[84px] resize-y"
        />
      </div>
    </div>
  );
}
