import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { useState } from "react";


import {
  useDeleteVisitSchedule,
  useSingleVisitSchedule,
  useUpdateVisitSchedule,
} from "@/hooks/client/useVisitSchedule";
import { VisitScheduleType } from "@/types/client/visit-schedule";
import { SheetForm } from "@/components/shared/sheet-form";
import {
  VisitScheduleForm,
  VisitScheduleSchema,
} from "@/pages/app/clients/schemas/visit-schedule";
import { Spinner } from "@/components/shared/spinner";
import { toast } from "react-hot-toast";
import { handleFormApiError } from "@/lib/handle-form-error";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Clock } from "iconsax-react";
import SinglePageLoader from "@/components/loading/single-page-loader";
import { ScheduleDetailsSheet } from "@/pages/app/clients/client/visit-schedule/components/calendar/sheet/schedule-details-sheet";
import VisitScheduleFormField from "@/pages/app/clients/client/visit-schedule/components/form/visit-schedule-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  scheduleId: string | null;
};

const toHHmm = (time?: string) => {
  if (!time) return time;
  // "HH:mm:ss" -> "HH:mm"
  if (time.length >= 5) return time.slice(0, 5);
  return time;
};
const defaultValues: VisitScheduleForm = {
  visitFrequency: "daily",
  daysOfWeek: [],
  repeatEveryWeeks: undefined,
  visitStartTime: "",
  visitEndTime: "",
  duration: 0,
  startDate: "",
  endDate: undefined,
  noEndDate: false,
  carersNeeded: 1,
  preferredCarers: [],
  requiredSkills: [],
  activitiesRequired: [],
  fundingSource: "",
};

export default function CalendarManageEventDialog({
  open,
  onOpenChange,
  clientId,
  scheduleId,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  const effectiveScheduleId = editingScheduleId || scheduleId;

  const deleteVisitSchedule = useDeleteVisitSchedule(clientId);
  const updateVisitSchedule = useUpdateVisitSchedule(clientId, effectiveScheduleId ?? "");

  const enabled = open && !!scheduleId;
  const { data: visitScheduleDetails, isLoading: isLoadingDetails } =
    useSingleVisitSchedule(clientId, scheduleId ?? "", enabled);
  const methods = useForm<VisitScheduleForm>({
    resolver: zodResolver(VisitScheduleSchema) as unknown as Resolver<VisitScheduleForm, any>,
    mode: "onChange",
    defaultValues,
  });
  const resetAndValidate = async (values: VisitScheduleForm) => {
    methods.reset(values, {
      keepDirty: false,
      keepTouched: false,
      keepErrors: false,
    });
    await methods.trigger();
  };

  // const {
  //   formState: { errors }
  // } = useForm({
  //   // ... your configuration
  // });


  // useEffect(() => {
  //   const subscription = methods.watch((value) => {
  //     console.log("Form values changed:", value);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [methods]);

  // useEffect(() => {
  //   console.log("Form errors:", errors);
  // }, [errors]);
  // useEffect(() => {
  //   if (!editOpen) return;
  //   console.log("EDIT values:", methods.getValues());
  //   console.log("EDIT errors:", methods.formState.errors);
  //   console.log("EDIT isValid:", methods.formState.isValid);
  // }, [editOpen]);


  const mapApiToFormValues = (visit: VisitScheduleType): VisitScheduleForm => ({
    visitFrequency: visit.visitFrequency,
    daysOfWeek: visit.daysOfWeek ?? [],
    repeatEveryWeeks: visit.repeatEveryWeeks ?? undefined,
    visitStartTime: toHHmm(visit.visitStartTime) ?? "",
    visitEndTime: toHHmm(visit.visitEndTime) ?? "",
    duration: Number(visit.duration ?? 0),
    startDate: visit.startDate ?? "",
    endDate: visit.endDate ?? undefined,
    noEndDate: Boolean(visit.noEndDate),
    carersNeeded: Number(visit.carersNeeded ?? 1),
    preferredCarers: visit.preferredCarers ?? [],
    requiredSkills: visit.requiredSkills ?? [],
    activitiesRequired: visit.activitiesRequired ?? [],
    fundingSource: visit.fundingSource ?? "",
  });


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
  const onSubmit = async (values: VisitScheduleForm) => {
    try {
      const payload = toApiPayload({
        ...values,
        visitStartTime: toHHmm(values.visitStartTime) as string,
        visitEndTime: toHHmm(values.visitEndTime) as string,
      });

      await updateVisitSchedule.mutateAsync({ body: payload });
      toast.success("Visit schedule updated");
      setEditOpen(false);
      setEditingScheduleId(null);
    } catch (err) {
      handleFormApiError<VisitScheduleForm>(
        err,
        methods.setError,
        "Failed to update visit schedule",
      );
    }
  };
  const performDelete = async () => {
    if (!scheduleId) return;

    try {
      await deleteVisitSchedule.mutateAsync(scheduleId);
      toast.success("Visit schedule deleted");
      setConfirmOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete visit schedule");
    } finally {
      setConfirmOpen(false);
    }
  };

  const openForEdit = async (visit: VisitScheduleType) => {
    setEditingScheduleId(visit.id);
    await resetAndValidate(mapApiToFormValues(visit));
    setEditOpen(true);
  };




  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };

  if (isLoadingDetails) {
    return <SinglePageLoader text="schedule details" />;
  }

  return (
    <>
      <ScheduleDetailsSheet
        open={open}
        onOpenChange={(v) => onOpenChange(v)}
        schedule={visitScheduleDetails}
        onEdit={(p) => {
          onOpenChange(false);
          setTimeout(() => void openForEdit(p), 0);
        }}
        onArchive={() => {
          onOpenChange(false);
          setConfirmOpen(true);
        }}
      />


      <SheetForm
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v);
          if (!v) {
            setEditingScheduleId(null);
          }
        }}
        title={"Edit Visit"}
        description={`Schedule visits for this client. Choose frequency and configure details.`}
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={
          methods.formState.isSubmitting ? (
            <Spinner size="sm" />
          ) : (
            "Save Changes"
          )
        }
        submitDisabled={methods.formState.isSubmitting}
        onSubmit={handleSheetSubmit}
      >
        <FormProvider {...methods}>
          <VisitScheduleFormField />
        </FormProvider>
      </SheetForm>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        handleConfirm={performDelete}
        disabled={deleteVisitSchedule.isPending}
        isLoading={deleteVisitSchedule.isPending}
        className="!bg-[#F9FAFB] "
        title={
          <div>
            <span className="text-sm">Delete visit schedule?</span>
          </div>
        }
        desc={
          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-4 space-y-3">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Clock strokeWidth={4} />
                  <span>
                    This will delete the visit schedule and all associated
                    visits.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        }
        cancelBtnText="Keep visit schedule"
        confirmText="Delete"
        destructive
      />
    </>
  );
}
