// components/health/AllergiesIntolerancesFields.tsx
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

type Category = "Drug" | "Food" | "Environment" | "";
type Severity = "Mild" | "Moderate" | "Severe" | "Life-threatening" | "";

type Row = {
  id: string;
  category: Category;
  item: string;
  severity: Severity;
  note: string;
};

const CATEGORIES: Exclude<Category, "">[] = ["Drug", "Food", "Environment"];
const SEVERITIES: Exclude<Severity, "">[] = [
  "Mild",
  "Moderate",
  "Severe",
  "Life-threatening",
];

export function AllergiesIntolerancesFields() {
  const [rows, setRows] = React.useState<Row[]>([
    {
      id: crypto.randomUUID(),
      category: "Drug",
      item: "Penicillin",
      severity: "Severe",
      note: "",
    },
    {
      id: crypto.randomUUID(),
      category: "Food",
      item: "Peanuts",
      severity: "Mild",
      note: "",
    },
    {
      id: crypto.randomUUID(),
      category: "Environment",
      item: "Dust mites",
      severity: "Moderate",
      note: "",
    },
    { id: crypto.randomUUID(), category: "", item: "", severity: "", note: "" }, // trailing blank
  ]);

  const isEmpty = (r: Row) => !r.category && !r.item && !r.severity && !r.note;
  //   const last = rows[rows.length - 1];

  const update = (id: string, patch: Partial<Row>) => {
    setRows((s) => {
      const next = s.map((r) => (r.id === id ? { ...r, ...patch } : r));
      const L = next[next.length - 1];
      if (!isEmpty(L)) {
        next.push({
          id: crypto.randomUUID(),
          category: "",
          item: "",
          severity: "",
          note: "",
        });
      }
      return next;
    });
  };

  const addRow = () =>
    setRows((s) =>
      isEmpty(s[s.length - 1])
        ? s
        : [
            ...s,
            {
              id: crypto.randomUUID(),
              category: "",
              item: "",
              severity: "",
              note: "",
            },
          ]
    );

  const clearRow = (id: string) =>
    setRows((s) =>
      s.map((r) =>
        r.id === id
          ? { ...r, category: "", item: "", severity: "", note: "" }
          : r
      )
    );

  const removeRow = (id: string) =>
    setRows((s) => {
      const filtered = s.filter((r) => r.id !== id);
      return filtered.length
        ? filtered
        : [
            {
              id: crypto.randomUUID(),
              category: "",
              item: "",
              severity: "",
              note: "",
            },
          ];
    });

  const onKey = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRow();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      clearRow(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="font-medium">Known Allergies</Label>

        <div className="space-y-2">
          {rows.map((r) => {
            // const showRemove = !isEmpty(r) || rows.length > 1;
            return (
              <div
                key={r.id}
                className="flex flex-wrap items-center gap-2 p-2 bg-[#F7F9FC] rounded-md"
              >
                {/* Category */}
                <Select
                  value={r.category}
                  onValueChange={(v: Category) => update(r.id, { category: v })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Item */}
                <Input
                  placeholder="Allergen (e.g., Penicillin)"
                  value={r.item}
                  onChange={(e) => update(r.id, { item: e.target.value })}
                  onKeyDown={(e) => onKey(e, r.id)}
                  className="flex-1"
                />

                {/* Severity */}
                <Select
                  value={r.severity}
                  onValueChange={(v: Severity) => update(r.id, { severity: v })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITIES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Notes */}
                <Input
                  placeholder="Notes"
                  value={r.note}
                  onChange={(e) => update(r.id, { note: e.target.value })}
                  onKeyDown={(e) => onKey(e, r.id)}
                  className="flex-1"
                />

                {/* Remove */}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Remove allergy"
                    onClick={() =>
                      isEmpty(r) && rows.length === 1
                        ? clearRow(r.id)
                        : removeRow(r.id)
                    }
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-1 gap-2"
          onClick={addRow}
          //   disabled={!isEmpty(last)}
        >
          <Plus className="h-4 w-4" />
          Add Allergy
        </Button>
      </div>
    </div>
  );
}
