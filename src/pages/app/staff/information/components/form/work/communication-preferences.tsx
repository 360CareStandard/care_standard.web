import { useFormContext } from "react-hook-form";
import { StaffWorkForm } from "@/pages/app/staff/schemas/work";
import { Label } from "@/components/ui/label";
import { SelectableCheckbox } from "@/components/shared/selectable-checkbox";

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
