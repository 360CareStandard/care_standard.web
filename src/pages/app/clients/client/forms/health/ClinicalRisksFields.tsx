// components/health/ClinicalRisksFields.tsx
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Check } from "lucide-react";

type RiskLevel = "Low" | "Medium" | "High";
type RiskKey = "Falls" | "Pressure Ulcers" | "Choking" | "Behavioural";

const RISK_KEYS: RiskKey[] = [
  "Falls",
  "Pressure Ulcers",
  "Choking",
  "Behavioural",
];

export function ClinicalRisksFields() {
  const [level, setLevel] = React.useState<RiskLevel>("Medium");
  const [selected, setSelected] = React.useState<Record<RiskKey, boolean>>({
    Falls: true,
    "Pressure Ulcers": false,
    Choking: true,
    Behavioural: false,
  });
  const [notes, setNotes] = React.useState("");

  const toggle = (k: RiskKey) => setSelected((s) => ({ ...s, [k]: !s[k] }));

  const levelBadge = {
    Low: "bg-primary-accent text-emerald-700",
    Medium: "bg-amber-100 text-amber-800",
    High: "bg-red-100 text-red-700",
  }[level];

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
            {level}
          </span>
        </div>
        <Select value={level} onValueChange={(v: RiskLevel) => setLevel(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Risk Categories */}
      <div className="space-y-2">
        <Label className="font-medium">Risk Categories</Label>
        <div className="flex flex-wrap gap-3">
          {RISK_KEYS.map((k) => {
            const active = selected[k];
            return (
              <button
                key={k}
                type="button"
                onClick={() => toggle(k)}
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
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[96px] resize-y"
        />
        <p className="text-[11px] text-muted-foreground">
          {Object.values(selected).filter(Boolean).length} of {RISK_KEYS.length}{" "}
          risks selected
        </p>
      </div>
    </div>
  );
}
