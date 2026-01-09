import { Main } from "@/layouts/main";
import { StaffPrimaryAction } from "./components/table/primary-action";
import { useStaff } from "@/hooks/staff/useStaff";
// import { ClientsPrimaryButtons } from "./components/table/client-primary-button";

const Staff = () => {
  const { data } = useStaff();
  console.log(data);

  return (
    <>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-semibold ">Staff</h1>
            {/* <p className="text-muted-foreground">Manage people in your care</p> */}
          </div>
          <StaffPrimaryAction />
        </div>
        <div
          className="-mx-4 mt-20 flex-1 overflow-auto px-4 py-4 lg:flex-row lg:space-y-0 lg:space-x-12 bg-white shadow
      rounded-lg
      "
        >
          {/* <ClientsTable initialPage={1} initialLimit={10} /> */}
        </div>
      </Main>
    </>
  );
};

export default Staff;
