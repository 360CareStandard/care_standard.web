import { SheetForm } from "@/components/shared/sheet-form";
import { TextField } from "@/components/shared/text-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export function UsersPrimaryButtons() {
  // const { setOpen } = useUsers();
  return (
    <div className="flex gap-2">
      {/* <Button
        variant="outline"
        className="space-x-1"
        // onClick={() => setOpen("invite")}
      >
        <span>Invite User</span> <MailPlus size={18} />
      </Button> */}

      <SheetForm
        trigger={
          <Button
            className="space-x-1"
            //  onClick={() => setOpen("add")}
          >
            <Plus size={18} /> <span>Add New Client</span>
          </Button>
        }
        title="Add New Client"
        description="Capture basic details to create a client profile"
        headerClassName="bg-[#E4E7EC]"
        onSubmit={(e) => {
          e.preventDefault();
          // grab data via FormData if you want:
          const fd = new FormData(e.currentTarget);
          const name = String(fd.get("name") || "");
          const username = String(fd.get("username") || "");
          // ... do something (call api, set state, etc.)
        }}
      >
        <div className="grid gap-6">
          <TextField label="Name" />
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input
              id="sheet-demo-name"
              name="name"
              defaultValue="Pedro Duarte"
            />
          </div>
        </div>
      </SheetForm>
    </div>
  );
}
