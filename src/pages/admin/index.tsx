import { Main } from "@/layouts/main";
import { Card, CardContent } from "@/components/ui/card";
import { AgencyTable } from "./table/agency-table";
import { AgencyPrimaryAction } from "./table/primary-action";
import AddAgency from "./components/add-agency";
import { useState } from "react";

const AdminPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-semibold ">Agencies</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Manage agencies in your organization
            </p>
          </div>
          <AgencyPrimaryAction setOpen={setOpen} />
        </div>

        <Card className="mt-12 rounded-lg border shadow-none ">
          <CardContent>
            <AgencyTable initialPage={1} initialLimit={10} setOpen={setOpen} />
          </CardContent>
        </Card>
      </Main>
      <AddAgency open={open} onOpenChange={setOpen} />
    </>
  );
};

export default AdminPage;
