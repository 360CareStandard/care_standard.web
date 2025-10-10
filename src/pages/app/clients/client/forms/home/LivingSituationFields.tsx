// components/home/LivingSituationFields.tsx
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
import { Switch } from "@/components/ui/switch";
import { X, Plus } from "lucide-react";

type Member = {
  id: string;
  name: string;
  relationship: string;
};

const makeBlank = (): Member => ({
  id: crypto.randomUUID(),
  name: "",
  relationship: "",
});

const PROPERTY_TYPES = [
  "Flat",
  "House",
  "Supported Housing",
  "Residential Care",
] as const;
const SUPPORT_TYPES = [
  "Own Home",
  "Sheltered Housing",
  "Council House",
  "Private Rented",
] as const;

export function LivingSituationFields() {
  const [livesAlone, setLivesAlone] = React.useState(false);

  // seeded like your mock; remove seeds if you want to start empty
  const [members, setMembers] = React.useState<Member[]>([
    { id: crypto.randomUUID(), name: "Robert Wilson", relationship: "Spouse" },
    { id: crypto.randomUUID(), name: "Max (Dog)", relationship: "Pet" },
    makeBlank(),
  ]);

  const [propertyType, setPropertyType] =
    React.useState<(typeof PROPERTY_TYPES)[number]>("Flat");
  const [supportType, setSupportType] =
    React.useState<(typeof SUPPORT_TYPES)[number]>("Own Home");

  const isEmpty = (m: Member) => !m.name && !m.relationship;

  const updateMember = (id: string, patch: Partial<Member>) =>
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );

  const addMember = () => setMembers((prev) => [...prev, makeBlank()]);

  const clearMember = (id: string) =>
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...makeBlank(), id: m.id } : m))
    );

  const removeMember = (id: string) =>
    setMembers((prev) => {
      const out = prev.filter((m) => m.id !== id);
      return out.length ? out : [makeBlank()];
    });

  // If Lives Alone is turned on, clear members and keep one blank row (disabled)
  React.useEffect(() => {
    if (livesAlone) {
      setMembers([makeBlank()]);
    }
  }, [livesAlone]);

  const lastIsBlank = isEmpty(members[members.length - 1]);

  return (
    <div className="space-y-4">
      {/* Lives Alone */}
      <div className="flex items-start justify-between">
        <div>
          <Label className="font-medium mb-1">Lives Alone</Label>
          <p className="text-xs text-muted-foreground">
            Does the client live by themselves?
          </p>
        </div>
        <Switch checked={livesAlone} onCheckedChange={setLivesAlone} />
      </div>

      {/* Household Members */}
      {!livesAlone && (
        <div className="space-y-2">
          <Label className="font-medium">Household Members</Label>

          <div className="space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] items-center gap-2  p-2 bg-[#F7F9FC] rounded-md"
              >
                {/* Name */}
                <Input
                  placeholder="Name"
                  value={m.name}
                  onChange={(e) => updateMember(m.id, { name: e.target.value })}
                  disabled={livesAlone}
                />

                {/* Relationship (free text, like your mock) */}
                <Input
                  placeholder="Relationship"
                  value={m.relationship}
                  onChange={(e) =>
                    updateMember(m.id, { relationship: e.target.value })
                  }
                  disabled={livesAlone}
                />

                {/* Remove */}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Remove household member"
                    onClick={() =>
                      isEmpty(m) && members.length === 1
                        ? clearMember(m.id)
                        : removeMember(m.id)
                    }
                    disabled={livesAlone}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-1 gap-2"
            onClick={addMember}
            disabled={livesAlone || lastIsBlank} // prevent stacking empties or adding when Lives Alone
          >
            <Plus className="h-4 w-4" />
            Add Household Member
          </Button>
        </div>
      )}

      {/* Property / Support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Property Type</Label>
          <Select
            value={propertyType}
            onValueChange={(v) => setPropertyType(v as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Support Type</Label>
          <Select
            value={supportType}
            onValueChange={(v) => setSupportType(v as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORT_TYPES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
