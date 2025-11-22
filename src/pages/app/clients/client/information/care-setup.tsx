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
import { CareSetupApiSchema, CareSetupForm } from "../../schemas/care-setup";
import {
  useClientCareSetup,
  useCreateClientCarePlan,
  useUpdateClientCarePlan,
} from "@/hooks/client/useClientCarePlan";
import toast from "react-hot-toast";
import { formatUpdatedAt } from "@/helpers/last-updated";
import { CareSetupDetails } from "../../components/care-setup-details";
import { ClientClientCarePlan } from "@/types/client/care-plan";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/shared/spinner";

// in CareSetup component when creating `useForm`
const initialFormValues: Partial<CareSetupForm> = {
  packageId: undefined,
  startDate: "",
  status: "active", // now TypeScript sees this as CareSetupForm['status']
  visitDurationPreset: undefined,
  doubleUpVisitRequired: false,
  overnightCareRequired: false,
  overnightCareType: "sleep-in",
  overnightCareStartTime: "",
  overnightCareEndTime: "",
  visitPeriodPreset: "Custom",
  continuityPriority: false,
  preferredCarers: [],
  avoidedCarers: [],
  requiredSkills: [],
  languageRequirements: ["English"],
  fundingSource: "private",
  funder: "",
  authorizationNumber: "",
  budgetCap: 0,
  checkInMethod: "gps",
  lateVisitAlertThreshold: 10,
  escalationContact: undefined,
  loneWorkerAlertEnabled: false,
};
type Props = {
  clientId: string;
};
const CareSetup = ({ clientId }: Props) => {
  const [open, setOpen] = React.useState(false);

  const createCareSetup = useCreateClientCarePlan(clientId);
  const updateCareSetup = useUpdateClientCarePlan(clientId);
  const [editingSetupId, setEditingSetupId] = React.useState<string | null>(
    null
  );

  const { data: clientSetupDetails, isLoading } = useClientCareSetup(
    clientId,
    Boolean(clientId)
  );
  // console.log(clientSetupDetails);

  const methods = useForm<CareSetupForm>({
    resolver: zodResolver(CareSetupApiSchema),
    mode: "onChange",
    defaultValues: initialFormValues as any,
  });
  // agencyId: undefined, // undefined is allowed for input
  // 👇 Watch all values
  // const formValues = useWatch({ control: methods.control });
  const openForAdd = () => {
    methods.reset(initialFormValues as any);
    setEditingSetupId(null);
    setOpen(true);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // inside CareSetup component (above return or near top)
  function mapApiToFormValues(
    apiData: ClientClientCarePlan
  ): Partial<CareSetupForm> {
    // Defensive mapping — pick the fields your form expects and normalize types
    const plan = apiData ?? {};
    return {
      packageId: plan.packageId ?? undefined,
      startDate: plan.startDate ? formatDate(plan.startDate) : "",
      status: plan.status ?? "active",
      visitDurationPreset: plan.visitDurationPreset ?? undefined,
      doubleUpVisitRequired: !!plan.doubleUpVisitRequired,
      overnightCareRequired: !!plan.overnightCareRequired,
      overnightCareType: plan.overnightCareType ?? "sleep-in",
      overnightCareStartTime: plan.overnightCareStartTime ?? "",
      overnightCareEndTime: plan.overnightCareEndTime ?? "",
      visitPeriodPreset: plan.visitPeriodPreset ?? "Custom",
      continuityPriority: !!plan.continuityPriority,
      preferredCarers: Array.isArray(plan.preferredCarers)
        ? plan.preferredCarers
        : [],
      avoidedCarers: Array.isArray(plan.avoidedCarers)
        ? plan.avoidedCarers
        : [],
      requiredSkills: Array.isArray(plan.requiredSkills)
        ? plan.requiredSkills
        : [],
      languageRequirements: Array.isArray(plan.languageRequirements)
        ? plan.languageRequirements
        : ["English"],
      fundingSource: plan.fundingSource ?? "private",
      funder: plan.funder ?? "",
      authorizationNumber: plan.authorizationNumber ?? "",
      budgetCap: typeof plan.budgetCap === "number" ? plan.budgetCap : 0,
      checkInMethod: (plan.checkInMethod as any) ?? "gps",
      lateVisitAlertThreshold:
        typeof plan.lateVisitAlertThreshold === "number"
          ? plan.lateVisitAlertThreshold
          : plan.lateVisitAlertThreshold === null ||
            plan.lateVisitAlertThreshold === undefined
          ? undefined
          : Number(plan.lateVisitAlertThreshold) || undefined,
      escalationContact: plan.escalationContact ?? undefined,
      loneWorkerAlertEnabled: !!plan.loneWorkerAlertEnabled,
      // add other fields if needed
    } as Partial<CareSetupForm>;
  }

  // 👇 Log whenever form values change
  // React.useEffect(() => {
  //   console.log("Form values changed:", formValues);
  // }, [formValues]);

  const onSubmit = async (values: CareSetupForm) => {
    try {
      if (editingSetupId) {
        await updateCareSetup.mutateAsync({
          body: values,
        });
        toast.success("Care Setup updated");
      } else {
        await createCareSetup.mutateAsync(values);
        toast.success("Care Setup created");
      }
      setOpen(false);
      // methods.reset(initialFormValues as any);
      setEditingSetupId(null);
    } catch (err) {
      console.error(err);
      toast.error("Save failed, try again");
    }
    // console.log("submit:", values);
    // setOpen(false);
    // methods.reset();
  };

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    void methods.handleSubmit(onSubmit)();
    // console.log(1);
  };

  return (
    <>
      <Card>
        <CardContent
          className={`grid grid-cols-1 ${
            clientSetupDetails ? "gap-8" : "sm:grid-cols-2 gap-16"
          } `}
        >
          {!isLoading && clientSetupDetails ? (
            <div className="flex justify-between items-center gap-4">
              <div className=" space-y-1">
                <h2 className="font-bold text-xl">Care Setup</h2>
                <p className="text-xs text-muted-foreground">
                  {formatUpdatedAt(clientSetupDetails.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  {clientSetupDetails?.status.charAt(0).toUpperCase() +
                    clientSetupDetails.status.slice(1)}
                </span>
                <Button
                  onClick={() => {
                    // populate form with API values and open sheet in edit mode
                    const mapped = mapApiToFormValues(clientSetupDetails);
                    methods.reset(mapped as any);
                    setEditingSetupId(clientSetupDetails.id);
                    setOpen(true);
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.16699 1.66602H7.50033C3.33366 1.66602 1.66699 3.33268 1.66699 7.49935V12.4993C1.66699 16.666 3.33366 18.3327 7.50033 18.3327H12.5003C16.667 18.3327 18.3337 16.666 18.3337 12.4993V10.8327"
                      stroke="#61779C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.3666 2.51639L6.7999 9.08306C6.5499 9.33306 6.2999 9.82472 6.2499 10.1831L5.89157 12.6914C5.75823 13.5997 6.3999 14.2331 7.30823 14.1081L9.81657 13.7497C10.1666 13.6997 10.6582 13.4497 10.9166 13.1997L17.4832 6.63306C18.6166 5.49972 19.1499 4.18306 17.4832 2.51639C15.8166 0.849722 14.4999 1.38306 13.3666 2.51639Z"
                      stroke="#61779C"
                      strokeWidth="1.5"
                      strokeMiterlimit={10}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.4248 3.45898C12.9831 5.45065 14.5415 7.00898 16.5415 7.57565"
                      stroke="#61779C"
                      strokeWidth="1.5"
                      strokeMiterlimit={10}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Update Setup
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-xl">Care Setup</h2>
              <p className="text-sm text-muted-foreground">
                Define package, schedule, and rostering rules for this client
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={openForAdd}
                  variant="outline"
                  className="gap-2"
                >
                  <PlusIcon />
                  Add Care Setup
                </Button>
              </div>
            </div>
          )}
          {isLoading ? (
            // <div className="col-span-2 sm:col-span-2">
            //   <CareSetupSkeleton />
            // </div>
            <div className="space-y-4 p-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ) : clientSetupDetails ? (
            <div className="col-span-1 sm:col-span-1">
              <CareSetupDetails data={clientSetupDetails} />
            </div>
          ) : (
            <EmptyStateCard
              icon={<BoxIcon />}
              title="No care setup has been added yet"
              description="Configure how care will be delivered: service package, scheduling preferences, funding authorization, and safety settings."
              btnText="Add Care Setup"
              button
              onClick={openForAdd}
            />
          )}
        </CardContent>
      </Card>

      <SheetForm
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setEditingSetupId(null);
            methods.reset(initialFormValues as any);
          }
        }}
        title={editingSetupId ? "Edit Care Setup" : "Add Care Setup"}
        description="Configure the care package, scheduling preferences, and safety settings."
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={
          methods.formState.isSubmitting ? (
            <Spinner size="sm" />
          ) : editingSetupId ? (
            "Save Changes"
          ) : (
            "Save Care Setup"
          )
        }
        submitLoading={methods.formState.isSubmitting}
        submitDisabled={methods.formState.isSubmitting}
        onSubmit={handleSheetSubmit}
        bodyClassName="space-y-4"
      >
        <FormProvider {...methods}>
          <CareSetupAccordion clientId={clientId} />
        </FormProvider>
      </SheetForm>
    </>
  );
};

export default CareSetup;
