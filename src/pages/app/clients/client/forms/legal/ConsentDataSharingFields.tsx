// components/legal/ConsentDataSharingFields.tsx
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

export function ConsentDataSharingFields() {
  const [dataSharingOn, setDataSharingOn] = React.useState(false);
  const [mediaConsentOn, setMediaConsentOn] = React.useState(false);
  const [familyAppAllowed, setFamilyAppAllowed] = React.useState(false);

  const [signedBy, setSignedBy] = React.useState<string | undefined>();
  const [scope, setScope] = React.useState({
    family: false,
    clinicians: false,
    external: false,
  });

  const [contactConsent, setContactConsent] = React.useState({
    email: false,
    sms: false,
    phone: false,
  });

  const setScopeKey = (k: keyof typeof scope, v: boolean) =>
    setScope((s) => ({ ...s, [k]: v }));
  const setContactKey = (k: keyof typeof contactConsent, v: boolean) =>
    setContactConsent((s) => ({ ...s, [k]: v }));

  return (
    <div className="space-y-8">
      {/* Data Sharing Consent */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium mb-1">Data Sharing Consent</Label>
            <p className="text-xs text-muted-foreground">
              Permission to sharing information with authorised parties
            </p>
          </div>
          <Switch checked={dataSharingOn} onCheckedChange={setDataSharingOn} />
        </div>

        {dataSharingOn && (
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-xl">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-primary rounded-l-xl" />
            <div>
              <Label className="mb-1 block">Consent Date</Label>
              <Input
                type="date"
                placeholder="mm/dd/yyyy"
                className="bg-white"
              />
            </div>
            <div>
              <Label className="mb-1 block">Signed By</Label>
              <Select value={signedBy} onValueChange={setSignedBy}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select signatory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Power of Attorney">
                    Power of Attorney
                  </SelectItem>
                  <SelectItem value="Family Member">Family Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="mb-1 block">Data Sharing Scope</Label>
              <div className="flex flex-wrap gap-6 pt-2">
                <Label className="flex items-center gap-2 bg-white py-1.5 px-2 rounded-md text-sm text-muted-foreground">
                  <Checkbox
                    checked={scope.family}
                    onCheckedChange={(v) => setScopeKey("family", Boolean(v))}
                  />
                  Family
                </Label>
                <Label className="flex items-center gap-2 bg-white py-1.5 px-2 rounded-md text-sm text-muted-foreground">
                  <Checkbox
                    checked={scope.clinicians}
                    onCheckedChange={(v) =>
                      setScopeKey("clinicians", Boolean(v))
                    }
                  />
                  Clinicians
                </Label>
                <Label className="flex items-center gap-2 bg-white py-1.5 px-2 rounded-md text-sm text-muted-foreground">
                  <Checkbox
                    checked={scope.external}
                    onCheckedChange={(v) => setScopeKey("external", Boolean(v))}
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
          <Switch
            checked={mediaConsentOn}
            onCheckedChange={setMediaConsentOn}
          />
        </div>

        {mediaConsentOn && (
          <div className="relative grid grid-cols-2 sm:grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-xl">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-primary rounded-l-xl" />
            <div>
              <Label className="mb-1 block">Photo Consent Date</Label>
              <Input
                type="date"
                placeholder="mm/dd/yyyy"
                className="bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Contact Consent for Notifications */}
      <div className="space-y-2">
        <Label className="font-medium">Contact Consent for Notifications</Label>
        <div className="flex flex-wrap gap-6">
          <Label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={contactConsent.email}
              onCheckedChange={(v) => setContactKey("email", Boolean(v))}
            />
            Email
          </Label>
          <Label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={contactConsent.sms}
              onCheckedChange={(v) => setContactKey("sms", Boolean(v))}
            />
            SMS
          </Label>
          <Label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={contactConsent.phone}
              onCheckedChange={(v) => setContactKey("phone", Boolean(v))}
            />
            Phone
          </Label>
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
          <Switch
            checked={familyAppAllowed}
            onCheckedChange={setFamilyAppAllowed}
          />
        </div>
      </div>
    </div>
  );
}
