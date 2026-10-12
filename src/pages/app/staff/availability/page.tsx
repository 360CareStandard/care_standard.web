import React from "react";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { Add, Calendar2 } from "iconsax-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SheetForm } from "@/components/shared/sheet-form";
import { Spinner } from "@/components/shared/spinner";
import SinglePageLoader from "@/components/loading/single-page-loader";
import { useStaffDetails } from "@/hooks/staff/useStaff";
import {
  useCreateStaffAvailability,
  useCreateStaffBookAbsence,
  useDeleteStaffAvailability,
  useStaffAvailability,
  useUpdateStaffAvailability,
} from "@/hooks/staff/useAvailability";
import { StaffAvailability } from "@/types/staff/availability";

import { EmptyStateCard } from "../components/empty-state";
import { ErrorStateCard } from "../components/error-state";
import {
  StaffAvailabilityForm,
  StaffAvailabilitySchema,
} from "../schemas/availability";
import {
  StaffBookAbsenceForm,
  StaffBookAbsenceSchema,
} from "../schemas/book-absence";
import AvailabilityForm from "./components/form/availability";
import AbsenceForm from "./components/form/absence";
import WeeklyAvailabilityTimeline from "./components/weekly-availability-timeline";
import DeleteAvailabilityDialog from "./components/dialog/delete-availability-dialog";
import {
  initialAbsenceFormValues,
  initialAvailabilityFormValues,
  mapAvailabilityToFormValues,
} from "./utils/availability-form-helpers";
import toast from "react-hot-toast";
import { handleFormApiError } from "@/lib/handle-form-error";

