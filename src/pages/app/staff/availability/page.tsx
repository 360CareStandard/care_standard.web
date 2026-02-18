import { useParams } from "react-router-dom";
import { EmptyStateCard } from "../components/empty-state";
import { Add, Calendar2 } from "iconsax-react";
import { useStaffDetails } from "@/hooks/staff/useStaff";
import { Button } from "@/components/ui/button";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { Spinner } from "@/components/shared/spinner";
import { SheetForm } from "@/components/shared/sheet-form";
import React from "react";
import {
  StaffAvailabilityForm,
  StaffAvailabilitySchema,
} from "../schemas/availability";
import { zodResolver } from "@hookform/resolvers/zod";
import AvailabilityForm from "./components/form/availability";
import {
  useCreateStaffAvailability,
  useStaffAvailability,
  useUpdateStaffAvailability,
} from "@/hooks/staff/useAvailability";
import toast from "react-hot-toast";
import Calendar from "@/components/calendar";
import { useEvents } from "@/context/events-context";
import { useEffect } from "react";
import { mapStaffAvailabilityToEvents } from "./utils/map-staff-availability";
import { ErrorStateCard } from "../components/error-state";
import SinglePageLoader from "@/components/loading/single-page-loader";
const initialFormValues: Partial<StaffAvailabilityForm> = {
  frequency: "daily",
};
export default function Availability() {
  const { staffId } = useParams<{ staffId: string }>();
  const { data: staffData } = useStaffDetails(staffId);
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const createStaffAvailability = useCreateStaffAvailability(staffId as string);
  const updateStaffAvailability = useUpdateStaffAvailability(
    staffId as string,
    editingId ?? "",
  );
  const {
    data: availabilities,
    isLoading,
    refetch,
    isError,
  } = useStaffAvailability(staffId as string, Boolean(staffId));
  const staffAvailability = availabilities ?? [];
  const { setEvents } = useEvents();

  useEffect(() => {
    if (staffAvailability?.length) {
      const calendarEvents = mapStaffAvailabilityToEvents(staffAvailability);

      setEvents(calendarEvents);
    }
  }, [staffAvailability, setEvents]);

  const methods = useForm<StaffAvailabilityForm>({
    resolver: zodResolver(StaffAvailabilitySchema) as unknown as Resolver<
      StaffAvailabilityForm,
      any
    >,
    mode: "onChange",
    defaultValues: initialFormValues as StaffAvailabilityForm,
  });

  const openForAdd = () => {
    methods.reset(initialFormValues as any);
    setEditingId(null);
    setOpen(true);
  };
  async function onSubmit(values: StaffAvailabilityForm) {
    try {
      if (editingId) {
        // call update; adjust payload shape to your hook/api needs
        await updateStaffAvailability.mutateAsync({ body: values });
        toast.success("Staff availability details updated");
      } else {
        await createStaffAvailability.mutateAsync(values);
        toast.success("Staff availability details saved");
      }

      setOpen(false);
      setEditingId(null);
      methods.reset(initialFormValues as any);
    } catch (err: any) {
      console.error("Save failed", err);
      toast.error(err?.message ?? "Save failed, try again");
    }
  }

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
        <div className="flex gap-2 items-center">
          <Button size="lg" onClick={openForAdd}>
            <Add />
            Add availbility
          </Button>
          <Button variant="outline" size="lg" className="bg-white">
            <Add />
            Book absense
          </Button>
        </div>
      </div>

      <div>
        {isLoading ? (
          <SinglePageLoader text="staff availabilities" />
        ) : isError ? (
          <div className="flex mt-52 justify-center items-center">
            <ErrorStateCard
              className="shadow-none !border-0 !bg-transparent"
              title="Unable to load staff availabilities"
              onClick={() => refetch()}
              size="lg"
            />
          </div>
        ) : staffAvailability.length ? (
          <Calendar />
        ) : (
          <div className="flex mt-52 justify-center items-center">
            <EmptyStateCard
              className="shadow-none !border-0 !bg-transparent"
              icon={<Calendar2 size={30} />}
              title="No availability set"
              description="This staff member does not have any availability yet.
Add availability to enable scheduling."
              btnText="Add availability"
              button
              onClick={openForAdd}
            />
          </div>
        )}
      </div>
      <SheetForm
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setEditingId(null);
            methods.reset(initialFormValues as any);
          }
        }}
        title={editingId ? "Edit Availability" : "Add Availability"}
        description={`Set when this staff member is available to work`}
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
          <AvailabilityForm />
        </FormProvider>
      </SheetForm>
    </div>
  );
}
