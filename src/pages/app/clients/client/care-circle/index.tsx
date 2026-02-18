import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Add, CloseCircle, Profile2User } from "iconsax-react";
import { useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { SheetForm } from "@/components/shared/sheet-form";
import { AddContactSchema, type AddContactForm } from "../../schemas/contact";
import {
  useCreateClientContact,
  useUpdateClientContact,
  useDeleteClientContact,
  useClientContacts,
  useClientContact,
} from "@/hooks/client/useClientContacts";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/shared/spinner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import AddContact from "../information/components/forms/add-contact";
import ClientContactTable from "./components/table/care-circle-table";

const initialFormValues: Partial<AddContactForm> = {
  relationshipToClient: "other",
  status: "active",
};

const CareCircle = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { data, isLoading } = useClientContacts(clientId as string);
  const contacts = Array.isArray(data) ? data : [];
  const createContact = useCreateClientContact(clientId as string);
  const updateContact = useUpdateClientContact(clientId as string);
  const deleteContact = useDeleteClientContact(clientId as string);

  const [open, setOpen] = React.useState(false);
  const [editingContactId, setEditingContactId] = React.useState<string | null>(
    null
  );
  // alert dialog state
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingDeleteContact, setPendingDeleteContact] = React.useState<{
    id: string;
    name?: string;
  } | null>(null);
  const methods = useForm<AddContactForm>({
    resolver: zodResolver(AddContactSchema),
    mode: "onChange",
    defaultValues: initialFormValues as any,
  });

  // fetch single contact details only when editing
  const { data: contactDetails, isLoading: isLoadingDetails } =
    useClientContact(
      clientId as string,
      editingContactId ?? "",
      Boolean(editingContactId)
    );

  // populate form for editing
  React.useEffect(() => {
    if (contactDetails) {
      methods.reset({
        contactName: contactDetails.contactName ?? "",
        relationshipToClient: contactDetails.relationshipToClient ?? "other",
        contactPhone: contactDetails.contactPhone ?? "",
        contactEmail: contactDetails.contactEmail ?? "",
        contactAddress: contactDetails.contactAddress ?? "",
        notes: contactDetails.notes ?? "",
        status: (contactDetails as any).status ?? "active",
        isPrimaryContact: contactDetails.isPrimaryContact ?? false,
        isEmergencyContact: contactDetails.isEmergencyContact ?? false,
        hasAppAccess: contactDetails.hasAppAccess ?? false,
      });
    }
  }, [contactDetails, methods]);

  // open Add sheet (clear form)
  const openForAdd = () => {
    methods.reset(initialFormValues as any);
    setEditingContactId(null);
    setOpen(true);
  };

  // open Edit sheet
  const openForEdit = (contactId: string) => {
    setEditingContactId(contactId);
    setOpen(true);
  };

  // open AlertDialog for delete — capture id + name for context
  const openDeleteDialog = (contactId: string, contactName?: string) => {
    setPendingDeleteContact({ id: contactId, name: contactName });
    setConfirmOpen(true);
  };

  // perform delete from dialog confirm
  const performDelete = async () => {
    if (!pendingDeleteContact) return;
    try {
      await deleteContact.mutateAsync(pendingDeleteContact.id);
      toast.success("Contact deleted");
      setConfirmOpen(false);
      setPendingDeleteContact(null);
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const onSubmit = async (values: AddContactForm) => {
    try {
      if (editingContactId) {
        await updateContact.mutateAsync({
          contactId: editingContactId,
          body: values,
        });
        toast.success("Contact updated");
      } else {
        await createContact.mutateAsync(values);
        toast.success("Contact created");
      }
      setOpen(false);
      methods.reset(initialFormValues as any);
      setEditingContactId(null);
    } catch (err) {
      console.error(err);
      toast.error("Save failed, try again");
    }
  };
  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };
  const hasContacts = contacts.length > 0;
  return (
    <div className="space-y-6 w-full flex-1 ">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-semibold">Care Circle</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Care circle members have full access to Client’s care notes
          </p>
        </div>
        {hasContacts && (
          <Button size="sm" className="gap-2" onClick={openForAdd}>
            <Add className="w-4 h-4" />
            Create new care circle member
          </Button>
        )}
      </div>
      {!hasContacts && !isLoading && (
        <CareCircleEmptyState openForAdd={openForAdd} />
      )}
      {hasContacts && (
        <div className="overflow-auto rounded-lg bg-white pb-4 shadow mt-20">
          <ClientContactTable
            clientId={clientId as string}
            openDeleteDialog={openDeleteDialog}
            openForEdit={openForEdit}
          />
        </div>
      )}

      <SheetForm
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setEditingContactId(null);
            methods.reset(initialFormValues as any);
          }
        }}
        title={editingContactId ? "Edit Contact" : "Add New Contact"}
        description={
          editingContactId
            ? isLoadingDetails
              ? "Loading contact details..."
              : ``
            : "Add a new contact."
        }
        submitLabel={
          methods.formState.isSubmitting ? (
            <Spinner size="sm" />
          ) : editingContactId ? (
            "Save Changes"
          ) : (
            "Add Contact"
          )
        }
        submitDisabled={methods.formState.isSubmitting || isLoadingDetails}
        onSubmit={handleSheetSubmit}
        bodyClassName="space-y-4"
      >
        {/* show inline loader while single contact being fetched */}
        {isLoadingDetails && editingContactId ? (
          <div className="p-6">
            <Skeleton className="h-6 w-1/3 mb-3" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ) : (
          <FormProvider {...methods}>
            <AddContact />
          </FormProvider>
        )}
      </SheetForm>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        handleConfirm={performDelete}
        disabled={deleteContact.isPending}
        isLoading={deleteContact.isPending}
        className="!bg-[#F9FAFB] "
        title={
          <div>
            <span>Delete Care Member</span>
          </div>
        }
        desc={
          <div className="space-y-6">
            <p className="mb-2">
              Are you sure you want to delete{" "}
              <span className="font-bold">{pendingDeleteContact?.name}</span>?
              <br />
            </p>
            <div className="rounded-lg border bg-white p-4 space-y-3">
              <p className="text-sm ">Deleting will:</p>

              <ul className="space-y-2">
                {[
                  "Remove person from contact list",
                  "Remove person from care member",
                  "Keep all past records and logs",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CloseCircle className="h-5 w-5 text-orange-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
        confirmText="Delete Care Member"
        destructive
      />
    </div>
  );
};

export default CareCircle;

const CareCircleEmptyState = ({ openForAdd }: { openForAdd: () => void }) => {
  return (
    <Card className="flex-1 mt-8 mx-auto w-full ">
      <CardContent className="flex flex-col items-center justify-center py-6 gap-3">
        <Profile2User size={30} />
        <h4 className="font-semibold">No Care Circle members yet</h4>
        <p className="text-muted-foreground text-sm text-center max-w-xl">
          Add family, professionals and staff who support this person.
        </p>
        <Button onClick={openForAdd} className="text-xs mt-1">
          <Add className="w-4 h-4" />
          Add Person
        </Button>
      </CardContent>
    </Card>
  );
};
