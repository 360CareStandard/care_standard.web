// pages/app/clients/client/overview/ContactNextOfKin.tsx
import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
import { ContactDetailsCard } from "../components/contact-card";
import { PeopleIcon } from "../icons/people";

import {
  AddContactSchema,
  type AddContactForm,
} from "../../schemas/add-contact-form";
import AddContact from "../forms/add-contact";

import {
  useCreateClientContact,
  useUpdateClientContact,
  useDeleteClientContact,
  useClientContacts,
  useClientContact,
} from "@/hooks/client/useClientContacts";
import { Skeleton } from "@/components/ui/skeleton";

// shadcn AlertDialog (confirmation)
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/shared/spinner";

type Props = {
  clientId: string;
};

const initialFormValues: Partial<AddContactForm> = {
  relationshipToClient: "other",
  status: "active",
};

const ContactNextOfKin: React.FC<Props> = ({ clientId }) => {
  const { data, isLoading, isError } = useClientContacts(clientId);
  const contacts = Array.isArray(data) ? data : [];
  const createContact = useCreateClientContact(clientId);
  const updateContact = useUpdateClientContact(clientId);
  const deleteContact = useDeleteClientContact(clientId);

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
      clientId,
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
  return (
    <>
      <Card>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
          {contacts.length < 2 ? (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-xl">Contact Information</h2>
              <p className="text-sm text-muted-foreground">
                Manage communication details and Family App access
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={openForAdd}
                  variant="outline"
                  className="gap-2"
                  disabled={isLoading}
                >
                  <PlusIcon />
                  Add Contact
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
              <div className="text-destructive">Failed loading contacts</div>
            ) : Array.isArray(contacts) && contacts.length > 0 ? (
              contacts.length < 2 ? (
                <ContactDetailsCard
                  contact={contacts[0]}
                  onEdit={() => openForEdit(contacts[0].id)}
                  // pass contact name so dialog can show it
                  onDelete={() =>
                    openDeleteDialog(contacts[0].id, contacts[0].contactName)
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
                      onDelete={() => openDeleteDialog(c.id, c.contactName)}
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

      {/* shadcn AlertDialog for delete confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contact</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeleteContact?.name ? (
                <>
                  Are you sure you want to delete{" "}
                  <strong>{pendingDeleteContact.name}</strong>? This action
                  cannot be undone.
                </>
              ) : (
                "Are you sure you want to delete this contact? This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={performDelete}
              // show loading state if the mutation is running
              disabled={deleteContact.isPending}
            >
              {deleteContact.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ContactNextOfKin;
