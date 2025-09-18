import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
import { DocIcon } from "../icons/doc";
import { LegalSetupAccordion } from "../components/legal-accordion";
const Legal = () => {
  const [open, setOpen] = React.useState(false);

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
            onClick={() => setOpen(true)}
          />
        </CardContent>
      </Card>

      <SheetForm
        open={open}
        onOpenChange={setOpen}
        title="Add Legal Information"
        description="Record legal status, consent and authorization details for Jemmy Wilson."
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={"Save Legal Info"}
      >
        <LegalSetupAccordion />
      </SheetForm>
    </>
  );
};

export default Legal;
