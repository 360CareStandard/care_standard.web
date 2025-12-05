// components/legal/ConsentDataSharingFields.tsx
import * as React from "react";
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
import type { LegalForm } from "../../../schemas/legal-setup";

export function ConsentDataSharingFields() {
  const { control, register, setValue, getValues, trigger } =
    useFormContext<LegalForm>();

  // watch the form-backed values we care about
  const dataSharingOn = useWatch({
    control,
    name: "dataSharingConsent",
    defaultValue: false,
  });

  const mediaConsentOn = useWatch({
    control,
    name: "photoConsent",
    defaultValue: false,
  });

  const familyAppAllowed = useWatch({
    control,
    name: "familyAppPermission",
    defaultValue: false,
  });

  // dataSharingScope is stored as a comma separated string in the schema.
  // Provide helpers to toggle individual scope bits.
  const currentScope =
    (useWatch({
      control,
      name: "dataSharingScope",
    }) as string | undefined) ?? "";

  const scopeSet = React.useMemo(() => {
    const parts = currentScope
      ? currentScope.split(",").map((s) => s.trim())
      : [];
    return {
      family: parts.includes("Family"),
      clinicians: parts.includes("Clinicians"),
      external: parts.includes("External"),
    };
  }, [currentScope]);

  const toggleScopeKey = (k: keyof typeof scopeSet, v: boolean) => {
    const s = { ...scopeSet, [k]: v };
    const chosen: string[] = [];
    if (s.family) chosen.push("Family");
    if (s.clinicians) chosen.push("Clinicians");
    if (s.external) chosen.push("External");
    setValue("dataSharingScope", chosen.join(","), { shouldDirty: true });
    void trigger("dataSharingScope");
  };

  // contact consent booleans are direct fields
  const contactEmail = useWatch({
    control,
    name: "contactConsentEmail",
    defaultValue: false,
  });
  const contactSMS = useWatch({
    control,
    name: "contactConsentSMS",
    defaultValue: false,
  });
  const contactPhone = useWatch({
    control,
    name: "contactConsentPhone",
    defaultValue: false,
  });

  // SignedBy (string)
  const signedBy = useWatch({
    control,
    name: "dataSharingConsentSignedBy",
  });

  // Auto-clear dependent fields when toggles switch off
  React.useEffect(() => {
    if (!dataSharingOn) {
      setValue("dataSharingConsentDate", "");
      setValue("dataSharingConsentSignedBy", "");
      setValue("dataSharingScope", "");
      void trigger([
        "dataSharingConsentDate",
        "dataSharingConsentSignedBy",
        "dataSharingScope",
      ]);
    }
  }, [dataSharingOn, setValue, trigger]);

  const photoConsentDate = useWatch({
    control,
    name: "photoConsentDate",
    defaultValue: "",
  });

  React.useEffect(() => {
    if (!mediaConsentOn) {
      setValue("photoConsentDate", "", { shouldDirty: true });
      void trigger("photoConsentDate");
    }
  }, [mediaConsentOn, setValue, trigger]);

  return (
    <div className="space-y-8">
      {/* Data Sharing Consent */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium mb-1">Data Sharing Consent</Label>
            <p className="text-xs text-muted-foreground">
              Permission to share information with authorised parties
            </p>
          </div>

          {/* Switch bound to dataSharingConsent boolean */}
          <Controller
            control={control}
            name="dataSharingConsent"
            render={({ field }) => (
              <Switch
                checked={Boolean(field.value)}
                onCheckedChange={(v: boolean) => field.onChange(Boolean(v))}
              />
            )}
          />
        </div>

        {dataSharingOn && (
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-xl">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-primary rounded-l-xl" />

            <div>
              <Label className="mb-1 block">Consent Date</Label>
              <Input
                {...register("dataSharingConsentDate")}
                type="date"
                placeholder="mm/dd/yyyy"
                className="bg-white"
              />
            </div>

            <div>
              <Label className="mb-1 block">Signed By</Label>
              <Controller
                control={control}
                name="dataSharingConsentSignedBy"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select signatory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Client">Client</SelectItem>
                      <SelectItem value="Power of Attorney">
                        Power of Attorney
                      </SelectItem>
                      <SelectItem value="Family Member">
                        Family Member
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="col-span-2">
              <Label className="mb-1 block">Data Sharing Scope</Label>
              <div className="flex flex-wrap gap-6 pt-2">
                <Label className="flex items-center gap-2 bg-white py-1.5 px-2 rounded-md text-sm text-muted-foreground">
                  <Checkbox
                    checked={scopeSet.family}
                    onCheckedChange={(v) =>
                      toggleScopeKey("family", Boolean(v))
                    }
                  />
                  Family
                </Label>

                <Label className="flex items-center gap-2 bg-white py-1.5 px-2 rounded-md text-sm text-muted-foreground">
                  <Checkbox
                    checked={scopeSet.clinicians}
                    onCheckedChange={(v) =>
                      toggleScopeKey("clinicians", Boolean(v))
                    }
                  />
                  Clinicians
                </Label>

                <Label className="flex items-center gap-2 bg-white py-1.5 px-2 rounded-md text-sm text-muted-foreground">
                  <Checkbox
                    checked={scopeSet.external}
                    onCheckedChange={(v) =>
                      toggleScopeKey("external", Boolean(v))
                    }
                  />
                  External Services
                </Label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Photo / Media Consent */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium mb-1">Photo / Media Consent</Label>
            <p className="text-xs text-muted-foreground">
              Permission for photos and media usage
            </p>
          </div>

          <Controller
            control={control}
            name="photoConsent"
            render={({ field }) => (
              <Switch
                checked={Boolean(field.value)}
                onCheckedChange={(v: boolean) => field.onChange(Boolean(v))}
              />
            )}
          />
        </div>

        {mediaConsentOn && (
          <div className="relative grid grid-cols-2 sm:grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-xl">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-primary rounded-l-xl" />

            <div>
              <div>
                <Label className="mb-1 block">Photo Consent Date</Label>
                <Input
                  {...register("photoConsentDate")}
                  type="date"
                  placeholder="mm/dd/yyyy"
                  className="bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Consent for Notifications */}
      <div className="space-y-2">
        <Label className="font-medium">Contact Consent for Notifications</Label>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Controller
              control={control}
              name="contactConsentEmail"
              render={({ field }) => (
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={(v: boolean) => field.onChange(Boolean(v))}
                />
              )}
            />
            Email
          </label>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Controller
              control={control}
              name="contactConsentSMS"
              render={({ field }) => (
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={(v: boolean) => field.onChange(Boolean(v))}
                />
              )}
            />
            SMS
          </label>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Controller
              control={control}
              name="contactConsentPhone"
              render={({ field }) => (
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={(v: boolean) => field.onChange(Boolean(v))}
                />
              )}
            />
            Phone
          </label>
        </div>
      </div>

      {/* Family App Permission Pre-check */}
      <div className="space-y-3 py-2">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium mb-1">
              Family App Permission Pre-check
            </Label>
            <p className="text-xs text-muted-foreground">
              Allowed to grant family app access if consent present
            </p>
          </div>

          <Controller
            control={control}
            name="familyAppPermission"
            render={({ field }) => (
              <Switch
                checked={Boolean(field.value)}
                onCheckedChange={(v: boolean) => field.onChange(Boolean(v))}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
