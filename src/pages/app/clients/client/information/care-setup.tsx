import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
import { BoxIcon } from "../icons/box";
import { CareSetupAccordion } from "../components/accordion/care-accordion";
import { CareSetupApiSchema, CareSetupForm } from "../../schemas/care-setup";
import {
  useClientCareSetup,
  useCreateClientCarePlan,
  useUpdateClientCarePlan,
} from "@/hooks/client/useClientCarePlan";
import toast from "react-hot-toast";
import { formatUpdatedAt } from "@/helpers/last-updated";
import { CareSetupDetails } from "./components/details/care-setup-details";
import { ClientClientCarePlan } from "@/types/client/care-setup";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/shared/spinner";
import { Edit } from "iconsax-react";
import { handleFormApiError } from "@/lib/handle-form-error";

// in CareSetup component when creating `useForm`
const initialFormValues: Partial<CareSetupForm> = {
  packageId: "",
  startDate: "",
  status: "active", // now TypeScript sees this as CareSetupForm['status']
  visitDurationPreset: "45",
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
  authorisedHoursPerWeek: 1,
  budgetCap: 1,
  checkInMethod: "gps",
  lateVisitAlertThreshold: 10,
  escalationContactId: undefined,
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
    null,
  );

  const { data: clientSetupDetails, isLoading } = useClientCareSetup(
    clientId,
    Boolean(clientId),
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
    apiData: ClientClientCarePlan,
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
      escalationContactId: plan.escalationContactId ?? undefined,
      loneWorkerAlertEnabled: !!plan.loneWorkerAlertEnabled,
      authorisedHoursPerWeek:
        typeof plan.authorisedHoursPerWeek === "number"
          ? plan.authorisedHoursPerWeek
          : 0,
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
      handleFormApiError<CareSetupForm>(
        err,
        methods.setError,
        editingSetupId
          ? "Failed to update care setup"
          : "Failed to create care setup",
      );
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
                  <Edit size={20} />
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
                  disabled={isLoading}
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
