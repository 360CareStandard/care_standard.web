// pages/app/clients/client/overview/ContactNextOfKin.tsx
import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";

import {
  AddContactSchema,
  type AddContactForm,
} from "../../schemas/add-contact-form";
import AddContact from "../forms/add-contact";
import { ContactDetailsCard } from "../components/contact-card";
import { ContactDetails } from "../../schemas/contact-details";
import { PeopleIcon } from "../icons/people";

const ContactNextOfKin = () => {
  const [open, setOpen] = React.useState(false);
  const [lastContact, setLastContact] = React.useState<ContactDetails | null>(
    null
  );

  const methods = useForm<AddContactForm>({
    resolver: zodResolver(AddContactSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      relationship: "Other",
      phone: "",
      email: "",
      address: "",
      notes: "",
      primaryContact: true,
      emergencyContact: true,
      familyAccessApp: true,
    },
  });

  const onSubmit = async (values: AddContactForm) => {
    // values have "", not undefined, per your schema preference
    setLastContact(values as ContactDetails);
    setOpen(false);
    methods.reset();
  };
  // const onSubmit = async (values: AddContactForm) => {
  //   // TODO: call your API
  //   console.log("submit:", values);

  //   // success UX
  //   setOpen(false);
  //   methods.reset();
  // };

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };

  const { formState } = methods;

  return (
    <>
      <Card>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl">Contact Information</h2>
            <p className="text-sm text-muted-foreground">
              Manage communication details and Family App access
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <PlusIcon />
                Add Contact
              </Button>
            </div>
          </div>
          {lastContact ? (
            <ContactDetailsCard
              contact={lastContact}
              onEdit={() => setOpen(true)}
              onDelete={() => setLastContact(null)}
            />
          ) : (
            <EmptyStateCard
              icon={<PeopleIcon />}
              title="No contacts added yet"
              description="Start by adding contact information for family members, friends, or carers who should have access to updates"
            />
          )}
        </CardContent>
      </Card>

      <SheetForm
        open={open}
        onOpenChange={setOpen}
        title="Add New Contact"
        description="Add a new contact for Jemmy Wilson. Include their communication details and access permissions."
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={formState.isSubmitting ? "Saving..." : "Add Contact"}
        submitDisabled={formState.isSubmitting}
        onSubmit={handleSheetSubmit}
        bodyClassName="space-y-4"
      >
        <FormProvider {...methods}>
          <AddContact />
        </FormProvider>
      </SheetForm>
    </>
  );
};

export default ContactNextOfKin;
