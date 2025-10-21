import { Main } from "@/layouts/main";
import { useClients } from "@/hooks/useClients";
import { ClientsPrimaryButtons } from "./components/table/client-primary-button";
import ClientsTable from "./components/table/client-table";

const Clients = () => {
  const { data } = useClients();
  console.log(data);

  return (
    <>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-medium ">Clients</h1>
            {/* <p className="text-muted-foreground">Manage people in your care</p> */}
          </div>
          <ClientsPrimaryButtons />
        </div>
        <div
          className="-mx-4 mt-10 flex-1 overflow-auto px-4 py-4 lg:flex-row lg:space-y-0 lg:space-x-12 bg-white shadow
      rounded-2xl
      "
        >
          <ClientsTable initialPage={1} initialLimit={10} />
        </div>
      </Main>
    </>
  );
};

export default Clients;
