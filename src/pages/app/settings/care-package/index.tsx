import { useCarePackage } from "@/hooks/agency/care-package";
import { norm } from "@/utils/norm";
import { useMemo, useState } from "react";
import { DataTable } from "./components/data-table";
import { carePackagecolumns } from "./components/column";
import { Main } from "@/layouts/main";
import { CarePackageTopMenu } from "./components/top-menu";

const CarePackage = () => {
  const { data, isLoading } = useCarePackage();
  const [searchText] = useState<string>("");
  const packagedata = Array.isArray(data) ? data : [];
  const filtered = useMemo(() => {
    const q = norm(searchText);
    if (!q) return packagedata;

    return packagedata.filter((item) => {
      const name = norm(item?.name);
      const desc = norm(item?.description);
      return name.includes(q) || desc.includes(q);
    });
  }, [packagedata, searchText]);
  // const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
  //   setSearchText(event.target.value);
  // };

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-semibold ">Care Packages</h1>
        </div>
        <CarePackageTopMenu />
      </div>
      <div className="overflow-auto rounded-lg mt-12 bg-white pb-4 shadow">
        <DataTable
          columns={carePackagecolumns}
          data={filtered}
          loading={isLoading}
        />
      </div>
    </Main>
  );
};

export default CarePackage;
