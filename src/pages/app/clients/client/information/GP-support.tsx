import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
import { StethIcon } from "../icons/steth";
import { GPsupportAccordion } from "../components/Gpsupport-accordion";
const GPsupport = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Card>
        <CardContent className="grid grid-cols-1  sm:grid-cols-2 gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl"> GP & Support</h2>
            <p className=" text-sm text-muted-foreground">
              Record client’s main healthcare professionals and external support
              contacts
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <PlusIcon />
                Add GP & Support
              </Button>
            </div>
          </div>
          <EmptyStateCard
            icon={<StethIcon />}
            title="No GP or healthcare contacts have been added yet"
            description="Record GP, clinicians, and other healthcare professionals supporting this client"
            btnText="Add GP & Support"
            button
            onClick={() => setOpen(true)}
          />
        </CardContent>
      </Card>

      <SheetForm
        open={open}
        onOpenChange={setOpen}
        title="Add GP & Support Contacts  "
        description="Record GP and healthcare professional information for Jemmy Wilson."
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={"Save Info"}
      >
        <GPsupportAccordion />
      </SheetForm>
    </>
  );
};

export default GPsupport;
