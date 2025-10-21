// components/shared/rhf-phone-rpni.tsx
"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  defaultCountry?: string; // "GB"
  className?: string;
  disabled?: boolean;
  onCountryChange?: (country?: string) => void; // e.g. "GB"
};

export function RHFPhone<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Enter phone number",
  defaultCountry = "GB",
  className,
  disabled,
  onCountryChange,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn("flex flex-col gap-2", className)}>
          {label && (
            <Label className=" block text-sm font-normal text-slate-700">
              {label}
            </Label>
          )}

          <PhoneInput
            international // enables + prefix & intl format
            countries={["GB", "US", "CA", "AU", "DE"]} // whitelist
            defaultCountry={defaultCountry as any} // e.g. "GB"
            value={(field.value as string) ?? ""}
            onChange={(v) => field.onChange(v ?? "")}
            onCountryChange={onCountryChange as any}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              "cs-phone-input", // 👈 our style hook
              fieldState.invalid && "cs-phone-input--error"
            )}
          />

          {fieldState.error?.message && (
            <p className="text-xs text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
