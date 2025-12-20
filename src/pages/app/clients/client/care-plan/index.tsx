// pages/care-plan/CarePlan.tsx
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NoteAdd } from "iconsax-react";
import { SheetForm } from "@/components/shared/sheet-form";

import assessmentSchema, {
  type AssessmentForm,
} from "../../schemas/care-assesment";
import {
  useCarePlans,
  useCreateCarePlan,
  useUpdateCarePlan,
  useDeleteCarePlan,
} from "@/hooks/client/useCarePlan";
import type { CarePlan } from "@/types/client/care-plan";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CarePlanCard } from "./components/care-plan-card";
import { AssessmentFormFields } from "./forms/care-plan/assessment-fields";
import { Spinner } from "@/components/shared/spinner";
import { CarePlanDetailsSheet } from "./components/care-plan-details-sheet";
import { CarePlanCardSkeleton } from "./components/care-plan-skeleton";

const initialFormValues: Partial<AssessmentForm> = {
  assessmentType: "personal-care",
  needs: "",
  goal: "",
  expectedOutcomes: "",
  outcomeStatus: "not-started",
  reviewDueDate: "",
  responsiblePersonId: "",
  responsiblePersonName: "",
  tasks: [],
  risks: [],
  tags: [],
  notesSummary: "",
  metadata: { source: "web-app" },
  status: "active",
};

export default function CarePlan() {
  const { clientId } = useParams<{ clientId: string }>();

  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<CarePlan | null>(null);

  const { data, isLoading } = useCarePlans(clientId as string);
  const carePlans: CarePlan[] = data ?? [];

  const createCarePlan = useCreateCarePlan(clientId as string);
  const updateCarePlan = useUpdateCarePlan(clientId as string);
  const deleteCarePlan = useDeleteCarePlan(clientId as string);

  const methods = useForm<AssessmentForm>({
    resolver: zodResolver(assessmentSchema) as unknown as Resolver<
      AssessmentForm,
      any
    >,
    mode: "onChange",
    defaultValues: initialFormValues as AssessmentForm,
  });

  const openForAdd = () => {
    methods.reset(initialFormValues as any);
    setEditingId(null);
    setOpen(true);
  };

  const mapApiToFormValues = (plan: CarePlan): AssessmentForm => ({
    assessmentType: plan.assessmentType,
    needs: plan.needs ?? "",
    goal: plan.goal ?? "",
    expectedOutcomes: plan.expectedOutcomes ?? "",
    outcomeStatus: plan.outcomeStatus,
    reviewDueDate: plan.reviewDueDate ?? "",
    responsiblePersonId: plan.responsiblePersonId ?? "",
    responsiblePersonName: plan.responsiblePersonName ?? "",
    tasks: plan.tasks ?? [],
    risks: plan.risks ?? [],
    tags: plan.tags ?? [],
    notesSummary: plan.notesSummary ?? "",
    metadata: plan.metadata ?? { source: "web-app" },
    status: plan.status,
  });

  const openForEdit = (plan: CarePlan) => {
    const mapped = mapApiToFormValues(plan);
    methods.reset(mapped as any);
    setEditingId(plan.id);
    setOpen(true);
  };

  const onSubmit = async (values: AssessmentForm) => {
    try {
      const payload = { ...values };

      if (editingId) {
        await updateCarePlan.mutateAsync({
          carePlanId: editingId,
          body: payload,
        });
        toast.success("Assessment updated");
      } else {
        await createCarePlan.mutateAsync(payload);
        toast.success("Assessment created");
      }

      setOpen(false);
      setEditingId(null);
      methods.reset(initialFormValues as any);
    } catch (err: any) {
      console.error(err);
      toast.error("Save failed");
    }
  };
  const handleView = (plan: CarePlan) => {
    setSelectedPlan(plan);
    setDetailOpen(true);
  };
  const handleDelete = async (plan: CarePlan) => {
    try {
      await deleteCarePlan.mutateAsync(plan.id);
      toast.success("Care plan archived");
    } catch (err) {
      console.error(err);
      toast.error("Could not archive care plan");
    }
  };

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };

  const hasPlans = carePlans.length > 0;

  return (
    <div className="space-y-6 w-full flex-1 ">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-semibold">Care Plan</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Structured care planning and goals
          </p>
        </div>
        {hasPlans && (
          <Button size="sm" className="gap-2" onClick={openForAdd}>
            <PlusIcon className="w-4 h-4" />
            Add Assessment
          </Button>
        )}
      </div>

      {/* Empty state when no plans */}
      {!hasPlans && !isLoading && (
        <Card className="flex-1 mt-8 mx-auto w-full ">
          <CardContent className="flex flex-col items-center justify-center py-10 gap-3">
            <NoteAdd size={32} />
            <h4 className="font-semibold">
              No care plan has been created yet.
            </h4>
            <p className="text-muted-foreground text-sm text-center max-w-md">
              Care plans capture assessments, goals and tasks that guide
              day-to-day visits.
            </p>
            <Button onClick={openForAdd} className="text-xs mt-1">
              <PlusIcon className="w-4 h-4" />
              Add Assessment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tabs + list when we have plans */}
      <Tabs defaultValue="active" className="mt-12 ">
        {hasPlans && (
          <TabsList className=" justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="active"
              className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Archived
            </TabsTrigger>
          </TabsList>
        )}
        {isLoading && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <CarePlanCardSkeleton key={i} />
            ))}
          </>
        )}
        {hasPlans && (
          <>
            {/* Active */}
            <TabsContent value="active" className="space-y-4 mt-4">
              {carePlans
                .filter((p) => p.status === "active")
                .map((plan) => (
                  <CarePlanCard
                    key={plan.id}
                    plan={plan}
                    onEdit={openForEdit}
                    onArchive={handleDelete}
                    onView={handleView}
                  />
                ))}
            </TabsContent>

            {/* Completed */}
            <TabsContent value="completed" className="space-y-4">
              {carePlans
                .filter((p) => p.status === "inactive")
                .map((plan) => (
                  <CarePlanCard
                    key={plan.id}
                    plan={plan}
                    onEdit={openForEdit}
                    onArchive={handleDelete}
                  />
                ))}
            </TabsContent>

            {/* Archived */}
            <TabsContent value="archived" className="space-y-4">
              {carePlans
                .filter((p) => p.status === "archived")
                .map((plan) => (
                  <CarePlanCard
                    key={plan.id}
                    plan={plan}
                    onEdit={openForEdit}
                    onArchive={handleDelete}
                  />
                ))}
            </TabsContent>
          </>
        )}
      </Tabs>

      <CarePlanDetailsSheet
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setSelectedPlan(null);
        }}
        plan={selectedPlan}
        onEdit={(p) => {
          // reuse your existing edit logic
          openForEdit(p);
          setDetailOpen(false);
        }}
        onArchive={handleDelete}
      />

      {/* Sheet for Add / Edit */}
      <SheetForm
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setEditingId(null);
            methods.reset(initialFormValues as any);
          }
        }}
        title={editingId ? "Edit Assessment" : "Add Assessment"}
        description="Capture outcomes, tasks and risks related to the client’s needs."
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={
          methods.formState.isSubmitting ? (
            <Spinner size="sm" />
          ) : editingId ? (
            "Save Changes"
          ) : (
            "Save Visit"
          )
        }
        submitDisabled={methods.formState.isSubmitting}
        onSubmit={handleSheetSubmit}
      >
        <FormProvider {...methods}>
          <AssessmentFormFields />
        </FormProvider>
      </SheetForm>
    </div>
  );
}
