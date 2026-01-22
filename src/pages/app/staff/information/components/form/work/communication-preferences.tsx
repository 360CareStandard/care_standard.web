import { useFormContext } from "react-hook-form";
import { StaffWorkForm } from "@/pages/app/staff/schemas/work";
import { Label } from "@/components/ui/label";

export function CommunicationPreferences() {
  const { watch, setValue } = useFormContext<StaffWorkForm>();

  const prefs = {
    isEmail: watch("isEmail") ?? false,
    isText: watch("isText") ?? false,
    isPhone: watch("isPhone") ?? false,
    isApp: watch("isApp") ?? false,
  };

  const toggle = (key: keyof typeof prefs) =>
    setValue(key, !prefs[key], { shouldDirty: true });

  return (
    <div className="space-y-3">
      <Label>Preferred method of contact</Label>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SelectableCheckbox
          label="Email"
          checked={prefs.isEmail}
          onChange={() => toggle("isEmail")}
        />

        <SelectableCheckbox
          label="Text"
          checked={prefs.isText}
          onChange={() => toggle("isText")}
        />

        <SelectableCheckbox
          label="Phone"
          checked={prefs.isPhone}
          onChange={() => toggle("isPhone")}
        />

        <SelectableCheckbox
          label="App"
          checked={prefs.isApp}
          onChange={() => toggle("isApp")}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Select all contact methods the staff member is comfortable with.
      </p>
    </div>
  );
}

// components/shared/selectable-checkbox.tsx
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

export function SelectableCheckbox({ label, checked, onChange }: Props) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-3 rounded-md border px-4 py-3 transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked
          ? "border-primary bg-primary-accent"
          : "border-muted bg-background hover:bg-muted/40",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded",
          checked
            ? "bg-primary text-white"
            : "border border-muted-foreground/40",
        )}
      >
        {checked && <Check className="h-4 w-4" />}
      </span>

      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
