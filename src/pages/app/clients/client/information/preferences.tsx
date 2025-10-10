import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
import { SettingIcon } from "../icons/setting";
import { PreferenceAccordion } from "../components/preference-accordion";
const Preferences = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Card>
        <CardContent className="grid grid-cols-1  sm:grid-cols-2 gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl"> Preferences </h2>
            <p className=" text-sm text-muted-foreground">
              Capture routines, cultural needs, and personal likes to support
              person-centred care.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <PlusIcon />
                Add Preferences
              </Button>
            </div>
          </div>
          <EmptyStateCard
            icon={<SettingIcon />}
            title="No preferences have been added for this client"
            description="Record access, equipment and environment details for this client’s home."
            btnText="Add Preferences"
            button
            onClick={() => setOpen(true)}
          />
        </CardContent>
      </Card>

      <SheetForm
        open={open}
        onOpenChange={setOpen}
        title="Add Personal Preferences "
        description="Capture routines, cultural needs, and personal likes information."
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={"Save Info"}
      >
        <PreferenceAccordion />
      </SheetForm>
    </>
  );
};

export default Preferences;
