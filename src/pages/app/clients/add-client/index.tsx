import React, { useMemo, useState, useEffect } from "react";
import { FormProvider, useForm, FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SheetForm } from "@/components/shared/sheet-form";
import { Button } from "@/components/ui/button";
import PersonalDetails from "./personal-details";
import { clientSchema, type ClientFormData } from "../schemas/add-client";
import { Stepper } from "../components/stepper";
import ContactDetails from "./contact-details";
import Addresses from "./addresses";
import WellbeingOverview from "./wellbeing-overview";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddClient = ({ open, setOpen }: Props) => {
  const methods = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      title: "",
      firstName: "",
      middleName: "",
      lastName: "Wilson",
      preferredName: "FizzySweet",
      pronouns: "She/Her",
      dateOfBirth: "",
      status: "Active",
      primaryPhoneCountry: "GB",
      primaryPhoneType: "Work",
      additionalPhoneCountry: "GB",
      additionalPhoneType: "Home",
      primaryPhoneNumber: "",
      additionalPhoneNumber: "",
      emailAddress: "",
      accessDetails: "",
      lat: 51.5074, // London default is fine
      lng: -0.1278,
      checkinRadiusM: 500,
    },
    // errors appear on Next; but we will also revalidate on change
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
    1: ["title", "firstName", "lastName", "dateOfBirth", "status"],
    2: [
      "primaryPhoneCountry",
      "primaryPhoneNumber",
      "primaryPhoneType",
      "emailAddress",
    ],
    3: ["addressLine1", "city", "state", "postcode"],
    4: ["wellbeing", "riskLevel"],
  } as const;

  const [currentStep, setCurrentStep] = useState<number>(firstStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStepValidating, setIsStepValidating] = useState(false);
  const [attemptedNext, setAttemptedNext] = useState(false); // gate error display

  // helper: show error only when the field was touched/dirty OR user tried Next
  const fieldHasError = (name: FieldPath<ClientFormData>) => {
    const state = methods.getFieldState(name, methods.formState);
    return state.invalid && (state.isTouched || state.isDirty || attemptedNext);
  };

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

  const onValidSubmit = async (vals: ClientFormData) => {
    try {
      setIsSubmitting(true);
      // TODO: call API with vals
      methods.reset();
      setCurrentStep(firstStep);
      setAttemptedNext(false);
      setOpen(false);
    } finally {
      setIsSubmitting(false);
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

  const { register, setValue, watch, formState, control } = methods;
  const errors = formState.errors;

  //   React.useEffect(() => {
  //     const sub = methods.watch((value, info) => {
  //       console.log("WATCH change:", { name: info.name, type: info.type, value });
  //     });
  //     return () => sub.unsubscribe();
  //   }, [methods]);

  // --- render
  return (
    <SheetForm
      open={open}
      hideCancel={currentStep > firstStep}
      onOpenChange={setOpen}
      title="Add New Client"
      description="Capture basic details to create a client profile"
      headerClassName="bg-[#E4E7EC]"
      onSubmit={onFormSubmit}
      submitLabel={
        currentStep < lastStep
          ? "Next"
          : isSubmitting
          ? "Submitting…"
          : "Create New Client"
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
      <Stepper
        steps={steps}
        current={currentStep}
        completed={completedSteps}
        onStepClick={handleStepClick}
      />

      <FormProvider {...methods}>
        {currentStep === 1 && (
          <PersonalDetails
            FieldError={({ message }) =>
              fieldHasError("title") ||
              fieldHasError("firstName") ||
              fieldHasError("lastName") ||
              fieldHasError("dateOfBirth") ||
              fieldHasError("status") ? (
                <p className="mt-1 text-xs text-destructive">{message}</p>
              ) : null
            }
            // pass errors conditionally per field for friendly UX
            errors={
              {
                ...errors,
                title: fieldHasError("title") ? errors.title : undefined,
                firstName: fieldHasError("firstName")
                  ? errors.firstName
                  : undefined,
                lastName: fieldHasError("lastName")
                  ? errors.lastName
                  : undefined,
                dateOfBirth: fieldHasError("dateOfBirth")
                  ? errors.dateOfBirth
                  : undefined,
                status: fieldHasError("status") ? errors.status : undefined,
              } as any
            }
            register={register}
            setValue={setValue}
            watch={watch}
            control={control}
            attemptedNext={attemptedNext}
          />
        )}

        {currentStep === 2 && (
          <ContactDetails
            FieldError={({ message }) =>
              fieldHasError("emailAddress") ? (
                <p className="mt-1 text-xs text-destructive">{message}</p>
              ) : null
            }
            errors={
              {
                ...errors,
                emailAddress: fieldHasError("emailAddress")
                  ? errors.emailAddress
                  : undefined,
                primaryPhoneCountry: fieldHasError("primaryPhoneCountry")
                  ? errors.primaryPhoneCountry
                  : undefined,
                primaryPhoneNumber: fieldHasError("primaryPhoneNumber")
                  ? errors.primaryPhoneNumber
                  : undefined,
                primaryPhoneType: fieldHasError("primaryPhoneType")
                  ? errors.primaryPhoneType
                  : undefined,
              } as any
            }
            setValue={setValue}
            watch={watch}
            control={control}
            register={register}
            attemptedNext={attemptedNext}
          />
        )}

        {currentStep === 3 && (
          <Addresses
            watch={watch}
            register={register}
            errors={errors}
            control={control}
            attemptedNext={attemptedNext}
            setValue={setValue}
          />
        )}

        {currentStep === 4 && (
          <WellbeingOverview
            watch={watch}
            register={register}
            errors={errors}
            control={control}
            attemptedNext={attemptedNext}
            setValue={setValue}
          />
        )}
      </FormProvider>
    </SheetForm>
  );
};

export default AddClient;
