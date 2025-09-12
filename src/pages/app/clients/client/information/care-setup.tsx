import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
const CareSetup = () => {
  const [open, setOpen] = React.useState(false);
  const BoxIcon = () => (
    <svg
      width={32}
      height={31}
      viewBox="0 0 32 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.67517 9.54297L16.0001 16.0968L27.2481 9.58144"
        stroke="#191D31"
        strokeWidth="1.92383"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 27.7158V16.083"
        stroke="#191D31"
        strokeWidth="1.92383"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3451 3.18071L6.4963 6.97707C4.94441 7.83638 3.67468 9.99107 3.67468 11.761V19.0074C3.67468 20.7773 4.94441 22.932 6.4963 23.7913L13.3451 27.6005C14.8072 28.4085 17.2056 28.4085 18.6677 27.6005L25.5165 23.7913C27.0684 22.932 28.3382 20.7773 28.3382 19.0074V11.761C28.3382 9.99107 27.0684 7.83638 25.5165 6.97707L18.6677 3.16789C17.1928 2.35988 14.8072 2.35988 13.3451 3.18071Z"
        stroke="#191D31"
        strokeWidth="1.92383"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return (
    <>
      <Card>
        <CardContent className="grid grid-cols-1  sm:grid-cols-2 gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl"> Care Setup</h2>
            <p className=" text-sm text-muted-foreground">
              Define package, schedule, and rostering rules for this client
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <PlusIcon />
                Add Care Setup
              </Button>
            </div>
          </div>
          <EmptyStateCard
            icon={<BoxIcon />}
            title="No care setup has been added yet"
            description="Configure how care will be delivered: service package, scheduling preferences, funding authorization, and safety settings."
            btnText="Add Care Setup"
            button
          />
        </CardContent>
      </Card>

      <SheetForm
        open={open}
        onOpenChange={setOpen}
        title="Add New Contact"
        description="Add a new contact for Jemmy Wilson. Include their communication details and access permissions."
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={"Add Contact"}
      >
        <div>Form Content</div>
      </SheetForm>
    </>
  );
};

export default CareSetup;
