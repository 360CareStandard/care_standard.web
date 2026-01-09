import { SheetForm } from "@/components/shared/sheet-form";
import React, { useEffect, useMemo, useState } from "react";
import { StaffFormData, staffSchema } from "../../../schemas/add-staff";
import { FieldPath, FormProvider, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateStaff } from "@/hooks/staff/useStaff";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { StepperHeader } from "@/pages/app/clients/components/stepper-header";
import PersonalDetails from "./personal-details";
import ContactDetails from "./contact-details";
import RoleAndStatus from "./role&status";
import Highlights from "./higlights";
import { Spinner } from "@/components/shared/spinner";
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const resolver = zodResolver(staffSchema) as unknown as Resolver<StaffFormData>;

const AddStaff = ({ open, setOpen }: Props) => {
  const methods = useForm<StaffFormData>({
    resolver,
    defaultValues: {
      firstname: "",
      lastname: "",
      preferredName: "",
      tittle: "",
      pronouns: "",
      gender: "",
      dob: "",
      primaryPhoneNumber: "work",
      primaryPhoneNumberType: "",
      email: "",
      staffRole: "Carer",
      status: "active",
      adminAccessLevel: false,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });
  const steps = useMemo(
    () => [
      { id: 1, label: "Personal Details" },
      { id: 2, label: "Contact Details" },
      { id: 3, label: "Role & Status" },
      { id: 4, label: "Highlights" },
    ],
    []
  );
  const firstStep = steps[0].id;
  const lastStep = steps[steps.length - 1].id;

  // fields to validate per step
  const stepFields: Record<number, readonly FieldPath<StaffFormData>[]> = {
    1: [
      "tittle",
      "firstname",
      "lastname",
      "dob",
      "gender",
      "pronouns",
      "preferredName",
    ],
    2: ["primaryPhoneNumber", "primaryPhoneNumberType", "email"],
    3: ["staffRole", "status", "adminAccessLevel"],
    4: ["highlights"],
  } as const;

  const [currentStep, setCurrentStep] = useState<number>(firstStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isStepValidating, setIsStepValidating] = useState(false);
  const [attemptedNext, setAttemptedNext] = useState(false); // gate error display
  const { formState } = methods;
  const errors = formState.errors;
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
  const { mutateAsync: createStaff, isPending: isSubmitting } =
    useCreateStaff();

  const onValidSubmit = async (vals: StaffFormData) => {
    // const imageSrc = useWatch();
    //  const src = watch("staffPicture");

    try {
      const formData = new FormData();

      Object.entries(vals).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (value instanceof File) {
          formData.append(key, value); // <-- real binary
        } else {
          formData.append(key, String(value)); // <-- strings
        }
      });

      await createStaff(formData);

      toast.success("Staff created");
      methods.reset();
      setCurrentStep(firstStep);
      setAttemptedNext(false);
      setOpen(false);
    } catch (err: any) {
      const serverErrors = err?.response?.data?.errors as
        | { field: keyof StaffFormData; message: string }[]
        | undefined;

      if (serverErrors?.length) {
        serverErrors.forEach(({ field, message }) => {
          methods.setError(field, { type: "server", message });
        });
      } else {
        toast.error("Failed to create staff");
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
    <>
      <SheetForm
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          //   if (!v) {
          //     setEditingId(null);
          //     methods.reset(initialPreferencesValues as any);
          //   }
        }}
        title="Add New Staff"
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={
          currentStep < lastStep ? (
            "Next"
          ) : isSubmitting ? (
            <Spinner size="sm" />
          ) : (
            "Create New Staff"
          )
        }
        onSubmit={onFormSubmit}
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
          {currentStep === 1 && (
            <PersonalDetails attemptedNext={attemptedNext} />
          )}
          {currentStep === 2 && (
            <ContactDetails attemptedNext={attemptedNext} errors={errors} />
          )}
          {currentStep === 3 && <RoleAndStatus attemptedNext={attemptedNext} />}
          {currentStep === 4 && <Highlights />}
        </FormProvider>
      </SheetForm>
    </>
  );
};

export default AddStaff;
