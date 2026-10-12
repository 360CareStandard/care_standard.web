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
import { Add, Document } from "iconsax-react";
import { EmptyStateCard } from "../components/empty-state";
import { ErrorStateCard } from "../components/error-state";

import { StaffDocumentForm, StaffDocumentSchema } from "../schemas/document";
import {
  useCreateStaffDocument,
  useDeleteStaffDocument,
  useStaffDocument,
  useUpdateStaffDocument,
} from "@/hooks/staff/useStaffDocument";
import { StaffDocument } from "@/types/staff/document";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { AdditionalDocumentForm } from "./components/form/addtional-document";
import { AdditionalDocumentList } from "./components/details/additional-document";
import { handleFormApiError } from "@/lib/handle-form-error";

const initialFormValues: Partial<StaffDocumentForm> = {
  expired: false, // ✅ IMPORTANT
  reason: "",
};
const toDateInputValue = (iso?: string) => {
  if (!iso) return "";
  return iso.split("T")[0]; // YYYY-MM-DD
};

type Props = {
  staffId: string;
};

const AdditionalDocument = ({ staffId }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [pendingDeleteDoc, setPendingDeleteDoc] = React.useState<{
    id: string;
    name?: string;
  } | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  // hooks — make sure your hooks accept the payload shapes used below
  const createStaffDocument = useCreateStaffDocument(staffId);
  const updateStaffDocument = useUpdateStaffDocument(staffId, editingId ?? "");
  const deleteStaffDocument = useDeleteStaffDocument(staffId);
  const {
    data: staffDocument,
    isLoading,
    refetch,
    isError,
  } = useStaffDocument(staffId, Boolean(staffId));
  const methods = useForm<StaffDocumentForm>({
    resolver: zodResolver(StaffDocumentSchema) as unknown as Resolver<
      StaffDocumentForm,
      any
    >,
    mode: "onChange",
    defaultValues: initialFormValues as StaffDocumentForm,
  });

  function mapApiToFormValues(api?: StaffDocument): Partial<StaffDocumentForm> {
    if (!api) return initialFormValues;
    return {
      documentType: api.documentType || "",
      reason: api.reason ?? "",
      documentUrl: api.documentUrl || "",
      expired: api.expired || false,
      expiryDate: toDateInputValue(api.expiryDate ?? undefined),
    } as Partial<StaffDocumentForm>;
  }

  const openForAdd = () => {
    methods.reset(initialFormValues as StaffDocumentForm);
    setEditingId(null);
    setOpen(true);
  };

  const openForEdit = (apiRecord: StaffDocument) => {
    const mapped = mapApiToFormValues(apiRecord);
    methods.reset(mapped as StaffDocumentForm);
    setEditingId(apiRecord?.id ?? null);
    setOpen(true);
  };
  const openDeleteDialog = (doc: StaffDocument) => {
    setPendingDeleteDoc({ id: doc.id, name: doc.documentType });
    setConfirmOpen(true);
  };
  const performDelete = async () => {
    if (!pendingDeleteDoc) return;
    console.log(pendingDeleteDoc.id);

    try {
      await deleteStaffDocument.mutateAsync(pendingDeleteDoc.id);
      toast.success("Document deleted");
      setConfirmOpen(false);
      setPendingDeleteDoc(null);
      refetch();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete document");
    } finally {
      setPendingDeleteDoc(null);
    }
  };

  async function onSubmit(values: StaffDocumentForm) {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (!value) return;

        if (value instanceof File) {
          const extension = value.name.split(".").pop();
          const safeName = values.documentType
            .replace(/\s+/g, "_")
            .toLowerCase();

          const renamedFile = new File([value], `${safeName}.${extension}`, {
            type: value.type,
          });

          formData.append(key, renamedFile);
        } else {
          formData.append(key, String(value));
        }
      });

      if (editingId) {
        await updateStaffDocument.mutateAsync(formData);
        toast.success("Staff document updated");
      } else {
        await createStaffDocument.mutateAsync(formData);
        toast.success("Staff document saved");
      }

      setOpen(false);
      methods.reset(initialFormValues as any);
    } catch (err) {
      handleFormApiError<StaffDocumentForm>(
        err,
        methods.setError,
        editingId
          ? "Failed to update staff document"
          : "Failed to create staff document",
      );
    }
  }

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };
  const staffAdditionalDocAvailable = staffDocument && staffDocument.length > 0;
  return (
    <>
      <Card>
        <CardContent
          className={
            isLoading
              ? "p-6"
              : staffAdditionalDocAvailable
                ? "grid grid-cols-1 gap-8 "
                : "flex  items-center justify-center"
          }
        >
          {!isLoading && staffAdditionalDocAvailable ? (
            <div className="flex justify-between items-center gap-4">
              <div className=" space-y-1">
                <h2 className="font-bold text-xl">Additional Documents</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={openForAdd}
                  variant="outline"
                  className="gap-2"
                >
                  <Add size={20} />
                  Add New Document
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
              title="Unable to load staff documents"
              onClick={() => refetch()}
              size="lg"
            />
          ) : staffAdditionalDocAvailable ? (
            <AdditionalDocumentList
              documents={staffDocument}
              onEdit={(doc) => openForEdit(doc)}
              onDelete={(doc) => openDeleteDialog(doc)}
            />
          ) : (
            <EmptyStateCard
              size="lg"
              icon={<Document size={30} />}
              title="No additional documents added."
              description=""
              btnText="Add document"
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
        title={editingId ? "Edit Document" : "Upload Document"}
        description={`${editingId ? "Edit" : "Add"} additional document for this staff member`}
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
          <AdditionalDocumentForm />
        </FormProvider>
      </SheetForm>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        handleConfirm={performDelete}
        disabled={deleteStaffDocument.isPending}
        isLoading={deleteStaffDocument.isPending}
        className="!bg-[#F9FAFB] "
        title={
          <div>
            <span className="text-sm">Delete required document?</span>
          </div>
        }
        desc={
          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-4 space-y-3">
              <ul className="space-y-2">
                This document will be permanently removed from this staff
                member’s records. This action cannot be undone.
              </ul>
            </div>
          </div>
        }
        cancelBtnText="Keep document"
        confirmText="Delete"
        destructive
      />
    </>
  );
};

export default AdditionalDocument;
