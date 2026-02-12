// pages/app/clients/client/overview/ContactNextOfKin.tsx
import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";

import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/shared/spinner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { AddStaffContactForm, AddStaffContactSchema } from "../schemas/contact";
import { ContactDetailsCard } from "./components/contact-card";
import { EmptyStateCard } from "../../clients/client/components/empty-state";
import { PeopleIcon } from "@/assets/icons";
import AddContact from "./components/form/add-contact";
import {
  useCreateStaffContact,
  useStaffContacts,
  useUpdateStaffContact,
  useDeleteStaffContact,
  useStaffContact,
} from "@/hooks/staff/useStaffContacts";
import { ErrorStateCard } from "../components/error-state";

type Props = {
  staffId: string;
};

const initialFormValues: Partial<AddStaffContactForm> = {
  relationship: "other",
};

const ContactNextOfKin: React.FC<Props> = ({ staffId }) => {
  const { data, isLoading, isError, refetch } = useStaffContacts(staffId);
  const contacts = Array.isArray(data) ? data : [];
  const createContact = useCreateStaffContact(staffId);
  const updateContact = useUpdateStaffContact(staffId);
  const deleteContact = useDeleteStaffContact(staffId);

  const [open, setOpen] = React.useState(false);
  const [editingContactId, setEditingContactId] = React.useState<string | null>(
    null,
  );

  // alert dialog state
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingDeleteContact, setPendingDeleteContact] = React.useState<{
    id: string;
    name?: string;
  } | null>(null);

  const methods = useForm<AddStaffContactForm>({
    resolver: zodResolver(AddStaffContactSchema),
    mode: "onChange",
    defaultValues: initialFormValues as any,
  });

  // fetch single contact details only when editing
  const { data: contactDetails, isLoading: isLoadingDetails } = useStaffContact(
    staffId,
    editingContactId ?? "",
    Boolean(editingContactId),
  );

  // populate form for editing
  React.useEffect(() => {
    if (contactDetails) {
      methods.reset({
        nextOfKinFullName: contactDetails.nextOfKinFullName ?? "",
        relationship: contactDetails.relationship ?? "other",
        phone: contactDetails.phone ?? "",
        email: contactDetails.email ?? "",
        address: contactDetails.address ?? "",
        notes: contactDetails.notes ?? "",
        gender: contactDetails.gender ?? "",
        mainPointOfContact: contactDetails.mainPointOfContact ?? false,
        availiableForUrgentSituation:
          contactDetails.availiableForUrgentSituation ?? false,
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
      await deleteContact.mutateAsync();
      toast.success("Contact deleted");
      setConfirmOpen(false);
      setPendingDeleteContact(null);
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const onSubmit = async (values: AddStaffContactForm) => {
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
  return (
    <>
      <Card>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
          {contacts.length < 2 ? (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-xl">Contact Information</h2>
              <p className="text-sm text-muted-foreground">
                Manage communication details and contacts
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={openForAdd}
                  variant="outline"
                  className="gap-2"
                  disabled={isLoading}
                >
                  <PlusIcon />
                  Add New Contact
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`flex justify-between items-center gap-4 ${
                contacts?.length < 2 ? "" : "sm:col-span-2"
              }`}
            >
              <div className=" space-y-1">
                <h2 className="font-bold text-xl">Contact Information</h2>
                <p className="text-xs text-muted-foreground">
                  Manage communication details and Family App access
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={openForAdd}
                  variant="outline"
                  className="gap-2"
                >
                  <PlusIcon />
                  Add Contact
                </Button>
              </div>
            </div>
          )}

          {/* right column */}
          <div className={`${contacts?.length < 2 ? "" : "sm:col-span-2"}`}>
            {isLoading ? (
              <div className="space-y-4 p-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ) : isError ? (
              <ErrorStateCard
                title="Unable to load contacts"
                onClick={() => refetch()}
              />
            ) : Array.isArray(contacts) && contacts.length > 0 ? (
              contacts.length < 2 ? (
                <ContactDetailsCard
                  contact={contacts[0]}
                  onEdit={() => openForEdit(contacts[0].id)}
                  // pass contact name so dialog can show it
                  onDelete={() =>
                    openDeleteDialog(
                      contacts[0].id,
                      contacts[0].nextOfKinFullName,
                    )
                  }
                  className="gap-0 w-full"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {contacts.map((c) => (
                    <ContactDetailsCard
                      key={c.id}
                      contact={c}
                      onEdit={() => openForEdit(c.id)}
                      onDelete={() =>
                        openDeleteDialog(c.id, c.nextOfKinFullName)
                      }
                      className="gap-0 w-full"
                    />
                  ))}
                </div>
              )
            ) : (
              <EmptyStateCard
                icon={<PeopleIcon />}
                title="No contacts added yet"
                description="Start by adding contact information for family members, friends, or carers who should have access to updates"
              />
            )}
          </div>
        </CardContent>
      </Card>

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
        title={<span>Delete contact?</span>}
        desc={
          <div className="space-y-6">
            <p className="mb-2">
              Are you sure you want to delete{" "}
              <span className="font-bold">{pendingDeleteContact?.name}</span>?
              <br />
            </p>
          </div>
        }
        confirmText="Delete Contact"
        destructive
      />
    </>
  );
};

export default ContactNextOfKin;
