import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Select, { MultiValue } from "react-select";
import {
  LanguageEnum,
  SkillEnum,
  CareSetupForm,
  VisitPresetEnum,
} from "../../../../../schemas/care-setup";
import z from "zod";
import { customSelectStyles } from "@/styles/react-select";
import React from "react";
import CarerSelector from "./selector";
import { Input } from "@/components/ui/input";

const durationOptions = VisitPresetEnum.options.map((v) => ({
  value: v,
  label: v,
}));

const skills = SkillEnum.options.map((v) => ({ value: v, label: v }));
const languages = LanguageEnum.options.map((v) => ({ value: v, label: v }));
type SkillValue = z.infer<typeof SkillEnum>; // "Medication" | "Dementia Care" | ...
type LanguageValue = z.infer<typeof LanguageEnum>; // "Medication" | "Dementia Care" | ...
type Option = { value: SkillValue; label: string };
type LanguageOption = { value: LanguageValue; label: string };

export function SchedulingPreferencesFields() {
  const { control } = useFormContext<CareSetupForm>();
  const sheetContentRef = React.useRef(null);

  return (
    <div className="space-y-6" ref={sheetContentRef}>
      {/* Visit Duration Presets (multi-checkbox) */}

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Visit Period Presets
        </Label>

        <Controller
          control={control}
          name="visitPeriodPreset"
          render={({ field }) => {
            const current = field.value ?? "";

            return (
              <div className="flex flex-wrap gap-4">
                {durationOptions.map((d) => (
                  <Label
                    key={d.value}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Input
                      type="checkbox"
                      className="h-4 w-4 border-gray-300 accent-primary"
                      checked={current === d.value}
                      onChange={() =>
                        field.onChange(current === d.value ? "" : d.value)
                      }
                    />
                    {d.label}
                  </Label>
                ))}
              </div>
            );
          }}
        />
        {/* 
        {errors.visitPeriodPreset?.message && (
          <p className="mt-1 text-sm text-red-600">
            {String(errors.visitPeriodPreset.message)}
          </p>
        )} */}
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
      <CarerSelector />
      {/* Required Skills (multi-checkbox) */}
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Required Skills
        </Label>

        <Controller
          name="requiredSkills"
          control={control}
          render={({ field, fieldState }) => {
            // field.value is string[] (e.g. ["Medication","PEG Feeding"])
            const selectedOptions = (field.value ?? [])
              .map((val: string) => skills.find((o) => o.value === val)!)
              .filter(Boolean);

            const handleChange = (selected: MultiValue<Option>) => {
              const vals = (selected ?? []).map((o) => o.value);
              field.onChange(vals);
            };

            return (
              <>
                <Select<Option, true>
                  isMulti
                  options={skills}
                  value={selectedOptions}
                  onChange={handleChange}
                  placeholder="Select required skills..."
                  // PORTAL / POSITIONING fixes:
                  menuPortalTarget={sheetContentRef.current}
                  // menuPortalTarget={portalTarget}
                  menuPosition="fixed" // <- important
                  menuShouldScrollIntoView={false}
                  styles={customSelectStyles}
                  // optional: control whether menu closes on scroll
                  closeMenuOnScroll={false}
                />

                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(fieldState.error.message)}
                  </p>
                )}
              </>
            );
          }}
        />
      </div>
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Language Requirement
        </Label>

        <Controller
          name="languageRequirements"
          control={control}
          render={({ field, fieldState }) => {
            // field.value is string[] (e.g. ["Medication","PEG Feeding"])
            const selectedLanguages = (field.value ?? [])
              .map((val: string) => languages.find((o) => o.value === val)!)
              .filter(Boolean);

            const handleLanguageChange = (
              selected: MultiValue<LanguageOption>,
            ) => {
              const vals = (selected ?? []).map((o) => o.value);
              field.onChange(vals);
            };

            return (
              <>
                <Select<LanguageOption, true>
                  isMulti
                  options={languages}
                  value={selectedLanguages}
                  onChange={handleLanguageChange}
                  placeholder="Select Language Requirement..."
                  // PORTAL / POSITIONING fixes:
                  menuPortalTarget={sheetContentRef.current}
                  // menuPortalTarget={portalTarget}
                  menuPosition="fixed" // <- important
                  menuShouldScrollIntoView={false}
                  styles={customSelectStyles}
                  // optional: control whether menu closes on scroll
                  closeMenuOnScroll={false}
                />

                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(fieldState.error.message)}
                  </p>
                )}
              </>
            );
          }}
        />
      </div>
    </div>
  );
}
