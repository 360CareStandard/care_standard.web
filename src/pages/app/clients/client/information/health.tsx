// pages/health/Health.tsx
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
import { HealthIcon } from "../icons/health";
import { HealthSetupAccordion } from "../components/health-accordion";
import medicalFormSchema, { type MedicalForm } from "../../schemas/health";
import {
  useClientHealthDetails,
  useCreateHealthDetails,
  useUpdateHealthDetails,
} from "@/hooks/client/useClientHealthDetailts";
import { Spinner } from "@/components/shared/spinner";
import { ClientHealthDetails } from "@/types/client/health";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUpdatedAt } from "@/helpers/last-updated";
import { HealthInfo } from "../../components/health-info";

const initialFormValues: Partial<MedicalForm> = {
  diagnosedConditions: [],
  clinicalNotes: "",
  knownAllergies: [],
  overallRiskLevel: "medium",
  riskCategories: [],
  riskResponsiblePerson: "",
  mitigationStrategies: "",
  metadata: {},
  status: "active",
};

type Props = {
  clientId: string;
};

const Health = ({ clientId }: Props) => {
  const [open, setOpen] = React.useState(false);
  const createHealthDetails = useCreateHealthDetails(clientId);
  const updateHealthDetails = useUpdateHealthDetails(clientId);
  const [editingHealthId, setEditingHealthId] = React.useState<string | null>(
    null
  );
  const { data: clientHealthDetails, isLoading } = useClientHealthDetails(
    clientId,
    Boolean(clientId)
  );

  const methods = useForm<MedicalForm>({
    resolver: zodResolver(medicalFormSchema) as unknown as Resolver<
      MedicalForm,
      any
    >,
    mode: "onChange",
    defaultValues: initialFormValues as MedicalForm,
  });

  // // optional: live log for debugging during development
  // React.useEffect(() => {
  //   const sub = methods.watch((v) => {
  //     // comment out in production if noisy
  //     console.log("HEALTH FORM (live):", v);
  //   });
  //   return () => sub.unsubscribe();
  // }, [methods]);

  // Map API payload (partial) to form shape expected by the UI
  function mapApiToFormValues(api?: ClientHealthDetails): Partial<MedicalForm> {
    if (!api) return {};
    return {
      diagnosedConditions: Array.isArray(api.diagnosedConditions)
        ? api.diagnosedConditions.map((c: any) => ({
            name: c.name ?? "",
            diagnosisDate: c.diagnosisDate ?? "",
            notes: c.notes ?? "",
          }))
        : [],
      clinicalNotes: api.clinicalNotes ?? "",
      knownAllergies: Array.isArray(api.knownAllergies)
        ? api.knownAllergies.map((a: any) => ({
            type: a.type ?? "",
            allergen: a.allergen ?? "",
            severity: a.severity ?? "Mild",
            notes: a.notes ?? "",
          }))
        : [],
      overallRiskLevel: api.overallRiskLevel ?? "medium",
      riskCategories: Array.isArray(api.riskCategories)
        ? api.riskCategories
        : [],
      riskResponsiblePerson: api.riskResponsiblePerson ?? "",
      mitigationStrategies: api.mitigationStrategies ?? "",
      metadata: api.metadata ?? {},
      status: api.status ?? "active",
    } as Partial<MedicalForm>;
  }

  // open sheet for editing an existing record
  const openForEdit = (apiRecord: ClientHealthDetails) => {
    const mapped = mapApiToFormValues(apiRecord);
    methods.reset(mapped as any);
    setEditingHealthId(apiRecord?.id ?? null);
    setOpen(true);
  };

  const onSubmit = async (values: MedicalForm) => {
    try {
      if (editingHealthId) {
        // call your update hook — adapt shape if your hook expects different args
        await updateHealthDetails.mutateAsync({
          body: values,
        });
        toast.success("Health details updated");
      } else {
        await createHealthDetails.mutateAsync(values);
        toast.success("Health details created");
      }

      // reset UI
      setOpen(false);
      setEditingHealthId(null);
      methods.reset(initialFormValues as any);
    } catch (err: any) {
      console.error("Save failed", err);
      toast.error(err?.message ?? "Save failed, try again");
    }
  };

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <>
      <Card>
        <CardContent
          className={`grid grid-cols-1 ${
            clientHealthDetails ? "gap-8" : "sm:grid-cols-2 gap-16"
          } `}
        >
          {!isLoading && clientHealthDetails ? (
            <div className="flex justify-between items-center gap-4">
              <div className=" space-y-1">
                <h2 className="font-bold text-xl">Health</h2>
                <p className="text-xs text-muted-foreground">
                  {formatUpdatedAt(clientHealthDetails.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  {/* {clientLegalProfile?.status.charAt(0).toUpperCase() +
                                      clientLegalProfile.status.slice(1)} */}
                </span>
                <Button
                  onClick={() => openForEdit(clientHealthDetails)}
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
                  Update Health Info
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-xl">Health</h2>
              <p className="text-sm text-muted-foreground">
                Record health condition and clinical information.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    methods.reset(initialFormValues as any);
                    setEditingHealthId(null);
                    setOpen(true);
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <PlusIcon />
                  Add Health Info
                </Button>
              </div>
            </div>
          )}

          {/* Replace the empty state with existing record view when you wire get-details */}
          {isLoading ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ) : clientHealthDetails ? (
            <HealthInfo data={clientHealthDetails} />
          ) : (
            <EmptyStateCard
              icon={<HealthIcon />}
              title="No health and clinical information recorded "
              description="Record conditions, allergies and risks so carers can provide safe support."
              btnText="Add Health Info"
              button
              onClick={() => {
                methods.reset(initialFormValues as any);
                setEditingHealthId(null);
                setOpen(true);
              }}
            />
          )}
        </CardContent>
      </Card>

      <SheetForm
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setEditingHealthId(null);
            methods.reset(initialFormValues as any);
          }
        }}
        title={
          editingHealthId ? "Edit Health Information" : "Add Health Information"
        }
        description="Record health conditions and clinical information."
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={
          methods.formState.isSubmitting ? (
            <Spinner size="sm" />
          ) : editingHealthId ? (
            "Save Changes"
          ) : (
            "Save Health Info"
          )
        }
        submitDisabled={methods.formState.isSubmitting}
        onSubmit={handleSheetSubmit}
      >
        <FormProvider {...methods}>
          <HealthSetupAccordion />
        </FormProvider>
      </SheetForm>
    </>
  );
};

export default Health;
