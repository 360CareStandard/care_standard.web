import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  VisitPresetEnum,
  SkillEnum,
  LanguageEnum,
  type SchedulingPreferencesForm,
} from "../../schemas/scheduling-preferences";
import { Carer } from "../components/carer-selection";
import { RHFCarerSelection } from "../components/rhf-carer-selection";
import { RHFSelectField } from "@/components/shared/rhf-select-field";

const presetOptions = VisitPresetEnum.options.map((v) => ({
  value: v,
  label: v,
}));
const skills = SkillEnum.options.map((v) => ({ value: v, label: v }));
const languages = LanguageEnum.options.map((v) => ({ value: v, label: v }));

export function SchedulingPreferencesFields() {
  const { control } = useFormContext<SchedulingPreferencesForm>();

  const carers: Carer[] = [
    {
      id: "1",
      name: "John Malik",
      email: "john.john@careservice.com",
      initials: "JM",
      skills: ["Medication", "Dementia Care"],
    },
    {
      id: "2",
      name: "A. Brown",
      email: "anna.brown@careservice.com",
      initials: "AB",
      skills: ["Moving & Handling", "PEG Feeding"],
    },
    {
      id: "3",
      name: "S. Johnson",
      email: "sarah.john@careservice.com",
      initials: "SJ",
      skills: ["Medication", "Dementia Care"],
    },
    {
      id: "4",
      name: "M. Davis",
      email: "mike.davis@careservice.com",
      initials: "MD",
      skills: ["Catheter Care", "Moving & Handling"],
    },
  ];
  const preferredIds = useWatch({ control, name: "preferredCarers" }) as
    | string[]
    | undefined;
  const avoidIds = useWatch({ control, name: "avoidCarers" }) as
    | string[]
    | undefined;

  return (
    <div className="space-y-6">
      {/* Visit Duration Presets (multi-checkbox) */}
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Visit Duration Presets
        </Label>
        <Controller
          name="visitPresets"
          control={control}
          render={({ field }) => {
            const values: string[] = field.value ?? [];
            const toggle = (val: string) =>
              field.onChange(
                values.includes(val)
                  ? values.filter((v) => v !== val)
                  : [...values, val]
              );

            return (
              <div className="flex flex-wrap gap-6">
                {presetOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Input
                      type="checkbox"
                      checked={values.includes(opt.value)}
                      onChange={() => toggle(opt.value)}
                      className="h-4 w-4 accent-primary"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            );
          }}
        />
      </div>

      {/* Continuity Priority */}
      <Controller
        name="continuityPriority"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Continuity Priority</p>
              <p className="text-xs text-muted-foreground">
                Keep same carers where possible
              </p>
            </div>
            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
          </div>
        )}
      />

      {/* Preferred & Avoid carers (chips input for now) */}
      <RHFCarerSelection
        name="preferredCarers"
        label="Preferred Carers"
        description="Select carers who should be prioritised for this client"
        availableCarers={carers}
        placeholder="Search for preferred carers"
        // maxSelections={6}
        // prevent picking those already in 'avoid'
        disabledIds={avoidIds ?? []}
        variant="preferred"
      />

      <RHFCarerSelection
        name="avoidCarers"
        label="Avoid Carers"
        description="Select carers who should not be assigned to this client"
        availableCarers={carers}
        placeholder="Search for carers to avoid"
        // maxSelections={6}
        // prevent picking those already in 'preferred'
        disabledIds={preferredIds ?? []}
        variant="avoid"
      />
      {/* Required Skills (multi-checkbox) */}
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Required Skills
        </Label>
        <Controller
          name="requiredSkills"
          control={control}
          render={({ field }) => {
            const values: string[] = field.value ?? [];
            const toggle = (val: string) =>
              field.onChange(
                values.includes(val)
                  ? values.filter((v) => v !== val)
                  : [...values, val]
              );

            return (
              <div className="flex flex-wrap gap-4">
                {skills.map((s) => (
                  <Label
                    key={s.value}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Input
                      type="checkbox"
                      checked={values.includes(s.value)}
                      onChange={() => toggle(s.value)}
                      className="h-4 w-4 accent-primary"
                    />
                    {s.label}
                  </Label>
                ))}
              </div>
            );
          }}
        />
      </div>
      <RHFSelectField
        control={control}
        name="languageRequirement"
        label="Language Requirement"
        placeholder="Select Language Requirement"
        options={languages}
      />
    </div>
  );
}
