import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function AgencyPrimaryAction({ setOpen }: Props) {
  return (
    <>
      <Button onClick={() => setOpen(true)} className="space-x-1">
        <Plus size={18} /> <span>Add New Agency</span>
      </Button>
    </>
  );
}
