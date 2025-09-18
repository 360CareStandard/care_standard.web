// components/shared/rhf-time-picker.tsx
import {
  useFormContext,
  useWatch,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { TimePicker } from "./time-picker";

type Props<T extends FieldValues> = {
  nameTime: Path<T>; // e.g. "overnightStart"
  namePeriod: Path<T>; // e.g. "overnightStartPeriod"
  label: string;
  error?: string;
};

export function RHFTimePicker<T extends FieldValues>({
  nameTime,
  namePeriod,
  label,
  error,
}: Props<T>) {
  const { control, setValue } = useFormContext<T>();

  // 👇 subscribe to BOTH values so the component re-renders on either change
  const [time, period] = useWatch({
    control,
    name: [nameTime, namePeriod] as [Path<T>, Path<T>],
  }) as [unknown, unknown];

  const currentTime = typeof time === "string" ? time : "";
  const currentPeriod = (
    period === "PM" ? "PM" : period === "AM" ? "AM" : "AM"
  ) as "AM" | "PM";

  return (
    <TimePicker
      label={label}
      value={{ time: currentTime, period: currentPeriod }}
      onChange={(next) => {
        setValue(nameTime, next.time as any, {
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue(namePeriod, next.period as any, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }}
      error={error}
    />
  );
}
