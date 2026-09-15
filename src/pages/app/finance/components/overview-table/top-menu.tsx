import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddCarePackage from "../form/add-package";

export function CarePackageTopMenu() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="space-x-1">
        <Plus size={18} /> <span>Add Care Package</span>
      </Button>

      <AddCarePackage
        open={open}
        onOpenChange={setOpen}
        packageId={undefined}
      />
    </>
  );
}