export default function Availability() {
  const { staffId } = useParams<{ staffId: string }>();
  const [openAvailabilitySheet, setOpenAvailabilitySheet] =
    React.useState(false);
  const [openAbsenceSheet, setOpenAbsenceSheet] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteMode, setDeleteMode] = React.useState<"instance" | "future">(
    "instance",
  );
  const [selectedAvailability, setSelectedAvailability] =
    React.useState<StaffAvailability | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const { data: staffData } = useStaffDetails(staffId);
  const {
    data: availabilities,
    isLoading,
    isError,
    refetch,
  } = useStaffAvailability(staffId as string, Boolean(staffId));

  const createStaffAvailability = useCreateStaffAvailability(staffId as string);
  const createStaffBookAbsence = useCreateStaffBookAbsence(staffId as string);
  const updateStaffAvailability = useUpdateStaffAvailability(
    staffId as string,
    editingId ?? "",
  );

  const deleteStaffAvailability = useDeleteStaffAvailability(staffId as string);

  const staffAvailability = availabilities ?? [];

  const availabilityMethods = useForm<StaffAvailabilityForm>({
    resolver: zodResolver(
      StaffAvailabilitySchema,
    ) as unknown as Resolver<StaffAvailabilityForm>,
    mode: "onChange",
    defaultValues: initialAvailabilityFormValues as StaffAvailabilityForm,
  });

  const absenceMethods = useForm<StaffBookAbsenceForm>({
    resolver: zodResolver(
      StaffBookAbsenceSchema,
    ) as unknown as Resolver<StaffBookAbsenceForm>,
    mode: "onChange",
    defaultValues: initialAbsenceFormValues as StaffBookAbsenceForm,
  });

  const openForAddAvailability = () => {
    setEditingId(null);
    availabilityMethods.reset(
      initialAvailabilityFormValues as StaffAvailabilityForm,
    );
    setOpenAvailabilitySheet(true);
  };

  const handleEditAvailability = (availability: StaffAvailability) => {
    setEditingId(availability.id);
    availabilityMethods.reset(mapAvailabilityToFormValues(availability));
    setOpenAvailabilitySheet(true);
  };

  const handleDeleteAvailability = (availability: StaffAvailability) => {
    setSelectedAvailability(availability);
    setDeleteMode("instance");
    setDeleteDialogOpen(true);
  };

  const onSubmitAvailability = async (values: StaffAvailabilityForm) => {
    try {
      if (editingId) {
        await updateStaffAvailability.mutateAsync({ body: values });
        toast.success("Staff availability details updated");
      } else {
        await createStaffAvailability.mutateAsync(values);
        toast.success("Staff availability details saved");
      }

      setOpenAvailabilitySheet(false);
      setEditingId(null);
      availabilityMethods.reset(
        initialAvailabilityFormValues as StaffAvailabilityForm,
      );
    } catch (err: unknown) {
      handleFormApiError<StaffAvailabilityForm>(
        err,
        availabilityMethods.setError,
        editingId
          ? "Failed to update staff availability"
          : "Failed to create staff availability",
      );
    }
  };

  const onSubmitAbsence = async (values: StaffBookAbsenceForm) => {
    try {
      await createStaffBookAbsence.mutateAsync(values);
      toast.success("Absence booked successfully");
      setOpenAbsenceSheet(false);
      absenceMethods.reset(initialAbsenceFormValues as StaffBookAbsenceForm);
    } catch (err: unknown) {
      handleFormApiError<StaffBookAbsenceForm>(
        err,
        absenceMethods.setError,
        "Failed to book absence",
      );
    }
  };

  const performDelete = async () => {
    if (!selectedAvailability) return;

    try {
      await deleteStaffAvailability.mutateAsync(selectedAvailability.id);
      toast.success("Availability deleted");
      setDeleteDialogOpen(false);
      setSelectedAvailability(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete availability");
    }
  };

  const handleAvailabilitySheetSubmit: React.FormEventHandler<
    HTMLFormElement
  > = (e) => {
    e.preventDefault();
    void availabilityMethods.handleSubmit(onSubmitAvailability)();
  };

  const handleAbsenceSheetSubmit: React.FormEventHandler<HTMLFormElement> = (
    e,
  ) => {
    e.preventDefault();
    void absenceMethods.handleSubmit(onSubmitAbsence)();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {isLoading ? (
          <Spinner size="lg" />
        ) : (
          staffData && (
            <div>
              <h1 className="text-2xl font-semibold">
                {staffData?.user.firstname}'s availability schedule
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Set working availability and manage absences for this staff
                member
              </p>
            </div>
          )
        )}

        <div className="flex items-center gap-2">
          <Button size="lg" onClick={openForAddAvailability}>
            <Add />
            Add availbility
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white"
            onClick={() => setOpenAbsenceSheet(true)}
          >
            <Add />
            Book absense
          </Button>
        </div>
      </div>

      <div>
        {isLoading ? (
          <SinglePageLoader text="staff availabilities" />
        ) : isError ? (
          <div className="mt-52 flex items-center justify-center">
            <ErrorStateCard
              className="!border-0 !bg-transparent shadow-none"
              title="Unable to load staff availabilities"
              onClick={() => refetch()}
              size="lg"
            />
          </div>
        ) : staffAvailability.length ? (
          <Card className="mx-auto mt-12 w-full flex-1 border-0 shadow-none">
            <CardContent className="px-0">
              <WeeklyAvailabilityTimeline
                schedules={staffAvailability}
                onEditAvailability={handleEditAvailability}
                onDeleteAvailability={handleDeleteAvailability}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="mt-52 flex items-center justify-center">
            <EmptyStateCard
              className="!border-0 !bg-transparent shadow-none"
              icon={<Calendar2 size={30} />}
              title="No availability set"
              description="This staff member does not have any availability yet.
Add availability to enable scheduling."
              btnText="Add availability"
              button
              onClick={openForAddAvailability}
            />
          </div>
        )}
      </div>

      <SheetForm
        open={openAvailabilitySheet}
        onOpenChange={(open) => {
          setOpenAvailabilitySheet(open);
          if (!open) {
            setEditingId(null);
            availabilityMethods.reset(
              initialAvailabilityFormValues as StaffAvailabilityForm,
            );
          }
        }}
        title={editingId ? "Edit Availability" : "Add Availability"}
        description="Set when this staff member is available to work"
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={
          availabilityMethods.formState.isSubmitting ? (
            <Spinner size="sm" />
          ) : editingId ? (
            "Save Changes"
          ) : (
            "Save  Info"
          )
        }
        submitDisabled={availabilityMethods.formState.isSubmitting}
        onSubmit={handleAvailabilitySheetSubmit}
      >
        <FormProvider {...availabilityMethods}>
          <AvailabilityForm />
        </FormProvider>
      </SheetForm>

      <SheetForm
        open={openAbsenceSheet}
        onOpenChange={(open) => {
          setOpenAbsenceSheet(open);
          if (!open) {
            absenceMethods.reset(
              initialAbsenceFormValues as StaffBookAbsenceForm,
            );
          }
        }}
        title="Book absence"
        description="Record when this staff member will be unavailable"
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={
          absenceMethods.formState.isSubmitting ? (
            <Spinner size="sm" />
          ) : (
            "Book absence"
          )
        }
        submitDisabled={absenceMethods.formState.isSubmitting}
        onSubmit={handleAbsenceSheetSubmit}
      >
        <FormProvider {...absenceMethods}>
          <AbsenceForm />
        </FormProvider>
      </SheetForm>

      <DeleteAvailabilityDialog
        open={deleteDialogOpen}
        selectedAvailability={selectedAvailability}
        deleteMode={deleteMode}
        isDeleting={deleteStaffAvailability.isPending}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setSelectedAvailability(null);
        }}
        onDeleteModeChange={setDeleteMode}
        onConfirmDelete={performDelete}
      />
    </div>
  );
}
