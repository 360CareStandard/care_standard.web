import React from "react";
import { Controller, FieldPath, useFormContext } from "react-hook-form";
import { Bell, Share2, Shield, UserPlus, LucideIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ClientSettingsForm } from "../../../schemas/settings";

type SettingsFieldConfig = {
  name: FieldPath<ClientSettingsForm>;
  label: string;
  description: string;
  submitOnChange?: boolean;
};

type SettingsSectionCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  fields: SettingsFieldConfig[];
  footer?: React.ReactNode;
  onAutoSubmit?: (values: ClientSettingsForm) => Promise<void>;
};

type SettingsSwitchFieldProps = SettingsFieldConfig & {
  showSeparator?: boolean;
  onAutoSubmit?: (values: ClientSettingsForm) => Promise<void>;
};

function pickClientSettingsForm(
  values: Partial<ClientSettingsForm>,
): ClientSettingsForm {
  return {
    enableFamilyAccess: values.enableFamilyAccess ?? false,
    missedVisitAlerts: values.missedVisitAlerts ?? false,
    criticalMedicationAlerts: values.criticalMedicationAlerts ?? false,
    geoLocationClockIn: values.geoLocationClockIn ?? false,
    shareCarePlanWithFamily: values.shareCarePlanWithFamily ?? false,
    shareNotesWithFamily: values.shareNotesWithFamily ?? false,
    shareHealthInfoWithFamily: values.shareHealthInfoWithFamily ?? false,
  };
}

function SettingsSwitchField({
  name,
  label,
  description,
  submitOnChange = false,
  showSeparator = false,
  onAutoSubmit,
}: SettingsSwitchFieldProps) {
  const { control, getValues } = useFormContext<ClientSettingsForm>();
  const [isSaving, setIsSaving] = React.useState(false);

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex items-start justify-between gap-4 py-2">
            <div className="space-y-1">
              <Label className="font-medium">{label}</Label>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <Switch
              checked={Boolean(field.value)}
              disabled={isSaving}
              onCheckedChange={async (checked) => {
                field.onChange(checked);

                if (!submitOnChange || !onAutoSubmit) return;

                try {
                  setIsSaving(true);

                  const nextValues = pickClientSettingsForm({
                    ...getValues(),
                    [name]: checked,
                  });

                  await onAutoSubmit(nextValues);
                } finally {
                  setIsSaving(false);
                }
              }}
            />
          </div>
        )}
      />

      {showSeparator && <Separator />}
    </>
  );
}

function SettingsSectionCard({
  title,
  description,
  icon: Icon,
  fields,
  footer,
  onAutoSubmit,
}: SettingsSectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 items-start">
          <span className="p-2 rounded-md bg-primary-accent">
            <Icon size={18} className="text-primary" />
          </span>

          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <SettingsSwitchField
            key={field.name}
            {...field}
            onAutoSubmit={onAutoSubmit}
            showSeparator={index < fields.length - 1}
          />
        ))}
      </CardContent>

      {footer && (
        <>
          <Separator />
          <CardFooter>{footer}</CardFooter>
        </>
      )}
    </Card>
  );
}

const accessSharingFields: SettingsFieldConfig[] = [
  {
    name: "enableFamilyAccess",
    label: "Enable family app access",
    description:
      "Authorised family members can view selected client information through the family app",
    submitOnChange: true,
  },
];

const notificationFields: SettingsFieldConfig[] = [
  {
    name: "missedVisitAlerts",
    label: "Missed visit alerts",
    description: "Get notified when scheduled visits are missed or late",
    submitOnChange: true,
  },
  {
    name: "criticalMedicationAlerts",
    label: "Critical medication alerts",
    description:
      "Receive alerts for critical or missed medication administration",
    submitOnChange: true,
  },
  {
    name: "geoLocationClockIn",
    label: "Geo location check-in",
    description: "Confirm care workers' location when they check-in to a visit",
    submitOnChange: true,
  },
];

const privacyFields: SettingsFieldConfig[] = [
  {
    name: "shareCarePlanWithFamily",
    label: "Share care plan with family",
    description: "Family members with access can view the client's care plan",
    submitOnChange: true,
  },
  {
    name: "shareNotesWithFamily",
    label: "Share notes with family",
    description: "Family members can access visit notes and care observations",
    submitOnChange: true,
  },
  {
    name: "shareHealthInfoWithFamily",
    label: "Share health information with family",
    description:
      "Family members can view health conditions and medication records",
    submitOnChange: true,
  },
];

type ClientSettingsFieldProps = {
  onAutoSubmit?: (values: ClientSettingsForm) => Promise<void>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ClientSettingsField({
  onAutoSubmit,
  setOpen,
}: ClientSettingsFieldProps) {
  return (
    <div className="mt-2 w-full max-w-[933px] space-y-5">
      <SettingsSectionCard
        title="Access & Sharing"
        description="Control who can view client information, including family app access"
        icon={Share2}
        fields={accessSharingFields}
        onAutoSubmit={onAutoSubmit}
        footer={
          <Button size="sm" type="button" onClick={() => setOpen(true)}>
            <UserPlus size={14} />
            Share access
          </Button>
        }
      />

      <SettingsSectionCard
        title="Notifications"
        description="Control alerts related to this client"
        icon={Bell}
        fields={notificationFields}
        onAutoSubmit={onAutoSubmit}
      />

      <SettingsSectionCard
        title="Privacy Controls"
        description="Control what information is shared with family or external users"
        icon={Shield}
        fields={privacyFields}
        onAutoSubmit={onAutoSubmit}
      />
    </div>
  );
}
