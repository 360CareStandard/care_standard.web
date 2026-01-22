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
import { Add, MedalStar } from "iconsax-react";
import { EmptyStateCard } from "../components/empty-state";
import {
  useCreateStaffSkill,
  useDeleteStaffSkill,
  useStaffSkill,
  useUpdateStaffSkill,
} from "@/hooks/staff/useStaffSkill";
import { AddStaffSkillForm, AddStaffSkillSchema } from "../schemas/skill";
import { SkillForm } from "./components/form/skill";
import { ErrorStateCard } from "../components/error-state";
import { SkillCard } from "./components/skill-card";
import { StaffSkill } from "@/types/staff/skill";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

const initialFormValues: Partial<AddStaffSkillForm> = {
  hasCertificate: false,
};

type Props = {
  staffId: string;
};

const Skill = ({ staffId }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // hooks — make sure your hooks accept the payload shapes used below
  const createStaffSkill = useCreateStaffSkill(staffId);
  const updateStaffSkill = useUpdateStaffSkill(staffId, editingId || "");
  const deleteStaffSkill = useDeleteStaffSkill(staffId);
  const {
    data: staffSkill,
    isLoading,
    isError,
    refetch,
  } = useStaffSkill(staffId, Boolean(staffId));

  // alert dialog state
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingDeleteSkill, setPendingDeleteSkill] = React.useState<{
    id: string;
    name?: string;
  } | null>(null);
  const staffSkillAvailable = staffSkill && staffSkill.length > 0;
  const methods = useForm<AddStaffSkillForm>({
    resolver: zodResolver(AddStaffSkillSchema) as unknown as Resolver<
      AddStaffSkillForm,
      any
    >,
    mode: "onChange",
    defaultValues: initialFormValues as AddStaffSkillForm,
  });

  function mapApiToFormValues(api?: StaffSkill): Partial<AddStaffSkillForm> {
    if (!api) return initialFormValues;
    return {
      skillName: api.skillName || "",
      skillType: api.skillType || "",
      note: api.note || "",
      hasCertificate: false,
      expiredAt: api.expiredAt || undefined,
      certificateDocumentUrl: api.certificateUrl || "",
      // certificateDocument: api.certificateDocument || undefined, // File can not be prefilled
    } as Partial<AddStaffSkillForm>;
  }

  const openForAdd = () => {
    methods.reset(initialFormValues as any);
    setEditingId(null);
    setOpen(true);
  };

  const openForEdit = (apiRecord: StaffSkill) => {
    const mapped = mapApiToFormValues(apiRecord);
    methods.reset(mapped as AddStaffSkillForm);
    setEditingId(apiRecord?.id ?? null);
    setOpen(true);
  };

  // open AlertDialog for delete — capture id + name for context
  const openDeleteDialog = (contactId: string, contactName?: string) => {
    setPendingDeleteSkill({ id: contactId, name: contactName });
    setConfirmOpen(true);
  };

  // perform delete from dialog confirm
  const performDelete = async () => {
    if (!pendingDeleteSkill) return;
    try {
      await deleteStaffSkill.mutateAsync(pendingDeleteSkill.id);
      toast.success("Skill deleted");
      setConfirmOpen(false);
      setPendingDeleteSkill(null);
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  async function onSubmit(values: AddStaffSkillForm) {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (value instanceof File) {
          formData.append(key, value); // <-- real binary
        } else {
          formData.append(key, String(value)); // <-- strings
        }
      });

      if (editingId) {
        // call update; adjust payload shape to your hook/api needs
        await updateStaffSkill.mutateAsync(formData);
        toast.success("Staff skill details updated");
      } else {
        await createStaffSkill.mutateAsync(formData);
        toast.success("Staff skill details saved");
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
              : staffSkillAvailable
                ? "grid grid-cols-1 gap-8 "
                : "flex  items-center justify-center"
          }
        >
          {!isLoading && staffSkillAvailable ? (
            <div className="flex justify-between items-center gap-4">
              <div className=" space-y-1">
                <h2 className="font-bold text-xl">Skills & Training</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  //   onClick={() => openForEdit(staffSkill)}
                  onClick={openForAdd}
                  variant="outline"
                  className="gap-2"
                >
                  <Add size={20} />
                  Add New Skill
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
              title="Unable to load skills & training"
              onClick={() => refetch()}
              size="lg"
            />
          ) : staffSkillAvailable ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {staffSkill.map((c) => (
                <SkillCard
                  key={c.id}
                  skill={c}
                  onEdit={() => openForEdit(c)}
                  onDelete={() => openDeleteDialog(c.id, c.skillName)}
                  className="gap-0 w-full"
                />
              ))}
            </div>
          ) : (
            // <StaffWorkDetails data={staffSkill} open={open} />
            <EmptyStateCard
              size="lg"
              icon={<MedalStar size={30} />}
              title="No skills or training added"
              description="Add skills to help with client matching and scheduling."
              btnText="Add Skill"
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
        title={editingId ? "Edit Skills & Training" : "Add Skills & Training"}
        // description={`${editingId ? "Edit" : "Add"} work preferences and details for this staff member.`}
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
          <SkillForm />
        </FormProvider>
      </SheetForm>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        handleConfirm={performDelete}
        disabled={deleteStaffSkill.isPending}
        isLoading={deleteStaffSkill.isPending}
        className="!bg-[#F9FAFB] "
        title={<span>Delete Skill?</span>}
        desc={
          <div className="space-y-6">
            <p className="mb-2">
              Are you sure you want to delete{" "}
              <span className="font-bold">{pendingDeleteSkill?.name}</span>?
              <br />
            </p>
          </div>
        }
        confirmText="Delete Skill"
        destructive
      />
    </>
  );
};

export default Skill;
