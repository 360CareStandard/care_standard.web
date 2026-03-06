import React from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ClientSettingsForm,
  ClientSettingsSchema,
} from "../../schemas/settings";
import ClientSettingsField from "./components/settings-form";
import { handleFormApiError } from "@/lib/handle-form-error";
import {
  useCreateClientSettings,
  useUpdateClientSettings,
  useClientSettings,
} from "@/hooks/client/useClientSettings";
import { ClientSettings } from "@/types/client/settings";
import { SheetForm } from "@/components/shared/sheet-form";
import {
  AccessSettingsForm,
  AccessSettingsSchema,
} from "../../schemas/access-settings";
import { Spinner } from "@/components/shared/spinner";
import AccessFormField from "./components/access-form";
import { useCreateClientAccessSettings } from "@/hooks/client/useClientAccess";

const fallbackValues: ClientSettingsForm = {
  enableFamilyAccess: false,
  missedVisitAlerts: false,
  criticalMedicationAlerts: false,
  geoLocationClockIn: false,
  shareCarePlanWithFamily: false,
  shareNotesWithFamily: false,
  shareHealthInfoWithFamily: false,
};
const accessfallbackValues: AccessSettingsForm = {
  fullName: "",
  accessLevel: "read_only",
  email: "",
  phone: "",
  relationshipToClient: "other",
};

const toClientSettingsForm = (
  values: Partial<ClientSettingsForm>,
): ClientSettingsForm => ({
  enableFamilyAccess: values.enableFamilyAccess ?? false,
  missedVisitAlerts: values.missedVisitAlerts ?? false,
  criticalMedicationAlerts: values.criticalMedicationAlerts ?? false,
  geoLocationClockIn: values.geoLocationClockIn ?? false,
  shareCarePlanWithFamily: values.shareCarePlanWithFamily ?? false,
  shareNotesWithFamily: values.shareNotesWithFamily ?? false,
  shareHealthInfoWithFamily: values.shareHealthInfoWithFamily ?? false,
});

const mapClientSettingsToForm = (
  settings: ClientSettings,
): ClientSettingsForm =>
  toClientSettingsForm({
    enableFamilyAccess: settings.enableFamilyAccess,
    missedVisitAlerts: settings.missedVisitAlerts,
    criticalMedicationAlerts: settings.criticalMedicationAlerts,
    geoLocationClockIn: settings.geoLocationClockIn,
    shareCarePlanWithFamily: settings.shareCarePlanWithFamily,
    shareNotesWithFamily: settings.shareNotesWithFamily,
    shareHealthInfoWithFamily: settings.shareHealthInfoWithFamily,
  });

const ClientSettingsComp = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [open, setOpen] = React.useState<boolean>(false);
  const createClientSettings = useCreateClientSettings(clientId as string);
  const createClientAccessSettings = useCreateClientAccessSettings(
    clientId as string,
  );
  const updateClientSettings = useUpdateClientSettings(clientId as string);
  const { data: clientSettings } = useClientSettings(clientId as string);

  const existingSettings = React.useMemo(
    () => (clientSettings ? mapClientSettingsToForm(clientSettings) : null),
    [clientSettings],
  );

  const methods = useForm<ClientSettingsForm>({
    resolver: zodResolver(ClientSettingsSchema) as unknown as Resolver<
      ClientSettingsForm,
      any
    >,
    mode: "onChange",
    defaultValues: fallbackValues,
  });
  const accessmethods = useForm<AccessSettingsForm>({
    resolver: zodResolver(AccessSettingsSchema) as unknown as Resolver<
      AccessSettingsForm,
      any
    >,
    mode: "onChange",
    defaultValues: accessfallbackValues,
  });

  const [hasCreatedSettings, setHasCreatedSettings] = React.useState(false);

  React.useEffect(() => {
    if (!existingSettings) return;

    methods.reset(toClientSettingsForm(existingSettings));
    setHasCreatedSettings(true);
  }, [existingSettings, methods]);

  const saveSettings = React.useCallback(
    async (values: ClientSettingsForm) => {
      const payload = toClientSettingsForm(values);

      try {
        if (hasCreatedSettings) {
          await updateClientSettings.mutateAsync({ body: payload });
          toast.success("Client settings updated");
        } else {
          await createClientSettings.mutateAsync(payload);
          setHasCreatedSettings(true);
          toast.success("Client settings saved");
        }

        methods.reset(payload);
      } catch (err) {
        handleFormApiError<ClientSettingsForm>(
          err,
          methods.setError,
          "Failed to update settings",
        );
      }
    },
    [hasCreatedSettings, updateClientSettings, createClientSettings, methods],
  );

  async function onSubmit(values: AccessSettingsForm) {
    try {
      await createClientAccessSettings.mutateAsync(values);
      toast.success("Family access invitation sent successfully");

      setOpen(false);
      accessmethods.reset(accessfallbackValues as any);
    } catch (err) {
      handleFormApiError<AccessSettingsForm>(
        err,
        accessmethods.setError,
        "Failed to send access invitation",
      );
    }
  }

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void accessmethods.handleSubmit(onSubmit)();
  };

  return (
    <div className="flex-1 w-full space-y-6">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-semibold">Client Settings</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage access, sharing, and client data preferences
          </p>
        </div>
      </div>

      <FormProvider {...methods}>
        <ClientSettingsField onAutoSubmit={saveSettings} setOpen={setOpen} />
      </FormProvider>

      <SheetForm
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            accessmethods.reset(accessfallbackValues as any);
          }
        }}
        title={"Share Access"}
        description={`Manage who has access to this client's information`}
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={
          accessmethods.formState.isSubmitting ? (
            <Spinner size="sm" />
          ) : (
            "Send Invitation"
          )
        }
        submitDisabled={accessmethods.formState.isSubmitting}
        onSubmit={handleSheetSubmit}
      >
        <FormProvider {...accessmethods}>
          <AccessFormField />
        </FormProvider>
      </SheetForm>
    </div>
  );
};

export default ClientSettingsComp;
