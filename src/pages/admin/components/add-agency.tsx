import { SheetForm } from "@/components/shared/sheet-form";
import { Spinner } from "@/components/shared/spinner";
import { handleFormApiError } from "@/lib/handle-form-error";

import {
  CreateAgencyFormData,
  CreateAgencyFormInput,
  createAgencySchema,
} from "@/pages/schemas/add-agency";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useAgency, useCreateAgency, useUpdateAgency } from "@/hooks/agency";
import AgencyForm from "./forms/agency-form";
import { AgenciesNewSingleData } from "@/types/agency";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agencyId?: string;
}

const AddAgency = ({ open, onOpenChange, agencyId }: Props) => {
  const isEdit = Boolean(agencyId);
  const methods = useForm<
    CreateAgencyFormInput,
    undefined,
    CreateAgencyFormData
  >({
    resolver: zodResolver(createAgencySchema),

    defaultValues: {
      agency: {
        legalName: "",
        tradingName: "",
        country: "",
        settings: {},
      },

      owner: {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
      },

      sendEmails: true,
    },

    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  const { data: agencyData, isLoading: isAgencyDataLoading } = useAgency(
    agencyId as string,
    isEdit,
  );

  const { mutateAsync: updateAgency, isPending: isUpdating } = useUpdateAgency(
    agencyId!,
  );

  const { mutateAsync: createAgency, isPending: isCreating } =
    useCreateAgency();

  const isSubmitting = isCreating || isUpdating;

  function mapClientToForm(data: AgenciesNewSingleData): CreateAgencyFormData {
    return {
      agency: {
        legalName: data.agency.legalName,
        tradingName: data.agency.tradingName,
        country: data.agency.country,
        settings: {},
      },

      owner: {
        firstname: data.agency.owner.firstname,
        lastname: data.agency.owner.lastname,
        email: data.agency.owner.email,
        phone: data.agency.owner.phone,
      },

      sendEmails: true,
    };
  }

  React.useEffect(() => {
    if (agencyData && isEdit) {
      methods.reset(mapClientToForm(agencyData));
    }
  }, [agencyData, isEdit, methods]);

  const onValidSubmit = async (values: CreateAgencyFormData) => {
    try {
      if (isEdit) {
        await updateAgency({
          agencyId: agencyId!,
          body: values,
        });

        toast.success("Agency updated successfully");
      } else {
        await createAgency(values);

        toast.success("Agency created successfully");
      }

      onOpenChange(false);
      methods.reset();
    } catch (err) {
      handleFormApiError<CreateAgencyFormData>(
        err,
        methods.setError,
        isEdit ? "Failed to update agency" : "Failed to create agency",
      );
    }
  };

  const onFormSubmit: React.FormEventHandler = (event) => {
    return methods.handleSubmit(onValidSubmit)(event);
  };

  const isLoadingEditData = isEdit && isAgencyDataLoading;
  return (
    <SheetForm
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Agency" : "Add New Agency"}
      description={
        isEdit
          ? "Edit the details of the existing agency."
          : "Create a new agency and assign an owner to manage it."
      }
      headerClassName="bg-[#E4E7EC] py-2.5"
      onSubmit={onFormSubmit}
      submitLabel={
        isSubmitting ? (
          <Spinner />
        ) : isEdit ? (
          "Save Changes"
        ) : (
          "Create New Agency"
        )
      }
      submitDisabled={isSubmitting || isLoadingEditData}
    >
      <FormProvider {...methods}>
        <div className="space-y-4">
          {isLoadingEditData ? (
            <div className="flex bg-n min-h-40 flex-col items-center justify-center gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-muted-foreground">Loading Agency...</p>
            </div>
          ) : (
            <AgencyForm isSubmitting={isCreating} />
          )}
        </div>
      </FormProvider>
    </SheetForm>
  );
};

export default AddAgency;
