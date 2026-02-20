// pages/components/care-plan-details-sheet.tsx

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { SheetForm } from "@/components/shared/sheet-form";
import { Add, Clock, Edit, Health, InfoCircle, People, Trash } from "iconsax-react";
import { VisitScheduleType } from "@/types/client/visit-schedule";
import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../../../../components/info-row";
import dayjs from "dayjs";
import { VisitNoteField } from "../../form/visit-note";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { VisitScheduleNoteForm, VisitScheduleNoteSchema } from "@/pages/app/clients/schemas/visit-schedule";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateVisitNote, useVisitNote } from "@/hooks/client/useVisitSchedule";
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
  type CarerCardItem = {
    id: string;
    label: string; // "Carer 1"
    name: string; // "L. Khan"
    avatarUrl?: string | null; // if you have it later
  };

  function formatShortName(firstname?: string, lastname?: string) {
    const fi = firstname?.[0] ? `${firstname[0].toUpperCase()}.` : "";
    const ln = lastname ?? "";
    return `${fi} ${ln}`.trim() || "-";
  }

  function buildCarerCards(schedule: VisitScheduleType): CarerCardItem[] {
    const seen = new Set<string>();

    const candidates = [
      schedule.assignedStaff ?? null,
      schedule.secondaryStaff ?? null,
      ...(schedule.preferredCarersDetails ?? []),
    ].filter(Boolean);

    const unique = candidates.filter((c: any) => {
      if (!c?.id) return false;
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });

    return unique.map((carer: any, idx: number) => ({
      id: carer.id,
      label: `Carer ${idx + 1}`,
      name: formatShortName(carer.user?.firstname, carer.user?.lastname),
      avatarUrl: carer.profilePicture ?? null, // if/when BE provides
    }));
  }

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
  const visitNote = visitNoteData?.notes ?? [];
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const hydratedNoteRef = useRef<string | null>(null);

  const extractNote = (payload: any): string => {
    if (!payload) return "";
    if (typeof payload === "string") return payload;

    if (Array.isArray(payload)) {
      const first = payload[0];
      if (typeof first === "string") return first;
      if (first && typeof first.note === "string") return first.note;
      return "";
    }

    if (typeof payload.note === "string") return payload.note;

    if (payload.data) {
      if (typeof payload.data === "string") return payload.data;
      if (typeof payload.data.note === "string") return payload.data.note;
      if (Array.isArray(payload.data) && payload.data.length > 0) {
        const first = payload.data[0];
        if (typeof first === "string") return first;
        if (first && typeof first.note === "string") return first.note;
      }
    }

    return "";
  };

  useEffect(() => {
    hydratedNoteRef.current = null;
    methods.reset({ note: "" });
  }, [schedule.id]);

  useEffect(() => {
    if (!open || hydratedNoteRef.current === schedule.id) return;
    methods.reset({ note: extractNote(visitNoteData) });
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

  return (
    <SheetForm
      open={open}
      onOpenChange={onOpenChange}
      title="Visit Details"
      description=" View client visit details"
      submitLabel=""
      submitDisabled
    >
      <div className="flex-1 overflow-y-auto py-5 space-y-6">
        {/* top row: status + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex space-x-2">
            <Button
              type="button"
              className={cn(
                "bg-gray-100 capitalize rounded-full font-semibold text-gray-700 hover:bg-green-100",
                schedule.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : schedule.status === "scheduled"
                    ? "bg-blue-100 text-blue-700"
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

        {/* title + meta */}
        <div className="space-y-1">
          {/* <h2 className="text-xl font-semibold">{assessmentLabel}</h2> */}
          <p className="text-xs text-muted-foreground">
            {schedule.startDate
              ? `${dayjs(schedule.startDate).format("DD MMMM YYYY")} | 
       ${startDateTime.format("h:mm A")} - 
       ${endDateTime.format("h:mm A")} 
       (${schedule.duration} m)`
              : "No start date"}
          </p>
        </div>

        {/* tabs */}
        <Tabs defaultValue="overview">
          <div className="overflow-x-auto pb-4">
            <TabsList className=" justify-start rounded-none border-b bg-transparent p-0">
              {/* "audit", */}
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

          {/* OVERVIEW */}
          <TabsContent value="overview">
            <div className="space-y-4">
              <Card>
                <CardContent className="space-y-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <InfoCircle size={18} color="#025134" />

                      <h3 className="font-medium text-sm">Visit Information</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-12 ">
                    <InfoRow label="Visit Type">
                      <span className="capitalize">
                        {schedule.scheduleType || "-"}
                      </span>
                    </InfoRow>
                    <InfoRow label="Duration">
                      {schedule.duration ? `${schedule.duration} mins` : "-"}
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
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <People size={18} color="#025134" />
                    <h3 className="font-medium text-sm">Assigned Carers</h3>
                  </div>

                  {(() => {
                    const carers = buildCarerCards(schedule);

                    if (carers.length === 0) {
                      return (
                        <p className="text-sm text-muted-foreground">
                          No carers assigned
                        </p>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {carers.map((c) => (
                          <div key={c.id} className="flex items-center gap-3">
                            {/* avatar */}
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {c.avatarUrl ? (
                                <img
                                  src={c.avatarUrl}
                                  alt={c.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-semibold text-gray-600">
                                  {c.name === "-"
                                    ? "?"
                                    : c.name.split(" ")[0]?.[0]}
                                </span>
                              )}
                            </div>

                            {/* labels */}
                            <div className="leading-tight">
                              <p className="text-sm text-muted-foreground">
                                {c.label}
                              </p>
                              <p className="text-sm font-medium">{c.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Health size={18} color="#025134" />

                      <h3 className="font-medium text-sm">Required Skills</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ">
                    <InfoRow label="">
                      {schedule.requiredSkills?.map((skill) => (
                        <span
                          key={skill}
                          className="capitalize bg-gray-200 px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      )) || "-"}
                    </InfoRow>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* GOALS */}
          <TabsContent value="activities">
            <div className="space-y-4">
              {schedule.activitiesRequired?.map((activities) => (
                <Card key={activities}>
                  <CardContent>
                    {/* <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TickCircle size={18} color="#025134" />

                        </div>
                      </div> */}
                    <h3 className="font-medium text-sm">{activities}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TASKS */}
          <TabsContent value="attendance">
            <div className="space-y-4">
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <People size={18} color="#025134" />
                    <h3 className="font-medium text-sm">Assigned Carers</h3>
                  </div>

                  {(() => {
                    const carers = buildCarerCards(schedule);

                    if (carers.length === 0) {
                      return (
                        <p className="text-sm text-muted-foreground">
                          No carers assigned
                        </p>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {carers.map((c) => (
                          <div key={c.id} className="flex items-center gap-3">
                            {/* avatar */}
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {c.avatarUrl ? (
                                <img
                                  src={c.avatarUrl}
                                  alt={c.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-semibold text-gray-600">
                                  {c.name === "-"
                                    ? "?"
                                    : c.name.split(" ")[0]?.[0]}
                                </span>
                              )}
                            </div>

                            {/* labels */}
                            <div className="leading-tight">
                              <p className="text-sm text-muted-foreground">
                                {c.label}
                              </p>
                              <p className="text-sm font-medium">{c.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <InfoCircle size={18} color="#025134" />

                      <h3 className="font-medium text-sm">Visit Information</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-12 ">
                    <InfoRow label="Check-in Time">
                      <span className="capitalize">
                        {schedule.checkedInBy || "-"}
                      </span>
                    </InfoRow>
                    <InfoRow label="Check-out Time">
                      {schedule.checkedOutBy || "-"}
                    </InfoRow>
                    <InfoRow label="Total Duration">
                      <span>{schedule.duration || "-"}</span>
                    </InfoRow>
                    <InfoRow label="Check-in Method">
                      <span className="uppercase">
                        {schedule.checkedInBy || "-"}
                      </span>
                    </InfoRow>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AUDIT */}
          <TabsContent value="notes & observations" >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <InfoCircle size={18} color="#025134" />
                <h3 className="font-medium text-sm">Visit Notes</h3>
              </div>
              <div className="space-y-3" >
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
                      {(
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowNoteEditor(false)}
                          disabled={createVisitNote.isPending}
                        >
                          Cancel
                        </Button>
                      )}
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
              {
                visitNote.length === 0 ? (
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
                    {visitNote.map((note) => (
                      <Card key={note.id}>
                        <CardContent>
                          <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {dayjs(note.createdAt).format("DD MMM YYYY, h:mm A")}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              }
            </div>

          </TabsContent>
        </Tabs>
      </div>
    </SheetForm>
  );
}
