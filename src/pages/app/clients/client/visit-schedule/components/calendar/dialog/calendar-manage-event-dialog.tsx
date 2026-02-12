import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { useState } from "react";

import { useCalendarContext } from "../calendar-context";

import { useParams } from "react-router-dom";
import {
  useDeleteVisitSchedule,
  useSingleVisitSchedule,
  useUpdateVisitSchedule,
} from "@/hooks/client/useVisitSchedule";
import { ScheduleDetailsSheet } from "../sheet/schedule-details-sheet";
import { VisitScheduleType } from "@/types/client/visit-schedule";
import { SheetForm } from "@/components/shared/sheet-form";
import {
  VisitScheduleForm,
  VisitScheduleSchema,
} from "@/pages/app/clients/schemas/visit-schedule";
import VisitScheduleFormField from "../../form/visit-schedule-form";
import { Spinner } from "@/components/shared/spinner";
import { toast } from "react-hot-toast";
import { handleFormApiError } from "@/lib/handle-form-error";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Clock } from "iconsax-react";

const toHHmm = (time?: string) => {
  if (!time) return time;
  // "HH:mm:ss" -> "HH:mm"
  if (time.length >= 5) return time.slice(0, 5);
  return time;
};

export default function CalendarManageEventDialog() {
  const {
    manageEventDialogOpen,
    setManageEventDialogOpen,
    selectedEvent,
    setSelectedEvent,
  } = useCalendarContext();
  const { clientId } = useParams<{ clientId: string }>();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const deleteVisitSchedule = useDeleteVisitSchedule(clientId as string);
  const updateVisitSchedule = useUpdateVisitSchedule(
    clientId as string,
    selectedEvent?.id ?? "",
  );
  // fetch single contact details only when editing
  const { data: visitScheduleDetails, isLoading: isLoadingDetails } =
    useSingleVisitSchedule(
      clientId as string,
      selectedEvent?.id ?? "",
      Boolean(selectedEvent?.id),
    );
  const methods = useForm<VisitScheduleForm>({
    resolver: zodResolver(VisitScheduleSchema) as unknown as Resolver<
      VisitScheduleForm,
      any
    >,
    mode: "onChange",
  });

  const openDeleteDialog = () => {
    setManageEventDialogOpen(false);
    setConfirmOpen(true);
  };

  const mapApiToFormValues = (visit: VisitScheduleType): VisitScheduleForm => ({
    visitFrequency: visit.visitFrequency,
    daysOfWeek: visit.daysOfWeek ?? [],
    repeatEveryWeeks: visit.repeatEveryWeeks ?? undefined,
    visitStartTime: toHHmm(visit.visitStartTime) as string,
    visitEndTime: toHHmm(visit.visitEndTime) as string,
    duration: visit.duration,
    startDate: visit.startDate,
    endDate: visit.endDate ?? "",
    noEndDate: visit.noEndDate,
    carersNeeded: visit.carersNeeded,
    preferredCarers: visit.preferredCarers ?? [],
    requiredSkills: visit.requiredSkills ?? [],
    activitiesRequired: visit.activitiesRequired ?? [],
    fundingSource: visit.fundingSource ?? "",
    notes: visit.notes ?? "",
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
    } catch (err) {
      handleFormApiError<VisitScheduleForm>(
        err,
        methods.setError,
        "Failed to update visit schedule",
      );
    }
  };
  const performDelete = async () => {
    if (!selectedEvent) return;

    try {
      await deleteVisitSchedule.mutateAsync(selectedEvent.id);
      toast.success("Visit schedule deleted");
      setConfirmOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete visit schedule");
    } finally {
      setConfirmOpen(false);
    }
  };

  const openForEdit = (visit: VisitScheduleType) => {
    const mapped = mapApiToFormValues(visit);
    methods.reset(mapped as any);
    setEditOpen(true);
  };

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <>
      <ScheduleDetailsSheet
        open={manageEventDialogOpen}
        onOpenChange={(open) => {
          setManageEventDialogOpen(open);
          if (!open) setSelectedEvent(null);
        }}
        isLoadingDetails={isLoadingDetails}
        schedule={visitScheduleDetails}
        onEdit={(p) => {
          // reuse your existing edit logic
          openForEdit(p);
          setManageEventDialogOpen(false);
        }}
        onArchive={openDeleteDialog}
      />

      <SheetForm
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v);
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
