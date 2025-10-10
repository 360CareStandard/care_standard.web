import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
import { HealthIcon } from "../icons/health";
import { HealthSetupAccordion } from "../components/health-accordion";
const Health = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Card>
        <CardContent className="grid grid-cols-1  sm:grid-cols-2 gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl"> Health</h2>
            <p className=" text-sm text-muted-foreground">
              Record health condition and clinical information.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <PlusIcon />
                Add Health Info
              </Button>
            </div>
          </div>
          <EmptyStateCard
            icon={<HealthIcon />}
            title="No health and clinical information recorded "
            description="Record conditions, allergies and risks so carers can provide safe support."
            btnText="Add Health Info"
            button
            onClick={() => setOpen(true)}
          />
        </CardContent>
      </Card>

      <SheetForm
        open={open}
        onOpenChange={setOpen}
        title="Add Health Information "
        description="Record health conditions and clinical information for Jemmy Wilson."
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={"Save Health Info"}
      >
        <HealthSetupAccordion />
      </SheetForm>
    </>
  );
};

export default Health;
