import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
import { HomeHastagIcon } from "../icons/home-hashtag";
import { HomeSetupAccordion } from "../components/home-accordion";
const HomeEnvironment = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Card>
        <CardContent className="grid grid-cols-1  sm:grid-cols-2 gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl"> Home & Environment </h2>
            <p className=" text-sm text-muted-foreground">
              Record access, equipment and environment details for this client’s
              home.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <PlusIcon />
                Add Home Info
              </Button>
            </div>
          </div>
          <EmptyStateCard
            icon={<HomeHastagIcon />}
            title="No home info have been added yet"
            description="Record access, equipment and environment details for this client’s home."
            btnText="Add Home Info"
            button
            onClick={() => setOpen(true)}
          />
        </CardContent>
      </Card>

      <SheetForm
        open={open}
        onOpenChange={setOpen}
        title="Add Home & Environment Information "
        description="Record access, equipment and environment details for this client’s home"
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={"Save Info"}
      >
        <HomeSetupAccordion />
      </SheetForm>
    </>
  );
};

export default HomeEnvironment;
