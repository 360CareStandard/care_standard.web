import { SheetForm } from "@/components/shared/sheet-form";
import { Spinner } from "@/components/shared/spinner";
import { TextField } from "@/components/shared/text-field";
import { TextareaField } from "@/components/shared/textarea-field";
import { Label } from "@/components/ui/label";
import {
  useCreateCarePackage,
  useSingleCarePackage,
  useUpdateCarePackage,
} from "@/hooks/agency/care-package";
import { handleFormApiError } from "@/lib/handle-form-error";
import {
  CarePackageFormData,
  carePackageSchema,
} from "@/pages/schemas/care-package";
import { useAuthStore } from "@/stores/auth-store";
import { CarePackage } from "@/types/care-package";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId?: string;
}

const AddCarePackage = ({ open, onOpenChange, packageId }: Props) => {
  // Replace with actual agency ID
  const isEdit = Boolean(packageId);

  const agencyId = useAuthStore((s) => s.workspace?.id);

  const methods = useForm<CarePackageFormData>({
    resolver: zodResolver(carePackageSchema),
    defaultValues: {
      name: "",
      description: "",
      agencyId: agencyId ?? "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  React.useEffect(() => {
    if (agencyId && !isEdit) {
      methods.setValue("agencyId", agencyId);
    }
  }, [agencyId, isEdit, methods]);
  const {
    register,
    formState: { errors },
  } = methods;

  const { data: packageData, isLoading: isPackageDataLoading } =
    useSingleCarePackage(packageId as string, isEdit);

  const { mutateAsync: createCarePackage, isPending: isCreating } =
    useCreateCarePackage();

  const { mutateAsync: updateCarePackage, isPending: isUpdating } =
    useUpdateCarePackage();

  const isSubmitting = isCreating || isUpdating;

  function mapClientToForm(data: CarePackage): CarePackageFormData {
    return {
      name: data.name ?? "",
      description: data.description ?? "",
      agencyId: data.agencyId ?? "",
    };
  }

  React.useEffect(() => {
    if (packageData && isEdit) {
      methods.reset(mapClientToForm(packageData));
    }
  }, [packageData, isEdit, methods]);
  const onValidSubmit = async (vals: CarePackageFormData) => {
    if (!agencyId) {
      toast.error("Unable to determine the agency");
      return;
    }

    const payload = {
      ...vals,
      agencyId,
    };

    try {
      if (isEdit) {
        await updateCarePackage({
          packageId: packageId!,
          body: payload,
        });

        toast.success("Care package updated");
      } else {
        await createCarePackage(payload);

        toast.success("Care package created");
      }

      onOpenChange(false);
      methods.reset();
    } catch (err) {
      handleFormApiError<CarePackageFormData>(
        err,
        methods.setError,
        isEdit
          ? "Failed to update care package"
          : "Failed to create care package",
      );
    }
  };

  const onFormSubmit: React.FormEventHandler = (e) => {
    return methods.handleSubmit(onValidSubmit)(e);
  };
  //   const onFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
  //     e.preventDefault();

  //     methods.handleSubmit(
  //       (values) => {
  //         console.log("VALID:", values);
  //         onValidSubmit(values);
  //       },
  //       (errors) => {
  //         console.log("INVALID:", errors);
  //       },
  //     )(e);
  //   };

  const isLoadingEditData = isEdit && isPackageDataLoading;

  return (
    <SheetForm
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Care Package" : "Add New Care Package"}
      description={
        isEdit
          ? "Edit the details of the existing care package."
          : "Add a new care package to the system."
      }
      headerClassName="bg-[#E4E7EC] py-2.5"
      onSubmit={onFormSubmit}
      submitLabel={
        isSubmitting ? (
          <Spinner />
        ) : isEdit ? (
          "Save Changes"
        ) : (
          "Create New Care Package"
        )
      }
      submitDisabled={isSubmitting || isLoadingEditData}
    >
      <FormProvider {...methods}>
        <div className="space-y-4">
          {isLoadingEditData ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3">
              <Spinner />
              <p className="text-sm text-muted-foreground">
                Loading care package...
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <TextField
                  label="Package Name *"
                  type="text"
                  {...register("name")}
                  error={errors.name?.message}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-normal">Description *</Label>

                <TextareaField
                  placeholder="Enter description"
                  maxLength={500}
                  autoResize
                  {...register("description")}
                  error={errors.description?.message}
                />
              </div>
            </>
          )}
        </div>
      </FormProvider>
    </SheetForm>
  );
};

export default AddCarePackage;
