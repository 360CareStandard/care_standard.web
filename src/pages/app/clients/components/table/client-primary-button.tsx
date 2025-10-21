import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddClient from "../../add-client";

export function ClientsPrimaryButtons() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="space-x-1">
        <Plus size={18} /> <span>Add New Client</span>
      </Button>

      <AddClient open={open} setOpen={setOpen} />
    </>
  );
}
