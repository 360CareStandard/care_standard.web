import React from "react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Edit, Trash } from "iconsax-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeleteCarePackage } from "@/hooks/agency/care-package";
import { CarePackage } from "@/types/care-package";

import AddCarePackage from "../form/add-package";

interface DataTableRowActionsProps {
  row: Row<CarePackage>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedPackageId, setSelectedPackageId] = React.useState<
    string | undefined
  >();

  const deleteCarePackage = useDeleteCarePackage(selectedPackageId ?? "");

  const packageData = row.original;

  const handleEdit = () => {
    setSelectedPackageId(packageData.id);
    setOpenEdit(true);
  };

  const handleDelete = () => {
    setSelectedPackageId(packageData.id);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedPackageId) return;

    try {
      await deleteCarePackage.mutateAsync();

      toast.success("Care package deleted");

      setOpenDelete(false);
      setSelectedPackageId(undefined);
    } catch {
      toast.error("Could not delete care package");
    }
  };

  const handleEditOpenChange = (isOpen: boolean) => {
    setOpenEdit(isOpen);

    if (!isOpen) {
      setSelectedPackageId(undefined);
    }
  };

  const handleDeleteOpenChange = (isOpen: boolean) => {
    setOpenDelete(isOpen);

    if (!isOpen && !deleteCarePackage.isPending) {
      setSelectedPackageId(undefined);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="sr-only">Open actions</span>
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={4}>
          <DropdownMenuItem onSelect={handleEdit} className="text-sm">
            <Edit size={15} />
            Edit Package
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={handleDelete}
            className="text-sm text-red-500 focus:text-red-500"
          >
            <Trash size={15} className="text-red-500" />
            Delete Package
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddCarePackage
        open={openEdit}
        onOpenChange={handleEditOpenChange}
        packageId={selectedPackageId}
      />

      <ConfirmDialog
        open={openDelete}
        onOpenChange={handleDeleteOpenChange}
        handleConfirm={confirmDelete}
        disabled={deleteCarePackage.isPending}
        isLoading={deleteCarePackage.isPending}
        className="!max-w-xl !bg-[#F9FAFB]"
        title={<span>Delete Care Package?</span>}
        desc={
          <div className="space-y-6">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold">{packageData.name}</span>?
            </p>
          </div>
        }
        confirmText="Delete Package"
        destructive
      />
    </>
  );
}
