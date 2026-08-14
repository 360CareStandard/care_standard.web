import { useStaffWithClients } from "@/hooks/staff/useStaff";
import { useParams } from "react-router-dom";
import { DataTable } from "./components/data-table";
import { assignedcolumns } from "./components/column";
import { useMemo, useState } from "react";
import { norm } from "@/utils/norm";
/** Normalize for case/diacritics-insensitive search */

const Clients = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const { data, isLoading } = useStaffWithClients(staffId as string);
  const [searchText] = useState<string>("");
  const assignedClientData = data?.assignedClients ?? [];

  const filtered = useMemo(() => {
    const q = norm(searchText);
    if (!q) return assignedClientData;

    return assignedClientData.filter((item) => {
      const firstname = norm(item?.firstname);
      const lastname = norm(item?.lastname);
      const phone = norm(item?.phone);
      return firstname.includes(q) || lastname.includes(q) || phone.includes(q);
    });
  }, [assignedClientData, searchText]);
  // const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
  //   setSearchText(event.target.value);
  // };
  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Clients</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Care recipients assigned to this staff member
            </p>
          </div>
        </div>
        {/* Desktop table */}
        <div
          className="-mx-4 mt-12 flex-1 overflow-auto px-4 py-4 lg:flex-row lg:space-y-0 lg:space-x-12 bg-white shadow
      rounded-lg
      "
        >
          <DataTable
            columns={assignedcolumns}
            data={filtered}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Clients;
