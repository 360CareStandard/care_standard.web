import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { SheetForm } from "@/components/shared/sheet-form";
import {
  Add,
  Clock,
  Edit,
  Health,
  InfoCircle,
  People,
  Trash,
} from "iconsax-react";
import { VisitScheduleType } from "@/types/client/visit-schedule";
import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../../../../components/info-row";
import dayjs from "dayjs";
import { VisitNoteField } from "../../form/visit-note";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import {
  VisitScheduleNoteForm,
  VisitScheduleNoteSchema,
} from "@/pages/app/clients/schemas/visit-schedule";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateVisitNote,
  useVisitNote,
} from "@/hooks/client/useVisitSchedule";
import { toast } from "react-hot-toast";
import { handleFormApiError } from "@/lib/handle-form-error";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/shared/spinner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: VisitScheduleType | undefined;
  onEdit?: (schedule: VisitScheduleType) => void;
  onArchive?: (schedule: VisitScheduleType) => void;
};

type CarerCardItem = {
  id: string;
  label: string;
  name: string;
  avatarUrl?: string | null;
};

export function ScheduleDetailsSheet({
  open,
  onOpenChange,
  schedule,
  onEdit,
  onArchive,
}: Props) {
  if (!schedule) return null;

  const startDateTime = dayjs(
    `${schedule.startDate}T${schedule.visitStartTime}`,
  );

  const endDateTime = dayjs(`${schedule.startDate}T${schedule.visitEndTime}`);

  /*
   * ---------------------------------------------------------
   * Helpers
   * ---------------------------------------------------------
   */

  function formatShortName(firstname?: string, lastname?: string) {
    const fi = firstname?.[0] ? `${firstname[0].toUpperCase()}.` : "";

    const ln = lastname ?? "";

    return `${fi} ${ln}`.trim() || "-";
  }

  function getFullName(carer: any) {
    return (
      `${carer?.user?.firstname ?? ""} ${carer?.user?.lastname ?? ""}`.trim() ||
      "-"
    );
  }

  function buildCarerCards(schedule: VisitScheduleType): CarerCardItem[] {
    const seen = new Set<string>();

    const candidates = [
      schedule.assignedStaff ?? null,
      schedule.secondaryStaff ?? null,
      ...(schedule.preferredCarersDetails ?? []),
    ].filter(Boolean);

    const unique = candidates.filter((carer: any) => {
      if (!carer?.id) return false;

      if (seen.has(carer.id)) return false;

      seen.add(carer.id);

      return true;
    });

    return unique.map((carer: any, idx: number) => ({
      id: carer.id,
      label: `Carer ${idx + 1}`,
      name: formatShortName(carer.user?.firstname, carer.user?.lastname),
      avatarUrl: carer.profilePicture ?? null,
    }));
  }

  function findStaffName(staffId?: string | null) {
    if (!staffId) return "-";

    const staff = [
      schedule?.assignedStaff,
      schedule?.secondaryStaff,
      ...(schedule?.preferredCarersDetails ?? []),
    ]
      .filter(Boolean)
      .find((staff: any) => staff?.id === staffId);

    if (!staff) return "-";

    return getFullName(staff);
  }

  const completedActivities = new Set(schedule.activitiesCompleted ?? []);

  /*
   * ---------------------------------------------------------
   * Notes
   * ---------------------------------------------------------
   */

  const methods = useForm<VisitScheduleNoteForm>({
    resolver: zodResolver(VisitScheduleNoteSchema) as unknown as Resolver<
      VisitScheduleNoteForm,
      any
    >,
    mode: "onChange",
    defaultValues: {
      note: "",
    },
  });

  const createVisitNote = useCreateVisitNote(schedule.id);

  const { data: visitNoteData, isLoading: isLoadingVisitNote } = useVisitNote(
    schedule.id,
    open,
  );

  const [showNoteEditor, setShowNoteEditor] = useState(false);

  const hydratedNoteRef = useRef<string | null>(null);

  const extractNote = (payload: any): string => {
    if (!payload) return "";

    if (typeof payload === "string") {
      return payload;
    }

    if (Array.isArray(payload)) {
      const first = payload[0];

      if (typeof first === "string") {
        return first;
      }

      if (first && typeof first.note === "string") {
        return first.note;
      }

      return "";
    }

    if (typeof payload.note === "string") {
      return payload.note;
    }

    if (payload.data) {
      if (typeof payload.data === "string") {
        return payload.data;
      }

      if (typeof payload.data.note === "string") {
        return payload.data.note;
      }

      if (Array.isArray(payload.data) && payload.data.length > 0) {
        const first = payload.data[0];

        if (typeof first === "string") {
          return first;
        }

        if (first && typeof first.note === "string") {
          return first.note;
        }
      }
    }

    return "";
  };

  useEffect(() => {
    hydratedNoteRef.current = null;
    methods.reset({ note: "" });
  }, [schedule.id]);

  useEffect(() => {
    if (!open || hydratedNoteRef.current === schedule.id) {
      return;
    }

    methods.reset({
      note: extractNote(visitNoteData),
    });

    hydratedNoteRef.current = schedule.id;
  }, [open, schedule.id, visitNoteData, methods]);

  useEffect(() => {
    if (!open || isLoadingVisitNote) return;

    setShowNoteEditor(false);
  }, [open, isLoadingVisitNote, schedule.id]);

  const onSubmitNote = async (values: VisitScheduleNoteForm) => {
    try {
      await createVisitNote.mutateAsync(values);

      toast.success("Visit note saved");

      methods.reset();

      setShowNoteEditor(false);
    } catch (err) {
      handleFormApiError<VisitScheduleNoteForm>(
        err,
        methods.setError,
        "Failed to save visit note",
      );
    }
  };

  const handleNoteSubmit = () => {
    void methods.handleSubmit(onSubmitNote)();
  };

  /*
   * ---------------------------------------------------------
   * Derived values
   * ---------------------------------------------------------
   */

  const carers = buildCarerCards(schedule);

  const checkedInByName = findStaffName(schedule.checkedInBy);

  const checkedOutByName = findStaffName(schedule.checkedOutBy);

  // const hasActualAttendance =
  //   Boolean(schedule.actualCheckIn) || Boolean(schedule.actualCheckOut);

  const hasIncident = Boolean(schedule.incidentReported);

  const hasConcern = Boolean(schedule.concernsRaised);

  const hasMedication = Boolean(schedule.medicationAdministered);

  const hasSignature = Boolean(schedule.clientSignature);

  const hasCancellation = Boolean(
    schedule.cancelledAt || schedule.cancelledBy || schedule.cancellationReason,
  );

  const hasMissedVisit = Boolean(schedule.missedReason || schedule.missedNotes);

  /*
   * ---------------------------------------------------------
   * Render
   * ---------------------------------------------------------
   */

  return (
    <SheetForm
      open={open}
      onOpenChange={onOpenChange}
      title="Visit Details"
      description="View client visit details"
      submitLabel=""
      submitDisabled
    >
      <div className="flex-1 overflow-y-auto py-5 space-y-6">
        {/* =====================================================
            STATUS + ACTIONS
        ====================================================== */}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex space-x-2">
            <Button
              type="button"
              className={cn(
                "bg-gray-100 capitalize rounded-full font-semibold text-gray-700 hover:bg-green-100",
                schedule.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : schedule.status === "scheduled" ||
                      schedule.status === "active"
                    ? "bg-blue-100 text-blue-700"
                    : schedule.status === "cancelled" ||
                        schedule.status === "missed"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700",
              )}
              size="sm"
            >
              <Clock strokeWidth={4} />
              {schedule.status}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(schedule)}
            >
              <Edit />
              Update
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onArchive?.(schedule)}
            >
              <Trash />
              Delete
            </Button>
          </div>
        </div>

        {/* =====================================================
            TITLE + META
        ====================================================== */}

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {schedule.startDate
              ? `${dayjs(schedule.startDate).format(
                  "DD MMMM YYYY",
                )} | ${startDateTime.format("h:mm A")} - ${endDateTime.format(
                  "h:mm A",
                )} (${schedule.duration} mins)`
              : "No start date"}
          </p>
        </div>

        {/* =====================================================
            TABS
        ====================================================== */}

        <Tabs defaultValue="overview">
          <div className="overflow-x-auto pb-4">
            <TabsList className="justify-start rounded-none border-b bg-transparent p-0">
              {[
                "overview",
                "activities",
                "attendance",
                "notes & observations",
              ].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  {tab === "overview"
                    ? "Overview"
                    : tab[0].toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* ===================================================
              OVERVIEW
          ==================================================== */}

          <TabsContent value="overview">
            <div className="space-y-4">
              {/* Visit Information */}
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <InfoCircle size={18} color="#025134" />
                    <h3 className="font-medium text-sm">Visit Information</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-x-12">
                    <InfoRow label="Visit Type">
                      <span className="capitalize">
                        {schedule.scheduleType || "-"}
                      </span>
                    </InfoRow>

                    <InfoRow label="Duration">
                      {schedule.duration != null
                        ? `${schedule.duration} mins`
                        : "-"}
                    </InfoRow>

                    <InfoRow label="Repeat Pattern">
                      <span className="capitalize">
                        {schedule.visitFrequency || "-"}
                      </span>
                    </InfoRow>

                    <InfoRow label="Funding">
                      <span className="uppercase">
                        {schedule.fundingSource || "-"}
                      </span>
                    </InfoRow>

                    <InfoRow label="Start Date">
                      {schedule.startDate
                        ? dayjs(schedule.startDate).format("DD MMMM YYYY")
                        : "-"}
                    </InfoRow>

                    <InfoRow label="End Date">
                      {schedule.noEndDate
                        ? "No end date"
                        : schedule.endDate
                          ? dayjs(schedule.endDate).format("DD MMMM YYYY")
                          : "-"}
                    </InfoRow>
                  </div>
                </CardContent>
              </Card>

              {/* Assigned Carers */}
              <Card>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <People size={18} color="#025134" />

                      <h3 className="font-medium text-sm">Assigned Carers</h3>
                    </div>

                    {schedule.carersNeeded != null && (
                      <span className="text-xs text-muted-foreground">
                        {schedule.carersNeeded}{" "}
                        {schedule.carersNeeded === 1 ? "carer" : "carers"}{" "}
                        required
                      </span>
                    )}
                  </div>

                  {carers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No carers assigned
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {carers.map((carer) => (
                        <div key={carer.id} className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {carer.avatarUrl ? (
                              <img
                                src={carer.avatarUrl}
                                alt={carer.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-semibold text-gray-600">
                                {carer.name === "-"
                                  ? "?"
                                  : carer.name
                                      .split(" ")[0]
                                      ?.replace(".", "")
                                      .charAt(0)}
                              </span>
                            )}
                          </div>

                          <div className="leading-tight">
                            <p className="text-sm text-muted-foreground">
                              {carer.label}
                            </p>

                            <p className="text-sm font-medium">{carer.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Required Skills */}
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Health size={18} color="#025134" />

                    <h3 className="font-medium text-sm">Required Skills</h3>
                  </div>

                  {schedule.requiredSkills?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {schedule.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="capitalize bg-gray-200 px-2 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No specific skills required
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===================================================
              ACTIVITIES
          ==================================================== */}

          <TabsContent value="activities">
            <div className="space-y-4">
              <Card>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Health size={18} color="#025134" />

                    <h3 className="font-medium text-sm">Visit Activities</h3>
                  </div>

                  {!schedule.activitiesRequired?.length ? (
                    <p className="text-sm text-muted-foreground">
                      No activities specified
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {schedule.activitiesRequired.map((activity) => {
                        const completed = completedActivities.has(activity);

                        const activityNote =
                          schedule.activitiesNotes?.[activity];

                        return (
                          <div key={activity} className="rounded-lg border p-4">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-sm font-medium">
                                {activity}
                              </span>

                              <span
                                className={cn(
                                  "text-xs font-medium px-2 py-1 rounded-full",
                                  completed
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600",
                                )}
                              >
                                {completed ? "Completed" : "Not completed"}
                              </span>
                            </div>

                            {activityNote && (
                              <p className="mt-2 text-sm text-muted-foreground">
                                {activityNote}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Completed but not originally required */}
              {schedule.activitiesCompleted?.some(
                (activity) => !schedule.activitiesRequired?.includes(activity),
              ) && (
                <Card>
                  <CardContent>
                    <h3 className="font-medium text-sm mb-3">
                      Additional Activities Completed
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {schedule.activitiesCompleted
                        ?.filter(
                          (activity) =>
                            !schedule.activitiesRequired?.includes(activity),
                        )
                        .map((activity) => (
                          <span
                            key={activity}
                            className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm"
                          >
                            {activity}
                          </span>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* ===================================================
              ATTENDANCE
          ==================================================== */}

          <TabsContent value="attendance">
            <div className="space-y-4">
              {/* Attendance */}
              <Card>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <People size={18} color="#025134" />

                    <h3 className="font-medium text-sm">Attendance</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-x-12">
                    <InfoRow label="Scheduled Start">
                      {schedule.visitStartTime
                        ? dayjs(`2000-01-01T${schedule.visitStartTime}`).format(
                            "h:mm A",
                          )
                        : "-"}
                    </InfoRow>

                    <InfoRow label="Scheduled End">
                      {schedule.visitEndTime
                        ? dayjs(`2000-01-01T${schedule.visitEndTime}`).format(
                            "h:mm A",
                          )
                        : "-"}
                    </InfoRow>

                    <InfoRow label="Scheduled Duration">
                      {schedule.duration != null
                        ? `${schedule.duration} mins`
                        : "-"}
                    </InfoRow>

                    <InfoRow label="Actual Duration">
                      {schedule.actualDuration != null
                        ? `${schedule.actualDuration} mins`
                        : "-"}
                    </InfoRow>

                    <InfoRow label="Check-in Time">
                      {schedule.actualCheckIn ? (
                        <time>
                          {dayjs(schedule.actualCheckIn).format(
                            "DD MMM, hh:mm a",
                          )}
                        </time>
                      ) : (
                        "-"
                      )}
                    </InfoRow>

                    <InfoRow label="Check-out Time">
                      {schedule.actualCheckOut ? (
                        <time>
                          {dayjs(schedule.actualCheckOut).format(
                            "DD MMM, hh:mm a",
                          )}
                        </time>
                      ) : (
                        "-"
                      )}
                    </InfoRow>

                    <InfoRow label="Checked in by">{checkedInByName}</InfoRow>

                    <InfoRow label="Checked out by">{checkedOutByName}</InfoRow>
                  </div>
                </CardContent>
              </Card>

              {/* Client Outcome */}
              <Card>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <InfoCircle size={18} color="#025134" />

                    <h3 className="font-medium text-sm">Visit Outcome</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-x-12">
                    <InfoRow label="Client Mood">
                      <span className="capitalize">
                        {schedule.clientMood || "-"}
                      </span>
                    </InfoRow>

                    <InfoRow label="Client Condition">
                      <span className="capitalize">
                        {schedule.clientCondition || "-"}
                      </span>
                    </InfoRow>

                    <InfoRow label="Incident Reported">
                      {hasIncident ? (
                        <span className="text-red-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-green-600 font-medium">No</span>
                      )}
                    </InfoRow>

                    <InfoRow label="Concerns Raised">
                      {hasConcern ? (
                        <span className="text-yellow-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-green-600 font-medium">No</span>
                      )}
                    </InfoRow>
                  </div>

                  {hasIncident && schedule.incidentDetails && (
                    <div className="rounded-lg bg-red-50 border border-red-100 p-3">
                      <p className="text-xs font-medium text-red-700 mb-1">
                        Incident Details
                      </p>

                      <p className="text-sm text-red-800">
                        {schedule.incidentDetails}
                      </p>
                    </div>
                  )}

                  {hasConcern && schedule.concernDetails && (
                    <div className="rounded-lg bg-yellow-50 border border-yellow-100 p-3">
                      <p className="text-xs font-medium text-yellow-700 mb-1">
                        Concern Details
                      </p>

                      <p className="text-sm text-yellow-800">
                        {schedule.concernDetails}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location */}
              {(schedule.checkInLatitude ||
                schedule.checkInLongitude ||
                schedule.checkOutLatitude ||
                schedule.checkOutLongitude) && (
                <Card>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <InfoCircle size={18} color="#025134" />

                      <h3 className="font-medium text-sm">Visit Location</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12">
                      <InfoRow label="Check-in Location">
                        {schedule.checkInLatitude &&
                        schedule.checkInLongitude ? (
                          <span className="text-sm">Location recorded</span>
                        ) : (
                          "-"
                        )}
                      </InfoRow>

                      <InfoRow label="Check-out Location">
                        {schedule.checkOutLatitude &&
                        schedule.checkOutLongitude ? (
                          <span className="text-sm">Location recorded</span>
                        ) : (
                          "-"
                        )}
                      </InfoRow>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Medication */}
              {hasMedication && (
                <Card>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <Health size={18} color="#025134" />

                      <h3 className="font-medium text-sm">Medication</h3>
                    </div>

                    <p className="text-sm whitespace-pre-wrap">
                      {typeof schedule.medicationAdministered === "string"
                        ? schedule.medicationAdministered
                        : "Medication was administered."}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Client Signature */}
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-sm">Client Signature</h3>

                      <p className="text-sm text-muted-foreground mt-1">
                        {hasSignature
                          ? "Signature captured"
                          : "No signature captured"}
                      </p>
                    </div>

                    {schedule.signedAt && (
                      <span className="text-xs text-muted-foreground">
                        {dayjs(schedule.signedAt).format("DD MMM YYYY, h:mm A")}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Missed Visit */}
              {hasMissedVisit && (
                <Card>
                  <CardContent>
                    <h3 className="font-medium text-sm mb-3">Missed Visit</h3>

                    <div className="space-y-2">
                      {schedule.missedReason && (
                        <InfoRow label="Reason">
                          {schedule.missedReason}
                        </InfoRow>
                      )}

                      {schedule.missedNotes && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Notes
                          </p>

                          <p className="text-sm">{schedule.missedNotes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cancellation */}
              {hasCancellation && (
                <Card>
                  <CardContent>
                    <h3 className="font-medium text-sm mb-3">Cancellation</h3>

                    <div className="grid grid-cols-2 gap-x-12">
                      <InfoRow label="Cancelled At">
                        {schedule.cancelledAt
                          ? dayjs(schedule.cancelledAt).format(
                              "DD MMM YYYY, h:mm A",
                            )
                          : "-"}
                      </InfoRow>

                      <InfoRow label="Cancelled By">
                        {findStaffName(schedule.cancelledBy)}
                      </InfoRow>

                      <InfoRow label="Reason">
                        {schedule.cancellationReason || "-"}
                      </InfoRow>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* ===================================================
              NOTES & OBSERVATIONS
          ==================================================== */}

          <TabsContent value="notes & observations">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <InfoCircle size={18} color="#025134" />

                <h3 className="font-medium text-sm">Visit Notes</h3>
              </div>

              <div className="space-y-3">
                {!showNoteEditor ? (
                  <div className="flex justify-end mb-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNoteEditor(true)}
                      disabled={isLoadingVisitNote}
                    >
                      <Add size={16} />
                      Add Note
                    </Button>
                  </div>
                ) : (
                  <>
                    <FormProvider {...methods}>
                      <VisitNoteField />
                    </FormProvider>

                    <div className="flex justify-end gap-2 mb-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNoteEditor(false)}
                        disabled={createVisitNote.isPending}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        onClick={handleNoteSubmit}
                        disabled={
                          isLoadingVisitNote ||
                          createVisitNote.isPending ||
                          methods.formState.isSubmitting
                        }
                      >
                        {createVisitNote.isPending ? <Spinner /> : "Save Note"}
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {schedule.notes?.length === 0 ? (
                <Card>
                  <CardContent className="py-2 flex justify-center items-center flex-col gap-2">
                    <p className="text-sm font-semibold">No notes yet</p>

                    <p className="text-sm text-muted-foreground mt-1">
                      Add first note with observations, task and incidents.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4 mb-6">
                  {schedule.notes?.map((note) => (
                    <Card key={note.id}>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap">
                          {note.note}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SheetForm>
  );
}
