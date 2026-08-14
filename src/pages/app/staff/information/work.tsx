// pages/gp/GPsupport.tsx
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SheetForm } from "@/components/shared/sheet-form";

import { Spinner } from "@/components/shared/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUpdatedAt } from "@/helpers/last-updated";
import { Edit, Ranking } from "iconsax-react";
import {
  useCreateStaffWork,
  useStaffWork,
  useUpdateStaffWork,
} from "@/hooks/staff/useStaffWork";
import { WorkAccordion } from "./components/accordion/work";
import { StaffWorkForm, StaffWorkSchema } from "../schemas/work";
import { EmptyStateCard } from "../components/empty-state";
import { workDetails } from "@/types/staff/work";
import { StaffWorkDetails } from "./components/details/work";
import { ErrorStateCard } from "../components/error-state";
import { handleFormApiError } from "@/lib/handle-form-error";

const initialFormValues: Partial<StaffWorkForm> = {};

type Props = {
  staffId: string;
};

const Work = ({ staffId }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // hooks — make sure your hooks accept the payload shapes used below
  const createStaffWork = useCreateStaffWork(staffId);
  const updateStaffWork = useUpdateStaffWork(staffId, editingId ?? "");
  const {
    data: staffWork,
    isLoading,
    isError,
    refetch,
  } = useStaffWork(staffId, Boolean(staffId));

  const methods = useForm<StaffWorkForm>({
    resolver: zodResolver(StaffWorkSchema) as unknown as Resolver<
      StaffWorkForm,
      any
    >,
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: initialFormValues as StaffWorkForm,
  });

  function mapApiToFormValues(api?: workDetails): Partial<StaffWorkForm> {
    if (!api) return initialFormValues;
    return {
      address: api.address || "",
      latitude: api.latitude ? Number(api.latitude) : 51.5074,
      longitude: api.longitude ? Number(api.longitude) : -0.1278,
      modeOfTransport: api.modeOfTransport || "",
      rateCard: api.rateCard ? Number(api.rateCard) : 0,
      travelRateCard: api.travelRateCard ? Number(api.travelRateCard) : 0,
      note: api.note || "",
      isApp: api.isApp || false,
      isEmail: api.isEmail || false,
      isPhone: api.isPhone || false,
      isText: api.isText || false,
    } as Partial<StaffWorkForm>;
  }

  const openForAdd = () => {
    methods.reset(initialFormValues as any);
    setEditingId(null);
    setOpen(true);
  };

  const openForEdit = (apiRecord: workDetails) => {
    const mapped = mapApiToFormValues(apiRecord);
    methods.reset(mapped as StaffWorkForm);
    setEditingId(apiRecord?.id ?? null);
    setOpen(true);
  };

  async function onSubmit(values: StaffWorkForm) {
    try {
      if (editingId) {
        // call update; adjust payload shape to your hook/api needs
        await updateStaffWork.mutateAsync({ body: values });
        toast.success("Staff work details updated");
      } else {
        await createStaffWork.mutateAsync(values);
        toast.success("Staff work details saved");
      }

      setOpen(false);
      setEditingId(null);
      methods.reset(initialFormValues as any);
    } catch (err) {
      handleFormApiError<StaffWorkForm>(
        err,
        methods.setError,
        editingId
          ? "Failed to update work details"
          : "Failed to create work details",
      );
    }
  }

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <>
      <Card>
        <CardContent
          className={
            isLoading
              ? "p-6"
              : staffWork
                ? "grid grid-cols-1 gap-8 "
                : "flex  items-center justify-center"
          }
        >
          {!isLoading && staffWork ? (
            <div className="flex justify-between items-center gap-4">
              <div className=" space-y-1">
                <h2 className="font-bold text-xl">Work Details</h2>
                <p className="text-xs text-muted-foreground">
                  {formatUpdatedAt(staffWork.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={() => openForEdit(staffWork)}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit size={20} />
                  Update Work Details
                </Button>
              </div>
            </div>
          ) : (
            <></>
          )}

          {/* Replace the empty state with existing record view when you wire get-details */}
          {isLoading ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ) : isError ? (
            <ErrorStateCard
              title="Unable to load work details"
              onClick={() => refetch()}
              size="lg"
            />
          ) : staffWork ? (
            <StaffWorkDetails data={staffWork} open={open} />
          ) : (
            <EmptyStateCard
              size="lg"
              icon={<Ranking size={30} />}
              title="Work details not set"
              description="Add work preferences and details for this staff member."
              btnText="Add Work Details"
              button
              onClick={openForAdd}
            />
          )}
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
        title={editingId ? "Edit Work Details" : "Add Work Details"}
        description={`${editingId ? "Edit" : "Add"} work preferences and details for this staff member.`}
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
          <WorkAccordion />
        </FormProvider>
      </SheetForm>
    </>
  );
};

export default Work;
