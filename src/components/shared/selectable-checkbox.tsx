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
