import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddStaff from "../forms/add-staff";

export function StaffPrimaryAction() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="space-x-1">
        <Plus size={18} /> <span>Add New Staff</span>
      </Button>

      <AddStaff open={open} setOpen={setOpen} />
    </>
  );
}
