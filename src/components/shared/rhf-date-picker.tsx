import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* helpers */
const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// const formatLong = (ymd?: string) => {
//   if (!ymd) return "";
//   const [y, m, d] = ymd.split("-").map(Number);
//   if (!y || !m || !d) return "";
//   const dt = new Date(y, m - 1, d);
//   if (Number.isNaN(dt.getTime())) return "";
//   return dt.toLocaleDateString("en-US", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });
// };

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>; // stores "YYYY-MM-DD"
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
};

export function RHFDatePicker<T extends FieldValues>({
  control,
  name,
  label = "Date",
  placeholder = "Select a date",
  minDate = new Date(1900, 0, 1),
  maxDate = new Date(),
  className,
}: Props<T>) {
  const min = toYMD(minDate);
  const max = toYMD(maxDate);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = (field.value as string | undefined) ?? "";

        return (
          <div className={cn("flex flex-col gap-2", className)}>
            {label && (
              <Label htmlFor={`${name}-display`} className="px-1">
                {label}
              </Label>
            )}

            <div className="relative w-full">
              <input
                id={`${name}-display`}
                type="date"
                value={value}
                min={min}
                max={max}
                onChange={(e) => field.onChange(e.target.value)} // "YYYY-MM-DD"
                onBlur={field.onBlur}
                placeholder={placeholder}
                className={cn(
                  "w-full text-base rounded-md border px-3 h-11 ", // clicks pass through
                  fieldState.invalid &&
                    "border-destructive bg-red-50 text-red-900 placeholder:text-red-400"
                )}
                aria-describedby={fieldState.error ? `${name}-err` : undefined}
              />
            </div>

            {fieldState.error?.message ? (
              <p id={`${name}-err`} className="text-sm text-red-600">
                {fieldState.error.message}
              </p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
