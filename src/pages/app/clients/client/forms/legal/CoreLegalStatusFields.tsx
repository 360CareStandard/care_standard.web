// components/legal/CoreLegalStatusFields.tsx
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type OrderKey = "DoLS" | "LPS" | "Court Order" | "Guardianship";

export function CoreLegalStatusFields() {
  const [poa, setPoa] = React.useState<
    "None" | "Health" | "Finance" | "Health & Finance"
  >("None");
  const [capacity, setCapacity] = React.useState<
    "Has Capacity" | "Lacks Capacity" | "Under Assessment"
  >("Has Capacity");
  const [dnr, setDnr] = React.useState(false);
  const [orders, setOrders] = React.useState<Record<OrderKey, boolean>>({
    DoLS: false,
    LPS: false,
    "Court Order": false,
    Guardianship: false,
  });

  // simple helpers
  const setOrder = (k: OrderKey, v: boolean) =>
    setOrders((s) => ({ ...s, [k]: v }));

  return (
    <div className="space-y-4">
      {/* Power of Attorney */}
      <div className="space-y-2">
        <Label>Power of Attorney</Label>
        <Select value={poa} onValueChange={(v: any) => setPoa(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select POA" />
          </SelectTrigger>
          <SelectContent>
            {["None", "Health", "Finance", "Health & Finance"].map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Conditional POA details */}
      {poa !== "None" && (
        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-xl">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-primary rounded-l-xl" />
          <div className="sm:col-span-2">
            <Label className="mb-1 block">POA Holder Name</Label>
            <Input placeholder="Full Name" className="bg-white text-xs" />
          </div>
          <div className="sm:col-span-1">
            <Label className="mb-1 block">POA Contact</Label>
            <Input
              placeholder="Email/phone number"
              className="bg-white text-xs"
            />
          </div>
          <div className="sm:col-span-1">
            <Label className="mb-1 block">Valid From</Label>
            <Input
              type="date"
              placeholder="mm/dd/yyyy"
              className="bg-white text-xs"
            />
          </div>
        </div>
      )}

      {/* Mental Capacity */}
      <div className="space-y-2">
        <Label>Mental Capacity</Label>
        <Select value={capacity} onValueChange={(v: any) => setCapacity(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select capacity" />
          </SelectTrigger>
          <SelectContent>
            {["Has Capacity", "Lacks Capacity", "Under Assessment"].map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* DNAR */}
      <div className="space-y-3 py-2">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium mb-1">
              DNAR / Do Not Resuscitate
            </Label>
            <p className="text-xs text-muted-foreground">
              Legal directive for emergency care
            </p>
          </div>
          <Switch checked={dnr} onCheckedChange={setDnr} />
        </div>

        {dnr && (
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-xl">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-primary rounded-l-xl" />
            <div>
              <Label className="mb-1 block">Reason</Label>
              <Input placeholder="Medical reason" className="bg-white" />
            </div>
            <div>
              <Label className="mb-1 block">Signed Date</Label>
              <Input
                type="date"
                placeholder="mm/dd/yyyy"
                className="bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="space-y-3">
        <Label className="mb-1 block">LPS / DoLS / Court Orders</Label>
        <div className="flex flex-wrap gap-6 mt-1">
          {(["DoLS", "LPS", "Court Order", "Guardianship"] as OrderKey[]).map(
            (k) => (
              <label
                key={k}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Checkbox
                  checked={orders[k]}
                  onCheckedChange={(v) => setOrder(k, Boolean(v))}
                />
                {k}
              </label>
            )
          )}
        </div>

        {/* Example: show details when "Court Order" is checked */}
        {orders["Court Order"] && (
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-xl">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-primary rounded-l-xl" />
            <div>
              <Label className="mb-1 block">Reference Number</Label>
              <Input className="bg-white" placeholder="Legal reference" />
            </div>
            <div>
              <Label className="mb-1 block">Responsible Authority</Label>
              <Input className="bg-white" placeholder="Legal reference" />
            </div>
            <div>
              <Label className="mb-1 block">Started Date</Label>
              <Input
                className="bg-white"
                type="date"
                placeholder="mm/dd/yyyy"
              />
            </div>
            <div>
              <Label className="mb-1 block">End Date</Label>
              <Input
                className="bg-white"
                type="date"
                placeholder="mm/dd/yyyy"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
