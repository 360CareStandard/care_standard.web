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
import { HealthSetupAccordion } from "../components/accordion/health-accordion";
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
import { HealthInfo } from "./components/details/health-info";
import { Edit } from "iconsax-react";

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
                <span
                  className={`inline-block px-3 py-1  text-sm  font-medium rounded-full capitalize ${
                    clientHealthDetails.overallRiskLevel === "high"
                      ? "bg-red-100 text-red-800"
                      : clientHealthDetails.overallRiskLevel === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {clientHealthDetails.overallRiskLevel || "-"}
                </span>
                <Button
                  onClick={() => openForEdit(clientHealthDetails)}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit size={20} />
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
                  disabled={isLoading}
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
