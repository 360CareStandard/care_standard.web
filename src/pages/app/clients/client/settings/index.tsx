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
import {
  useClientAccessSettings,
  useCreateClientAccessSettings,
  useDeleteClientAccessSettings,
  useSingleClientAccess,
  useUpdateClientAccessSettings,
} from "@/hooks/client/useClientAccess";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FamilyAccessItem } from "@/types/client/family-access";

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

const toAccessForm = (
  item?: Partial<FamilyAccessItem> | null,
): AccessSettingsForm => ({
  fullName: item?.fullName ?? "",
  accessLevel:
    (item?.accessLevel as AccessSettingsForm["accessLevel"]) ?? "read_only",
  email: item?.email ?? "",
  phone: item?.phone ?? "",
  relationshipToClient:
    (item?.relationshipToClient as AccessSettingsForm["relationshipToClient"]) ??
    "other",
});

const ClientSettingsComp = () => {
  const { clientId } = useParams<{ clientId: string }>();

  const [open, setOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const [editFamilyId, setEditFamilyId] = React.useState<string>("");
  const [selectedFam, setSelectedFam] = React.useState<FamilyAccessItem | null>(
    null,
  );

  const isEditMode = Boolean(editFamilyId);

  const createClientSettings = useCreateClientSettings(clientId as string);
  const updateClientSettings = useUpdateClientSettings(clientId as string);
  const { data: clientSettings } = useClientSettings(clientId as string);

  const createFamilyAccessSettings = useCreateClientAccessSettings(
    clientId as string,
  );
  const updateFamilyAccessSettings = useUpdateClientAccessSettings(
    clientId as string,
    editFamilyId,
  );
  const deleteFamilyAccess = useDeleteClientAccessSettings(clientId as string);

  const { data: familyAccessData } = useClientAccessSettings(
    clientId as string,
  );

  const { data: familyAccessDetails, isLoading: isLoadingDetails } =
    useSingleClientAccess(clientId as string, editFamilyId, isEditMode);

  const existingSettings = React.useMemo(
    () => (clientSettings ? mapClientSettingsToForm(clientSettings) : null),
    [clientSettings],
  );

  const familyAccessArr = React.useMemo(() => {
    // adjust this line if your hook already returns the array directly
    return Array.isArray(familyAccessData)
      ? familyAccessData
      : (familyAccessData ?? []);
  }, [familyAccessData]);

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

  React.useEffect(() => {
    if (!open) return;

    if (!isEditMode) {
      accessmethods.reset(accessfallbackValues);
      return;
    }

    if (familyAccessDetails) {
      accessmethods.reset(toAccessForm(familyAccessDetails));
    }
  }, [open, isEditMode, familyAccessDetails, accessmethods]);

  const resetAccessSheetState = React.useCallback(() => {
    setEditFamilyId("");
    accessmethods.reset(accessfallbackValues);
  }, [accessmethods]);

  const handleOpenCreate = React.useCallback(() => {
    setEditFamilyId("");
    accessmethods.reset(accessfallbackValues);
    setOpen(true);
  }, [accessmethods]);

  const handleOpenEdit = React.useCallback((item: FamilyAccessItem) => {
    setEditFamilyId(item.id);
    setOpen(true);
  }, []);

  const handleAskDelete = React.useCallback((item: FamilyAccessItem) => {
    setSelectedFam(item);
    setConfirmOpen(true);
  }, []);

  const performDelete = async () => {
    if (!selectedFam) return;

    try {
      await deleteFamilyAccess.mutateAsync(selectedFam.id);
      toast.success("Family access removed successfully");
      setConfirmOpen(false);
      setSelectedFam(null);

      if (editFamilyId === selectedFam.id) {
        setOpen(false);
        resetAccessSheetState();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete family access");
    }
  };

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

  const onSubmit = async (values: AccessSettingsForm) => {
    try {
      if (isEditMode) {
        await updateFamilyAccessSettings.mutateAsync(values);
        toast.success("Family access updated successfully");
      } else {
        await createFamilyAccessSettings.mutateAsync(values);
        toast.success("Family access invitation sent successfully");
      }

      setOpen(false);
      resetAccessSheetState();
    } catch (err) {
      handleFormApiError<AccessSettingsForm>(
        err,
        accessmethods.setError,
        isEditMode
          ? "Failed to update family access"
          : "Failed to send access invitation",
      );
    }
  };

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void accessmethods.handleSubmit(onSubmit)();
  };

  const isSubmittingAccess =
    accessmethods.formState.isSubmitting ||
    createFamilyAccessSettings.isPending ||
    updateFamilyAccessSettings.isPending;

  return (
    <div className="w-full flex-1 space-y-6">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Client Settings</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage access, sharing, and client data preferences
          </p>
        </div>
      </div>

      <FormProvider {...methods}>
        <ClientSettingsField
          onAutoSubmit={saveSettings}
          setOpen={handleOpenCreate}
        />
      </FormProvider>

      <SheetForm
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            resetAccessSheetState();
          }
        }}
        title={isEditMode ? "Edit Shared Access" : "Share Access"}
        description="Manage who has access to this client's information"
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={
          isSubmittingAccess || isLoadingDetails ? (
            <Spinner size="sm" />
          ) : isEditMode ? (
            "Update Access"
          ) : (
            "Send Invitation"
          )
        }
        submitDisabled={isSubmittingAccess || isLoadingDetails}
        onSubmit={handleSheetSubmit}
      >
        {isEditMode && isLoadingDetails ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <FormProvider {...accessmethods}>
            <AccessFormField
              familyAccessList={familyAccessArr}
              onDeleteFamilyAccess={(id) => {
                const item = familyAccessArr.find((fam) => fam.id === id);
                if (!item) return;
                handleAskDelete(item);
              }}
              onEditFamilyAccess={handleOpenEdit}
              isDeletingId={
                deleteFamilyAccess.isPending ? selectedFam?.id : undefined
              }
            />
          </FormProvider>
        )}
      </SheetForm>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(value) => {
          setConfirmOpen(value);
          if (!value) setSelectedFam(null);
        }}
        handleConfirm={performDelete}
        disabled={deleteFamilyAccess.isPending}
        isLoading={deleteFamilyAccess.isPending}
        className="!bg-[#F9FAFB]"
        title={
          <div>
            <span className="text-sm">Remove family access?</span>
          </div>
        }
        desc={
          <div className="space-y-6">
            <div className="space-y-2 rounded-lg border bg-white p-4">
              <p className="text-sm text-muted-foreground">
                This will revoke and remove access for{" "}
                <span className="font-medium text-foreground">
                  {selectedFam?.fullName ?? "this family member"}
                </span>
                .
              </p>
            </div>
          </div>
        }
        cancelBtnText="Cancel"
        confirmText="Delete"
        destructive
      />
    </div>
  );
};

export default ClientSettingsComp;
