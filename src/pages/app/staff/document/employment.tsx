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
import { EmptyStateCard } from "../components/empty-state";
import { workDetails } from "@/types/staff/work";
import { ErrorStateCard } from "../components/error-state";
import {
  useCreateStaffEmployment,
  useStaffEmployment,
  useUpdateStaffEmployment,
} from "@/hooks/staff/useStaffEmployment";
import { EmploymentForm, EmploymentSchema } from "../schemas/employment";
import { EmploymentField } from "./components/form/employment";

const initialFormValues: Partial<EmploymentForm> = {};

type Props = {
  staffId: string;
};

const Employment = ({ staffId }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // hooks — make sure your hooks accept the payload shapes used below
  const createStaffEmployment = useCreateStaffEmployment(staffId);
  const updateStaffEmployment = useUpdateStaffEmployment(
    staffId,
    editingId ?? "",
  );
  const {
    data: staffEmployment,
    isLoading,
    isError,
    refetch,
  } = useStaffEmployment(staffId, Boolean(staffId));

  const methods = useForm<EmploymentForm>({
    resolver: zodResolver(EmploymentSchema) as unknown as Resolver<
      EmploymentForm,
      any
    >,
    mode: "onChange",
    defaultValues: initialFormValues as EmploymentForm,
  });

  function mapApiToFormValues(api?: workDetails): Partial<EmploymentForm> {
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
    } as Partial<EmploymentForm>;
  }

  const openForAdd = () => {
    methods.reset(initialFormValues as any);
    setEditingId(null);
    setOpen(true);
  };

  const openForEdit = (apiRecord: workDetails) => {
    const mapped = mapApiToFormValues(apiRecord);
    methods.reset(mapped as EmploymentForm);
    setEditingId(apiRecord?.id ?? null);
    setOpen(true);
  };

  async function onSubmit(values: EmploymentForm) {
    try {
      if (editingId) {
        // call update; adjust payload shape to your hook/api needs
        await updateStaffEmployment.mutateAsync({ body: values });
        toast.success("Staff employment details updated");
      } else {
        await createStaffEmployment.mutateAsync(values);
        toast.success("Staff employment details saved");
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
    <>
      <Card>
        <CardContent
          className={
            isLoading
              ? "p-6"
              : staffEmployment
                ? "grid grid-cols-1 gap-8 "
                : "flex  items-center justify-center"
          }
        >
          {!isLoading && staffEmployment ? (
            <div className="flex justify-between items-center gap-4">
              <div className=" space-y-1">
                <h2 className="font-bold text-xl">Employment Details</h2>
                <p className="text-xs text-muted-foreground">
                  {formatUpdatedAt(staffEmployment.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={() => openForEdit(staffEmployment)}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit size={20} />
                  Update Employment Details
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
              title="Unable to load employment details"
              onClick={() => refetch()}
              size="lg"
            />
          ) : staffEmployment ? (
            <div>Details here</div>
          ) : (
            // <StaffWorkDetails data={staffWork} open={open} />
            <EmptyStateCard
              size="lg"
              icon={<Ranking size={30} />}
              title="No employment details added yet."
              description=""
              btnText="Add employment details"
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
        title={editingId ? "Edit Employment details" : "Add Employment Details"}
        description={`${editingId ? "Edit" : "Add"} employment information for this staff member`}
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
          <EmploymentField />
        </FormProvider>
      </SheetForm>
    </>
  );
};

export default Employment;
