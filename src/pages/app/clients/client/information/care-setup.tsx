import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
import { BoxIcon } from "../icons/box";
import { CareSetupAccordion } from "../components/care-accordion";

import { CareSetupSchema, type CareSetupForm } from "../../schemas/care-setup";

const CareSetup = () => {
  const [open, setOpen] = React.useState(false);

  const methods = useForm<CareSetupForm>({
    resolver: zodResolver(CareSetupSchema),
    mode: "onBlur",
    defaultValues: {
      packageType: "Domiciliary",
      startDate: "",
      status: "Active",
      authorisedHours: 0,
      visitDuration: undefined,
      doubleUpRequired: false,
      overnightCare: false,
      overnightStart: "",
      overnightEnd: "",
      overnightStartPeriod: "AM",
      overnightEndPeriod: "AM",
      visitPresets: [],
      continuityPriority: false,
      preferredCarers: [],
      avoidCarers: [],
      requiredSkills: [],
      languageRequirement: "No requirement",
      checkInMethod: undefined as any, // or "GPS" if you want a default
      lateVisitAlertMins: 15,
      escalationContactId: "", // empty string maps to undefined via schema
      loneWorkerAlert: false,
    },
  });

  const onSubmit = (values: CareSetupForm) => {
    console.log("submit:", values);
    setOpen(false);
    methods.reset();
  };

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <>
      <Card>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl">Care Setup</h2>
            <p className="text-sm text-muted-foreground">
              Define package, schedule, and rostering rules for this client
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <PlusIcon />
                Add Care Setup
              </Button>
            </div>
          </div>
          <EmptyStateCard
            icon={<BoxIcon />}
            title="No care setup has been added yet"
            description="Configure how care will be delivered: service package, scheduling preferences, funding authorization, and safety settings."
            btnText="Add Care Setup"
            button
            onClick={() => setOpen(true)}
          />
        </CardContent>
      </Card>

      <SheetForm
        open={open}
        onOpenChange={setOpen}
        title="Add Care Setup"
        description="Configure the care package, scheduling preferences, and safety settings."
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={
          methods.formState.isSubmitting ? "Saving..." : "Save Care Setup"
        }
        submitDisabled={methods.formState.isSubmitting}
        onSubmit={handleSheetSubmit}
        bodyClassName="space-y-6"
      >
        <FormProvider {...methods}>
          <CareSetupAccordion />
        </FormProvider>
      </SheetForm>
    </>
  );
};

export default CareSetup;
