// components/shared/select-field.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";

type Option = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

type SelectFieldProps = {
  label?: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string | boolean;
  hint?: string;
  containerClassName?: string;
  triggerClassName?: string;
  disabled?: boolean;
  id?: string; // for aria-labelledby when you have an external label
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  placeholder = "Select…",
  options,
  value,
  onChange,
  error,
  hint,
  disabled,
  containerClassName,
  triggerClassName,
  id,
}) => {
  const hasError = !!error;
  const labelId = id ? `${id}-label` : undefined;
  const helpId = id ? `${id}-help` : undefined;
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className={cn("w-full", containerClassName)}>
      {label ? (
        <Label
          id={labelId}
          className="mb-2 block text-sm font-normal text-slate-700"
        >
          {label}
        </Label>
      ) : null}

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          aria-invalid={hasError || undefined}
          aria-describedby={cn(
            hint ? helpId : undefined,
            hasError ? errorId : undefined,
          )}
          className={cn(
            "!h-11 text-sm w-full ",
            hasError
              ? "border-red-300 capitalize bg-red-50 text-red-900 placeholder:text-red-400 focus-visible:ring-red-500 focus-visible:border-red-500"
              : "focus-visible:ring-2 placeholder:text-sm",
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} className="capitalize" />
        </SelectTrigger>
        <SelectContent>
          {options.length > 0 ? (
            options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="text-sm capitalize"
              >
                {opt.label}
              </SelectItem>
            ))
          ) : (
            <SelectItem
              value="__empty__"
              disabled
              className="text-sm italic text-gray-400"
            >
              No options available
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {hasError && typeof error === "string" ? (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={helpId} className="mt-2 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
