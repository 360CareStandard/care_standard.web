import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

type Condition = {
  id: string;
  name: string;
  date: string; // mm/dd/yyyy (UI only)
  note: string; // short chip note, e.g. "Well controlled…"
};

export function ConditionHistoryFields() {
  const [rows, setRows] = React.useState<Condition[]>([
    {
      id: crypto.randomUUID(),
      name: "Diabetes Type 2",
      date: "2024-05-23", // HTML date input uses yyyy-mm-dd; display matches your screenshot
      note: "Well controlled…",
    },
    {
      id: crypto.randomUUID(),
      name: "",
      date: "",
      note: "",
    },
  ]);

  const [clinicalNotes, setClinicalNotes] = React.useState("");

  const update = (id: string, patch: Partial<Condition>) =>
    setRows((s) => s.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const remove = (id: string) => setRows((s) => s.filter((r) => r.id !== id));

  const addRow = () =>
    setRows((s) => [
      ...s,
      { id: crypto.randomUUID(), name: "", date: "", note: "" },
    ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="font-medium">Diagnosed Conditions</Label>

        <div className="space-y-1">
          {rows.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-center gap-2 p-2 bg-[#F7F9FC] rounded-md"
            >
              {/* condition name */}
              <div className=" flex-1">
                <Input
                  placeholder="Condition name"
                  value={r.name}
                  onChange={(e) => update(r.id, { name: e.target.value })}
                />
              </div>

              {/* date with calendar icon */}
              <div className="relative flex-1 ">
                <Input
                  type="date"
                  value={r.date}
                  onChange={(e) => update(r.id, { date: e.target.value })}
                  placeholder="mm/dd/yyyy"
                  className=" "
                />
                {/* <CalendarIcon className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /> */}
              </div>

              {/* short note chip */}
              <div className="flex-1 ">
                <Input
                  placeholder="Notes"
                  value={r.note}
                  onChange={(e) => update(r.id, { note: e.target.value })}
                />
              </div>

              {/* remove */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Remove condition"
                onClick={() => remove(r.id)}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-1 gap-2"
          onClick={addRow}
        >
          <Plus className="h-4 w-4" />
          Add Condition
        </Button>
      </div>

      {/* clinical notes */}
      <div className="space-y-2">
        <Label className="font-medium">Clinical Notes</Label>
        <Textarea
          placeholder="Notes for clinical context…"
          value={clinicalNotes}
          onChange={(e) => setClinicalNotes(e.target.value)}
          className="min-h-[76px] resize-y rounded-xl"
        />
      </div>
    </div>
  );
}
