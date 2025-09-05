// components/shared/rhf-select-field.tsx
import * as React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { SelectField } from "./select-field";

type Option = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

type RHFSelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: Option[];
  containerClassName?: string;
  triggerClassName?: string;
  disabled?: boolean;

  /**
   * When to show error text
   * - "touched": only after first touch
   * - "dirty": only after dirty
   * - "always": always if invalid
   * Default is "touched", but we also show on form submit automatically.
   */
  showErrorWhen?: "touched" | "dirty" | "always";
  forceShowError?: boolean;
};

export function RHFSelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  containerClassName,
  triggerClassName,
  disabled,
  showErrorWhen = "touched",
  forceShowError,
}: RHFSelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => {
        // Consider the field "touched" once the user picks a value (Radix often won’t emit blur)
        const handleChange = (v: string) => {
          field.onChange(v);
          field.onBlur(); // mark touched so touched-based UIs work
        };

        // Show error if invalid and either:
        // - developer asked "always"
        // - the form already attempted submit (Next/Submit)
        // - the user touched or dirtied the field

        const show =
          fieldState.invalid &&
          (forceShowError ||
            showErrorWhen === "always" ||
            formState.isSubmitted ||
            (showErrorWhen === "touched" && fieldState.isTouched) ||
            (showErrorWhen === "dirty" && fieldState.isDirty));
        return (
          <SelectField
            label={label}
            placeholder={placeholder}
            options={options}
            value={(field.value as string | undefined) ?? undefined}
            onChange={handleChange}
            disabled={disabled}
            error={show ? fieldState.error?.message : undefined}
            containerClassName={containerClassName}
            triggerClassName={triggerClassName}
          />
        );
      }}
    />
  );
}
