// components/health/ClinicalRisksFields.tsx
import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { MedicalForm } from "../../../../../schemas/health";

type RiskKey = "Falls" | "Pressure Ulcers" | "Choking" | "Behavioural";
const RISK_KEYS: RiskKey[] = [
  "Falls",
  "Pressure Ulcers",
  "Choking",
  "Behavioural",
];

export function ClinicalRisksFields() {
  const { control, watch, setValue } = useFormContext<MedicalForm>();

  // watch the pieces we need from the form
  const overallRiskLevel = watch("overallRiskLevel") ?? "medium";
  const riskCategories =
    (watch("riskCategories") as string[] | undefined) ?? [];
  const mitigation = watch("mitigationStrategies") ?? "";

  // ensure riskCategories is always an array in form state
  React.useEffect(() => {
    if (!Array.isArray(riskCategories)) {
      setValue("riskCategories", [], { shouldDirty: false });
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = (k: RiskKey) => {
    const next = new Set(riskCategories);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setValue("riskCategories", Array.from(next), { shouldDirty: true });
  };

  const levelBadge = {
    low: "bg-primary-accent text-emerald-700",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-700",
  }[overallRiskLevel as "low" | "medium" | "high"];

  return (
    <div className="space-y-6">
      {/* Overall Risk */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Label>Overall Risk Level</Label>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[11px]",
              levelBadge
            )}
          >
            {String(overallRiskLevel).charAt(0).toUpperCase() +
              String(overallRiskLevel).slice(1)}
          </span>
        </div>

        <Controller
          control={control}
          name="overallRiskLevel"
          defaultValue={overallRiskLevel as any}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(v) => field.onChange(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Risk Categories */}
      <div className="space-y-2">
        <Label className="font-medium">Risk Categories</Label>
        <div className="flex flex-wrap gap-3">
          {RISK_KEYS.map((k) => {
            const active = riskCategories.includes(k);
            return (
              <button
                key={k}
                type="button"
                onClick={() => toggleCategory(k)}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-md border p-2 text-sm",
                  active
                    ? "bg-primary-accent text-primary border-primary-accent"
                    : "bg-transparent text-foreground border-border hover:bg-muted/60"
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 place-items-center rounded-[6px] border",
                    active
                      ? "bg-primary text-white border-primary"
                      : "border-muted-foreground/30 text-transparent"
                  )}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                {k}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mitigation Notes */}
      <div className="space-y-1.5">
        <Label>Mitigation Notes</Label>
        <Textarea
          placeholder="Risk mitigation strategies and precautions..."
          value={mitigation as string}
          onChange={(e) =>
            setValue("mitigationStrategies", e.target.value, {
              shouldDirty: true,
            })
          }
          className="min-h-[96px] resize-y"
        />
        <p className="text-[11px] text-muted-foreground">
          {riskCategories.length} of {RISK_KEYS.length} risks selected
        </p>
      </div>
    </div>
  );
}
