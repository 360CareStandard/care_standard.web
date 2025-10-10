import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

type Role =
  | "Therapist"
  | "District Nurse"
  | "Social Worker"
  | "Consultant"
  | "";
const ROLES: Exclude<Role, "">[] = [
  "Therapist",
  "District Nurse",
  "Social Worker",
  "Consultant",
];

type Row = {
  id: string;
  role: Role;
  name: string;
  phone: string;
  email: string;
  org: string;
  notes: string;
};

const makeBlank = (): Row => ({
  id: crypto.randomUUID(),
  role: "",
  name: "",
  phone: "",
  email: "",
  org: "",
  notes: "",
});

export function OtherHealthcareProfessionalsFields() {
  const [rows, setRows] = React.useState<Row[]>([
    {
      id: crypto.randomUUID(),
      role: "District Nurse",
      name: "",
      phone: "020 7777 8888",
      email: "gp@practice.nhs.uk",
      org: "",
      notes: "",
    },
    makeBlank(), // you can remove this if you don't want a starting blank
  ]);

  const isEmpty = (r: Row) =>
    !r.role && !r.name && !r.phone && !r.email && !r.org && !r.notes;

  // ⛔️ No auto-append here anymore
  const update = (id: string, patch: Partial<Row>) =>
    setRows((s) => s.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () => setRows((s) => [...s, makeBlank()]);

  const clearRow = (id: string) =>
    setRows((s) =>
      s.map((r) => (r.id === id ? { ...makeBlank(), id: r.id } : r))
    );

  const removeRow = (id: string) =>
    setRows((s) => {
      const filtered = s.filter((r) => r.id !== id);
      return filtered.length ? filtered : [makeBlank()];
    });

  const lastIsBlank = isEmpty(rows[rows.length - 1]);

  return (
    <div className="space-y-4">
      {rows.map((r, idx) => (
        <div key={r.id}>
          {/* header */}
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-lg font-medium">
              Healthcare Professional {idx + 1}
            </h4>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Remove professional"
              onClick={() =>
                isEmpty(r) && rows.length === 1
                  ? clearRow(r.id)
                  : removeRow(r.id)
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* row: role + name */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Role</Label>
              <Select
                value={r.role}
                onValueChange={(v: Role) => update(r.id, { role: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input
                placeholder="Professional name"
                value={r.name}
                onChange={(e) => update(r.id, { name: e.target.value })}
              />
            </div>
          </div>

          {/* row: phone + email */}
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Phone Number</Label>
              <Input
                inputMode="tel"
                placeholder="020 7777 8888"
                value={r.phone}
                onChange={(e) => update(r.id, { phone: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label>
                Email <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                type="email"
                inputMode="email"
                placeholder="gp@practice.nhs.uk"
                value={r.email}
                onChange={(e) => update(r.id, { email: e.target.value })}
              />
            </div>
          </div>

          {/* organisation */}
          <div className="mt-3 space-y-1">
            <Label>Organisation</Label>
            <Input
              placeholder="Organisation name"
              value={r.org}
              onChange={(e) => update(r.id, { org: e.target.value })}
            />
          </div>

          {/* notes */}
          <div className="mt-3 space-y-1">
            <Label>Notes</Label>
            <Textarea
              placeholder="Additional notes..."
              value={r.notes}
              onChange={(e) => update(r.id, { notes: e.target.value })}
              className="min-h-[84px] resize-y"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={addRow}
        disabled={lastIsBlank} // keep this if you want to prevent stacking empties
      >
        <Plus className="h-4 w-4" />
        Add Healthcare Professional
      </Button>
    </div>
  );
}
