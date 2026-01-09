import React, { useMemo, useState, useEffect } from "react";
import { FormProvider, useForm, FieldPath, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SheetForm } from "@/components/shared/sheet-form";
import { Button } from "@/components/ui/button";
import PersonalDetails from "./personal-details";
import { clientSchema, type ClientFormData } from "../schemas/add-client";
import ContactDetails from "./contact-details";
import Addresses from "./addresses";
import WellbeingOverview from "./wellbeing-overview";
import { StepperHeader } from "../components/stepper-header";
import { useCreateClient } from "@/hooks/client/useClients";
import toast from "react-hot-toast";
import { Spinner } from "@/components/shared/spinner";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const resolver = zodResolver(
  clientSchema
) as unknown as Resolver<ClientFormData>;

const AddClient = ({ open, setOpen }: Props) => {
  const methods = useForm<ClientFormData>({
    resolver,
    defaultValues: {
      firstname: "",
      lastname: "",
      middlename: "",
      preferredname: "",
      title: "",
      status: "active",
      dob: "",
      latitude: 51.5074,
      longitude: -0.1278,
      secureCheckInZone: 200,
      phone: "",
      phoneType: "",
      email: "",
      riskLevel: "",
      wellbeingDetails: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  const steps = useMemo(
    () => [
      { id: 1, label: "Personal Details" },
      { id: 2, label: "Contact Details" },
      { id: 3, label: "Addresses" },
      { id: 4, label: "Wellbeing Overview" },
    ],
    []
  );
  const firstStep = steps[0].id;
  const lastStep = steps[steps.length - 1].id;

  // fields to validate per step
  const stepFields: Record<number, readonly FieldPath<ClientFormData>[]> = {
    1: ["title", "firstname", "lastname", "dob", "status"],
    2: ["nationality", "phone", "phoneType", "email"],
    3: ["addressLine1", "city", "state", "zip"],
    4: ["wellbeingDetails", "riskLevel"],
  } as const;

  const [currentStep, setCurrentStep] = useState<number>(firstStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isStepValidating, setIsStepValidating] = useState(false);
  const [attemptedNext, setAttemptedNext] = useState(false); // gate error display

  // auto-clear stale errors for fields in the current step as the user types
  const watchValues = methods.watch(stepFields[currentStep]);
  useEffect(() => {
    const fields = stepFields[currentStep];
    if (fields.length) {
      void methods.trigger([...fields]); // re-run validation on change
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchValues), currentStep]);

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
  const { mutateAsync: createClient, isPending: isSubmitting } =
    useCreateClient();

  const onValidSubmit = async (vals: ClientFormData) => {
    // If your API needs a different shape, map here:
    // const payload = { ...vals, first_name: vals.firstname, last_name: vals.lastname };
    const payload = {
      ...vals,
      latitude: vals.latitude?.toString() ?? "",
      longitude: vals.longitude?.toString() ?? "",
    };

    try {
      await createClient(payload);
      toast?.success?.("Client created");
      methods.reset();
      setCurrentStep(firstStep);
      setAttemptedNext(false);
      setOpen(false);
    } catch (err: any) {
      // Optional: surface server validation errors back into the form
      // Example expects { errors: [{ field: "email", message: "Already taken" }, ...] }
      const serverErrors = err?.response?.data?.errors as
        | { field: keyof ClientFormData; message: string }[]
        | undefined;

      if (serverErrors?.length) {
        serverErrors.forEach(({ field, message }) => {
          methods.setError(field, { type: "server", message });
        });
      } else {
        toast.error("Failed to create client");
        // toast?.error?.("Failed to create client");
        console.error(err);
      }
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
      title="Add New Client"
      description="Capture basic details to create a client profile"
      headerClassName="bg-[#E4E7EC] py-2.5"
      onSubmit={onFormSubmit}
      submitLabel={
        currentStep < lastStep ? (
          "Next"
        ) : isSubmitting ? (
          <Spinner size="sm" />
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
      {/* <Stepper
        steps={steps}
        current={currentStep}
        completed={completedSteps}
        onStepClick={handleStepClick}
      /> */}
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
