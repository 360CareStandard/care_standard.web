import { Main } from "@/layouts/main";
import { UsersPrimaryButtons } from "../users/components/users-primary-buttons";
import { userListSchema } from "../users/data/schema";
import { users } from "../users/data/users";
import { columns } from "../users/components/users-columns";
import { UsersTable } from "../users/components/users-table";

const Clients = () => {
  const userList = userListSchema.parse(users);
  return (
    <>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-medium ">Clients</h1>
            {/* <p className="text-muted-foreground">Manage people in your care</p> */}
          </div>
          <UsersPrimaryButtons />
        </div>
        <div
          className="-mx-4 mt-10 flex-1 overflow-auto px-4 py-4 lg:flex-row lg:space-y-0 lg:space-x-12 bg-white shadow
      rounded-2xl
      "
        >
          {/* <UsersTable data={users} search={search} navigate={navigate} /> */}
          <UsersTable data={userList} columns={columns} />
        </div>
      </Main>
    </>
  );
};

export default Clients;
