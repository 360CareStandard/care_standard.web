import { Main } from "@/layouts/main";
import { StaffPrimaryAction } from "./components/table/primary-action";
import StaffTable from "./components/table/staff-table";
import { Card, CardContent } from "@/components/ui/card";

const Staff = () => {
  return (
    <>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-semibold ">Staff</h1>
          </div>
          <StaffPrimaryAction />
        </div>
        <Card className="mt-12 rounded-lg border shadow-none ">
          <CardContent>
            <StaffTable initialPage={1} initialLimit={10} />
          </CardContent>
        </Card>
      </Main>
    </>
  );
};

export default Staff;
