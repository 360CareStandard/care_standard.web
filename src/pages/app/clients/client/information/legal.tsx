import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
const Legal = () => {
  const [open, setOpen] = React.useState(false);
  const DocIcon = () => (
    <svg
      width={32}
      height={31}
      viewBox="0 0 32 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.8255 12.8258V19.2386C28.8255 25.6514 26.2604 28.2165 19.8476 28.2165H12.1523C5.73954 28.2165 3.17444 25.6514 3.17444 19.2386V11.5433C3.17444 5.13053 5.73954 2.56543 12.1523 2.56543H18.5651"
        stroke="#191D31"
        strokeWidth="1.92383"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28.8255 12.8258H23.6953C19.8476 12.8258 18.5651 11.5433 18.5651 7.69564V2.56543L28.8255 12.8258Z"
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
            <h2 className="font-bold text-xl"> Legal</h2>
            <p className=" text-sm text-muted-foreground">
              Record legal status, consent and authorised contacts that affect
              this client's care
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <PlusIcon />
                Add Legal Info
              </Button>
            </div>
          </div>
          <EmptyStateCard
            icon={<DocIcon />}
            title="No legal documents or consent records have been added"
            description="Record Power of Attorney, DNAR, mental capacity notes, data-sharing consent, court orders and signed documents for audit, compliance and to safely invite family users."
            btnText="Add Legal Info"
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

export default Legal;
