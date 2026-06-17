import { Main } from "@/layouts/main";
import { ClientsPrimaryButtons } from "./components/table/client-primary-button";
import ClientsTable from "./components/table/client-table";
import { Card, CardContent } from "@/components/ui/card";

const Clients = () => {
  return (
    <>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-semibold ">Clients</h1>
            {/* <p className="text-muted-foreground">Manage people in your care</p> */}
          </div>
          <ClientsPrimaryButtons />
        </div>

        <Card className="mt-12 rounded-lg border shadow-none ">
          <CardContent>
            <ClientsTable initialPage={1} initialLimit={10} />
          </CardContent>
        </Card>
      </Main>
    </>
  );
};

export default Clients;
