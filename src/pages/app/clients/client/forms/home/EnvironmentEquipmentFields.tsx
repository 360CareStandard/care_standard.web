// components/home/EnvironmentEquipmentFields.tsx
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type EquipmentKey = "Hospital Bed" | "CPAP Machine" | "Hoist" | "Wheelchair";
type AssistiveKey = "Fall Alarm" | "Telecare" | "Pendant Alarm";
type HazardKey = "Clutter" | "Stairs" | "Fire Risk" | "Aggressive pets";

const EQUIPMENT: EquipmentKey[] = [
  "Hospital Bed",
  "CPAP Machine",
  "Hoist",
  "Wheelchair",
];
const ASSISTIVE: AssistiveKey[] = ["Fall Alarm", "Telecare", "Pendant Alarm"];
const HAZARDS: HazardKey[] = [
  "Clutter",
  "Stairs",
  "Fire Risk",
  "Aggressive pets",
];

function ToggleChip({
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
        "group inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
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

export function EnvironmentEquipmentFields() {
  // Defaults to match your screenshot
  const [equipment, setEquipment] = React.useState<
    Record<EquipmentKey, boolean>
  >({
    "Hospital Bed": true,
    "CPAP Machine": false,
    Hoist: true,
    Wheelchair: false,
  });

  const [assistive, setAssistive] = React.useState<
    Record<AssistiveKey, boolean>
  >({
    "Fall Alarm": true,
    Telecare: false,
    "Pendant Alarm": false,
  });

  const [petsAtHome, setPetsAtHome] = React.useState<boolean>(true);
  const [petDetails, setPetDetails] = React.useState<string>("");

  const [hazards, setHazards] = React.useState<Record<HazardKey, boolean>>({
    Clutter: true,
    Stairs: false,
    "Fire Risk": false,
    "Aggressive pets": false,
  });

  const [hazardNotes, setHazardNotes] = React.useState<string>("");

  const toggleEquipment = (k: EquipmentKey) =>
    setEquipment((s) => ({ ...s, [k]: !s[k] }));
  const toggleAssistive = (k: AssistiveKey) =>
    setAssistive((s) => ({ ...s, [k]: !s[k] }));
  const toggleHazard = (k: HazardKey) =>
    setHazards((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className="space-y-6">
      {/* Equipment present */}
      <div className="space-y-2">
        <Label className="font-medium">Equipment present</Label>
        <div className="flex flex-wrap gap-3">
          {EQUIPMENT.map((k) => (
            <ToggleChip
              key={k}
              active={equipment[k]}
              label={k}
              onClick={() => toggleEquipment(k)}
            />
          ))}
        </div>
      </div>

      {/* Assistive Technology */}
      <div className="space-y-2">
        <Label className="font-medium">Assistive Technology</Label>
        <div className="flex flex-wrap gap-3">
          {ASSISTIVE.map((k) => (
            <ToggleChip
              key={k}
              active={assistive[k]}
              label={k}
              onClick={() => toggleAssistive(k)}
            />
          ))}
        </div>
      </div>

      {/* Pets at home */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <Label className="font-medium">Pets at home</Label>
            <p className="text-xs text-muted-foreground">
              Are there any pets at the property?
            </p>
          </div>
          <Switch checked={petsAtHome} onCheckedChange={setPetsAtHome} />
        </div>

        <div className="space-y-1.5">
          <Label>Pet Details</Label>
          <Textarea
            placeholder="Describe pets (type, temperament, any special considerations)…"
            value={petDetails}
            onChange={(e) => setPetDetails(e.target.value)}
            disabled={!petsAtHome}
            className="min-h-[84px] resize-y"
          />
        </div>
      </div>

      {/* Known Hazards */}
      <div className="space-y-2">
        <Label className="font-medium">Known Hazards</Label>
        <div className="flex flex-wrap gap-3">
          {HAZARDS.map((k) => (
            <ToggleChip
              key={k}
              active={hazards[k]}
              label={k}
              onClick={() => toggleHazard(k)}
            />
          ))}
        </div>

        <div className="mt-2 space-y-1.5">
          <Label>Hazards Notes</Label>
          <Textarea
            placeholder="Additional details about hazards and mitigation strategies…"
            value={hazardNotes}
            onChange={(e) => setHazardNotes(e.target.value)}
            className="min-h-[84px] resize-y"
          />
        </div>
      </div>
    </div>
  );
}
