import React, { useMemo, useState } from "react";
import { FormProvider, useForm, FieldPath } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { SheetForm } from "@/components/shared/sheet-form";
import { Button } from "@/components/ui/button";
import PersonalDetails from "./personal-details";
import { clientSchema, type ClientFormData } from "../schemas/add-client";
import ContactDetails from "./contact-details";
import Addresses from "./addresses";
import WellbeingOverview from "./wellbeing-overview";
import { StepperHeader } from "../components/stepper-header";
import {
  useClient,
  useCreateClient,
  useUpdateClient,
} from "@/hooks/client/useClients";
import toast from "react-hot-toast";
import { Spinner } from "@/components/shared/spinner";
import { handleFormApiError } from "@/lib/handle-form-error";
import { Client } from "@/types/client/client";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clientId?: string;
  startStep: number; // 👈 new
}
// const resolver = zodResolver(
//   clientSchema,
// ) as unknown as Resolver<ClientFormData>;

const AddClient = ({ open, setOpen, clientId, startStep }: Props) => {
  const isEdit = Boolean(clientId);
  const { data: client } = useClient(clientId, isEdit);
  function mapClientToForm(data: Client): ClientFormData {
    return {
      firstname: data.firstname ?? "",
      lastname: data.lastname ?? "",
      middlename: data.middlename ?? "",
      email: data.email ?? "",
      preferredname: data.preferredname ?? "",
      title: data.title ?? "",
      pronouns: data.pronouns ?? "",
      gender: data.gender ?? "",
      dob: data.dob?.slice(0, 10) ?? "",
      phone: data.phone ?? "",
      phoneType: data.phoneType ?? "",
      status: data.status ?? "active",
      wellbeingDetails: data.wellbeingDetails ?? "",
      secondaryPhone: data.secondaryPhone ?? "",
      secondaryPhoneType: data.secondaryPhoneType ?? "",
      addressLine1: data.addressLine1 ?? "",
      addressLine2: data.addressLine2 ?? "",
      city: data.city ?? "",
      riskLevel: data.riskLevel ?? "",
      zip: data.zip ?? "",
      accessDetails: data.accessDetails ?? "",
      country: data.country ?? "",
      nationality: data.nationality ?? "",
      secureCheckInZone: data.secureCheckInZone ?? 0,
      state: data.state ?? "",
      latitude: Number(data.latitude) ?? 0,
      longitude: Number(data.longitude) ?? 0,
      county: data.county ?? "",
    };
  }

  const methods = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),

    defaultValues: {
      clientPicture: undefined,

      firstname: "",
      lastname: "",
      middlename: "",
      preferredname: "",
      title: "",
      pronouns: "",
      gender: "",

      dob: "",

      nationality: "",

      phone: "",
      phoneType: "",
      secondaryPhone: "",
      secondaryPhoneType: "",
      email: "",

      addressLine1: "",
      addressLine2: "",
      city: "",
      county: "",
      state: "",
      zip: "",
      country: "",
      accessDetails: "",

      latitude: 51.5074,
      longitude: -0.1278,
      secureCheckInZone: 200,

      wellbeingDetails: "",
      riskLevel: "",

      status: "active",

      // metadata: {},
    },

    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });
  React.useEffect(() => {
    if (client && isEdit) {
      methods.reset(mapClientToForm(client));
    }
  }, [client, isEdit]);
  const steps = useMemo(
    () => [
      { id: 1, label: "Personal Details" },
      { id: 2, label: "Contact Details" },
      { id: 3, label: "Addresses" },
      { id: 4, label: "Wellbeing Overview" },
    ],
    [],
  );
  const firstStep = steps[0].id;
  const lastStep = steps[steps.length - 1].id;

  const stepFields: Record<number, readonly FieldPath<ClientFormData>[]> = {
    1: ["title", "firstname", "lastname", "dob", "status"],

    2: ["nationality", "phone", "phoneType", "email"],

    3: ["addressLine1", "city", "state", "zip"],

    4: ["wellbeingDetails", "riskLevel"],
  };

  const [currentStep, setCurrentStep] = useState<number>(firstStep);
  React.useEffect(() => {
    if (open) {
      setCurrentStep(startStep);
    }
  }, [open, startStep]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isStepValidating, setIsStepValidating] = useState(false);
  const [attemptedNext, setAttemptedNext] = useState(false); // gate error display
  const validateCurrentStep = async () => {
    const fields = stepFields[currentStep] ?? [];
    const ok = await methods.trigger([...fields], { shouldFocus: true });
    if (ok && !completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    return ok;
  };

  const handleNext = async () => {
    setAttemptedNext(true);
    setIsStepValidating(true);
    const ok = await validateCurrentStep();
    setIsStepValidating(false);
    if (ok && currentStep < lastStep) {
      setCurrentStep((s) => s + 1);
      setAttemptedNext(false); // reset for next page
    }
  };

  const handlePrevious = () => {
    if (currentStep > firstStep) {
      setCurrentStep((s) => s - 1);
      setAttemptedNext(false);
    }
  };

  const handleStepClick = async (stepNumber: number) => {
    if (stepNumber === currentStep) return;
    if (stepNumber < currentStep || completedSteps.includes(stepNumber)) {
      setCurrentStep(stepNumber);
      setAttemptedNext(false);
    } else {
      setAttemptedNext(true);
      const ok = await validateCurrentStep();
      if (ok) {
        setCurrentStep(stepNumber);
        setAttemptedNext(false);
      }
    }
  };
  const { mutateAsync: createClient, isPending: isCreating } =
    useCreateClient();
  const { mutateAsync: updateClient, isPending: isUpdating } = useUpdateClient(
    clientId!,
  );

  const isSubmitting = isCreating || isUpdating;

  const onValidSubmit = async (vals: ClientFormData) => {
    // If your API needs a different shape, map here:
    // const payload = { ...vals, first_name: vals.firstname, last_name: vals.lastname };
    const payload = {
      ...vals,
      latitude: vals.latitude?.toString() ?? "",
      longitude: vals.longitude?.toString() ?? "",
    };

    try {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value == null) return;

        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      if (isEdit) {
        await updateClient(formData);
        toast.success("Client updated");
      } else {
        await createClient(formData);
        toast?.success?.("Client created");
      }

      setOpen(false);
      methods.reset();
      setCurrentStep(firstStep);
      setAttemptedNext(false);
    } catch (err) {
      handleFormApiError<ClientFormData>(
        err,
        methods.setError,
        isEdit ? "Failed to update client" : "Failed to create client",
      );
    }
  };

  // SheetForm owns the <form>
  const onFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    if (currentStep < lastStep) {
      e.preventDefault();
      void handleNext();
      return;
    }
    return methods.handleSubmit(onValidSubmit)(e);
  };

  return (
    <SheetForm
      open={open}
      hideCancel={currentStep > firstStep}
      onOpenChange={setOpen}
      title={isEdit ? "Edit Client" : "Add New Client"}
      description="Capture basic details to create a client profile"
      headerClassName="bg-[#E4E7EC] py-2.5"
      onSubmit={onFormSubmit}
      submitLabel={
        currentStep < lastStep ? (
          "Next"
        ) : isSubmitting ? (
          <Spinner size="sm" />
        ) : isEdit ? (
          "Save Changes"
        ) : (
          "Create New Client"
        )
      }
      footerExtra={
        currentStep > firstStep ? (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === firstStep || isSubmitting}
          >
            Back
          </Button>
        ) : (
          <></>
        )
      }
      submitDisabled={isStepValidating || isSubmitting}
    >
      <StepperHeader
        steps={steps}
        current={currentStep}
        onStepClick={handleStepClick}
      />

      <FormProvider {...methods}>
        {currentStep === 1 && <PersonalDetails attemptedNext={attemptedNext} />}

        {currentStep === 2 && <ContactDetails attemptedNext={attemptedNext} />}

        {currentStep === 3 && <Addresses />}

        {currentStep === 4 && (
          <WellbeingOverview attemptedNext={attemptedNext} />
        )}
      </FormProvider>
    </SheetForm>
  );
};

export default AddClient;
