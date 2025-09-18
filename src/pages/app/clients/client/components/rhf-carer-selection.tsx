// components/shared/rhf-carer-selection.tsx
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { CarerSelection, type Carer } from "./carer-selection";

type Props<T extends FieldValues> = {
  name: Path<T>; // string[] of carer IDs
  label: string;
  description?: string;
  availableCarers: Carer[];
  placeholder?: string;
  maxSelections?: number;
  disabledIds?: string[];
  variant?: "preferred" | "avoid";
  className?: string;
};

export function RHFCarerSelection<T extends FieldValues>({
  name,
  label,
  description,
  availableCarers,
  placeholder,
  maxSelections,
  disabledIds,
  variant,
  className,
}: Props<T>) {
  const { control } = useFormContext<T>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CarerSelection
          label={label}
          description={description}
          selectedCarers={(field.value as string[]) ?? []}
          availableCarers={availableCarers}
          onSelectionChange={field.onChange}
          placeholder={placeholder}
          maxSelections={maxSelections}
          disabledIds={disabledIds}
          variant={variant}
          className={className}
        />
      )}
    />
  );
}
