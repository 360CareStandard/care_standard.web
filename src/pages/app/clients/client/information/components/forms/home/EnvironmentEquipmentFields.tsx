// components/home/EnvironmentEquipmentFields.tsx
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";
import { HomeEnvironmentForm } from "../../../../../schemas/home-environment";

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
  const { control, setValue, getValues } =
    useFormContext<HomeEnvironmentForm>();

  const env = useWatch({
    control,
    name: "environmentAndEquipment",
    defaultValue: {
      equipmentPresent: [],
      // assistiveTechnology: [],
      petsPresent: false,
      pets: "",
      knownHazards: [],
      // hazardNotes: "",
    } as any,
  }) as {
    equipmentPresent?: string[];
    // assistiveTechnology?: string[];
    petsPresent?: boolean;
    pets?: string;
    knownHazards?: string[];
    // hazardNotes?: string;
  };

  const equipmentPresent = React.useMemo(
    () => new Set(env?.equipmentPresent ?? []),
    [env]
  );
  // const assistiveSet = React.useMemo(
  //   () => new Set(env?.assistiveTechnology ?? []),
  //   [env]
  // );
  const hazardsSet = React.useMemo(
    () => new Set(env?.knownHazards ?? []),
    [env]
  );

  // helpers to update nested arrays safely
  const toggleArrayValue = (
    key: keyof NonNullable<typeof env>,
    value: string
  ) => {
    const current = getValues("environmentAndEquipment") ?? {};
    const arr: string[] = Array.isArray(current[key]) ? current[key]! : [];
    const next = arr.includes(value)
      ? arr.filter((a) => a !== value)
      : [...arr, value];
    setValue(
      "environmentAndEquipment",
      { ...current, [key]: next },
      { shouldDirty: true }
    );
  };
  const togglePetsPresent = (on: boolean) => {
    const current = getValues("environmentAndEquipment") ?? {};
    // when switching off, clear pet details
    setValue(
      "environmentAndEquipment",
      {
        ...current,
        petsPresent: Boolean(on),
        pets: on ? current.pets ?? "" : "",
      },
      { shouldDirty: true }
    );
  };
  const setPets = (v: string) => {
    const current = getValues("environmentAndEquipment") ?? {};
    setValue(
      "environmentAndEquipment",
      { ...current, pets: v },
      { shouldDirty: true }
    );
  };

  const setPetsToggle = (on: boolean) => {
    const current = getValues("environmentAndEquipment") ?? {};
    // when switching off, clear pet details
    setValue(
      "environmentAndEquipment",
      { ...current, pets: on ? current.pets ?? "" : "" },
      { shouldDirty: true }
    );
  };

  // const setHazardNotes = (v: string) => {
  //   const current = getValues("environmentAndEquipment") ?? {};
  //   setValue(
  //     "environmentAndEquipment",
  //     { ...current, hazardNotes: v },
  //     { shouldDirty: true }
  //   );
  // };

  return (
    <div className="space-y-6">
      {/* Equipment present */}
      <div className="space-y-2">
        <Label className="font-medium">Equipment present</Label>
        <div className="flex flex-wrap gap-3">
          {EQUIPMENT.map((k) => (
            <ToggleChip
              key={k}
              active={equipmentPresent.has(k)}
              label={k}
              onClick={() => toggleArrayValue("equipmentPresent", k)}
            />
          ))}
        </div>
      </div>

      {/* Assistive Technology */}
      {/* <div className="space-y-2">
        <Label className="font-medium">Assistive Technology</Label>
        <div className="flex flex-wrap gap-3">
          {ASSISTIVE.map((k) => (
            <ToggleChip
              key={k}
              active={assistiveSet.has(k)}
              label={k}
              onClick={() => toggleArrayValue("assistiveTechnology", k)}
            />
          ))}
        </div>
      </div> */}

      {/* Pets at home */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <Label className="font-medium">Pets at home</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Are there any pets at the property?
            </p>
          </div>
          <Switch
            checked={Boolean(env?.petsPresent)}
            onCheckedChange={(v) => togglePetsPresent(Boolean(v))}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Pet Details</Label>
          <Textarea
            placeholder="Describe pets (type, temperament, any special considerations)…"
            value={env?.pets ?? ""}
            onChange={(e) => setPets(e.target.value)}
            disabled={!Boolean(env?.petsPresent)}
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
              active={hazardsSet.has(k)}
              label={k}
              onClick={() => toggleArrayValue("knownHazards", k)}
            />
          ))}
        </div>

        {/* <div className="mt-2 space-y-1.5">
          <Label>Hazards Notes</Label>
          <Textarea
            placeholder="Additional details about hazards and mitigation strategies…"
            value={env?.hazardNotes ?? ""}
            onChange={(e) => setHazardNotes(e.target.value)}
            className="min-h-[84px] resize-y"
          />
        </div> */}
      </div>
    </div>
  );
}
