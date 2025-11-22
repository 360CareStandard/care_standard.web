// components/legal/CoreLegalStatusFields.tsx
import { useFormContext, Controller, useWatch } from "react-hook-form";
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
import { LegalForm } from "../../../schemas/legal-setup";

// type OrderKey = "DoLS" | "LPS" | "Court Order" | "Guardianship";

export function CoreLegalStatusFields() {
  const { control, register } = useFormContext<LegalForm>();

  // Watch values we care about for conditional UI
  const powerOfAttorney = useWatch({ control, name: "powerOfAttorney" });
  const dnarActive = useWatch({ control, name: "dnarActive" });
  const hasCourtOrder = useWatch({ control, name: "hasCourtOrder" });

  // options (values match the schema)
  const poaOptions = [
    { label: "None", value: "none" },
    { label: "Health", value: "health" },
    { label: "Finance", value: "finance" },
    { label: "Health & Finance", value: "health-finance" },
  ];

  const capacityOptions = [
    { label: "Has Capacity", value: "has-capacity" },
    { label: "Lacks Capacity", value: "lacks-capacity" },
    { label: "Under Assessment", value: "under-assessment" },
  ];

  return (
    <div className="space-y-4">
      {/* Power of Attorney */}
      <div className="space-y-2">
        <Label>Power of Attorney</Label>
        <Controller
          control={control}
          name="powerOfAttorney"
          defaultValue="none"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select POA" />
              </SelectTrigger>
              <SelectContent>
                {poaOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Conditional POA details */}
      {powerOfAttorney !== "none" && (
        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-xl">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-primary rounded-l-xl" />
          <div className="sm:col-span-2">
            <Label className="mb-1 block">POA Holder Name</Label>
            <Input
              {...register("poaHolderName")}
              placeholder="Full Name"
              className="bg-white text-xs"
            />
          </div>
          <div className="sm:col-span-1">
            <Label className="mb-1 block">POA Contact</Label>
            <Input
              {...register("poaContact")}
              placeholder="Email/phone number"
              className="bg-white text-xs"
            />
          </div>
          <div className="sm:col-span-1">
            <Label className="mb-1 block">Valid From</Label>
            <Input
              {...register("poaValidFrom")}
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
        <Controller
          control={control}
          name="mentalCapacity"
          defaultValue="has-capacity"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select capacity" />
              </SelectTrigger>
              <SelectContent>
                {capacityOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
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

          <Controller
            control={control}
            name="dnarActive"
            defaultValue={false}
            render={({ field }) => (
              <Switch
                checked={Boolean(field.value)}
                onCheckedChange={(v: boolean) => field.onChange(Boolean(v))}
              />
            )}
          />
        </div>

        {dnarActive && (
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-xl">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-primary rounded-l-xl" />
            <div>
              <Label className="mb-1 block">Reason</Label>
              <Input
                {...register("dnarReason")}
                placeholder="Medical reason"
                className="bg-white"
              />
            </div>
            <div>
              <Label className="mb-1 block">Signed Date</Label>
              <Input
                {...register("dnarSignedDate")}
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
          {/* DoLS */}
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Controller
              control={control}
              name="hasDoLS"
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={(v: boolean) => field.onChange(Boolean(v))}
                />
              )}
            />
            DoLS
          </label>

          {/* LPS */}
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Controller
              control={control}
              name="hasLPS"
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={(v: boolean) => field.onChange(Boolean(v))}
                />
              )}
            />
            LPS
          </label>

          {/* Court Order */}
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Controller
              control={control}
              name="hasCourtOrder"
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={(v: boolean) => field.onChange(Boolean(v))}
                />
              )}
            />
            Court Order
          </label>

          {/* Guardianship */}
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Controller
              control={control}
              name="hasGuardianship"
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={(v: boolean) => field.onChange(Boolean(v))}
                />
              )}
            />
            Guardianship
          </label>
        </div>

        {/* show details when "Court Order" is checked */}
        {hasCourtOrder && (
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-xl">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-primary rounded-l-xl" />
            <div>
              <Label className="mb-1 block">Reference Number</Label>
              <Input
                {...register("legalReferenceNumber")}
                className="bg-white"
                placeholder="Legal reference"
              />
            </div>
            <div>
              <Label className="mb-1 block">Responsible Authority</Label>
              <Input
                {...register("legalResponsibleAuthority")}
                className="bg-white"
                placeholder="Responsible authority"
              />
            </div>
            <div>
              <Label className="mb-1 block">Started Date</Label>
              <Input
                {...register("legalStartDate")}
                className="bg-white"
                type="date"
                placeholder="mm/dd/yyyy"
              />
            </div>
            <div>
              <Label className="mb-1 block">End Date</Label>
              <Input
                {...register("legalEndDate")}
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
