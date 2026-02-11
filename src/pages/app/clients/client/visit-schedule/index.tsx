import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCreateVisitSchedule,
  useUpdateVisitSchedule,
  useVisitScheduleList,
} from "@/hooks/client/useVisitSchedule";
import { PlusIcon } from "lucide-react";
import React from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  VisitScheduleForm,
  VisitScheduleSchema,
} from "../../schemas/visit-schedule";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { CalendarAdd } from "iconsax-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { Spinner } from "@/components/shared/spinner";
import VisitScheduleFormField from "./components/form/visit-schedule-form";
import { handleFormApiError } from "@/lib/handle-form-error";
const initialFormValues: Partial<VisitScheduleForm> = {
  visitFrequency: "daily",
  daysOfWeek: [],
  noEndDate: false,
  requiredSkills: [], // ✅ add this
};
export default function VisitSchedule() {
  const { clientId } = useParams<{ clientId: string }>();
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const createVisitSchedule = useCreateVisitSchedule(clientId as string);
  const updateVisitSchedule = useUpdateVisitSchedule(
    clientId as string,
    editingId ?? "",
  );
  const {
    data: visitScheduleData,
    isLoading,
    refetch,
    isError,
  } = useVisitScheduleList(clientId as string, Boolean(clientId));
  const visitSchedules = visitScheduleData ?? [];

  const methods = useForm<VisitScheduleForm>({
    resolver: zodResolver(VisitScheduleSchema) as unknown as Resolver<
      VisitScheduleForm,
      any
    >,
    mode: "onChange",
    defaultValues: initialFormValues as VisitScheduleForm,
  });

  const openForAdd = () => {
    methods.reset(initialFormValues as any);
    setEditingId(null);
    setOpen(true);
  };

  function toApiPayload(values: VisitScheduleForm) {
    const base = {
      visitFrequency: values.visitFrequency,
      visitStartTime: values.visitStartTime,
      visitEndTime: values.visitEndTime,
      duration: values.duration,
      startDate: values.startDate,
      noEndDate: values.noEndDate,
      carersNeeded: values.carersNeeded,
      preferredCarers: values.preferredCarers ?? [],
      requiredSkills: values.requiredSkills ?? [],
      activitiesRequired: values.activitiesRequired ?? [],
      fundingSource: values.fundingSource,
      notes: values.notes,
      ...(values.noEndDate ? {} : { endDate: values.endDate }),
    };

    if (values.visitFrequency === "daily") {
      // no daysOfWeek, no repeatEveryWeeks
      return base;
    }

    if (values.visitFrequency === "weekly") {
      return {
        ...base,
        daysOfWeek: values.daysOfWeek ?? [],
      };
    }

    // custom
    return {
      ...base,
      daysOfWeek: values.daysOfWeek ?? [],
      repeatEveryWeeks: values.repeatEveryWeeks,
    };
  }
  async function onSubmit(values: VisitScheduleForm) {
    const payload = toApiPayload(values);
    try {
      if (editingId) {
        // call update; adjust payload shape to your hook/api needs
        await updateVisitSchedule.mutateAsync({ body: payload });
        toast.success("Visit schedule details updated");
      } else {
        await createVisitSchedule.mutateAsync(payload);
        toast.success("Visit schedule details saved");
      }

      setOpen(false);
      setEditingId(null);
      methods.reset(initialFormValues as any);
    } catch (err) {
      handleFormApiError<VisitScheduleForm>(
        err,
        methods.setError,
        editingId
          ? "Failed to update visit schedule"
          : "Failed to create visit schedule",
      );
    }
  }

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };
  return (
    <div className="space-y-6 !w-full flex-1 ">
      <div className="w-full">
        <h1 className="text-2xl font-semibold">Visit Schedule</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage care visits and Scheduling
        </p>
      </div>
      {/* w-[1118px] */}
      <Card className="flex-1 mt-12  mx-auto w-full">
        <CardContent className="flex justify-center items-center flex-col py-8 gap-2 w-full">
          <CalendarAdd size={32} />
          <h4 className="font-semibold">No visits scheduled yet</h4>
          <p className="text-muted-foreground text-sm">
            Start by adding a visit to track care schedule and ensure
            continuity.
          </p>
          <div className="mt-1">
            <Button onClick={openForAdd} className="text-xs">
              <PlusIcon />
              Add Visit
            </Button>
          </div>
        </CardContent>
      </Card>

      <SheetForm
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setEditingId(null);
            methods.reset(initialFormValues as any);
          }
        }}
        title={editingId ? "Edit Visit" : "Add New Visit"}
        description={`Schedule visits for this client. Choose frequency and configure details.`}
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={
          methods.formState.isSubmitting ? (
            <Spinner size="sm" />
          ) : editingId ? (
            "Save Changes"
          ) : (
            "Save  Info"
          )
        }
        submitDisabled={methods.formState.isSubmitting}
        onSubmit={handleSheetSubmit}
      >
        <FormProvider {...methods}>
          <VisitScheduleFormField />
        </FormProvider>
      </SheetForm>
    </div>
  );
}
