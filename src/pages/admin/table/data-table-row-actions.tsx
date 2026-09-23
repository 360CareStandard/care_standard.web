import React from "react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";

import {
  useDeleteAgency,
  useSuspendAgency,
  useActivateAgency,
} from "@/hooks/agency";

import { AgencyNew } from "@/types/agency";
import AddAgency from "../components/add-agency";
import AgencyDetails from "../components/agency-details";

interface DataTableRowActionsProps {
  row: Row<AgencyNew>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openSuspend, setOpenSuspend] = React.useState(false);
  const [openActivate, setOpenActivate] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);

  const [selectedAgencyId, setSelectedAgencyId] = React.useState<
    string | undefined
  >();

  const agency = row.original;

  const deleteAgency = useDeleteAgency();
  const suspendAgency = useSuspendAgency();
  const activateAgency = useActivateAgency();

  const handleViewDetails = () => {
    setSelectedAgencyId(agency.id);
    setOpenDetails(true);
    setOpen(false);
  };

  const handleEdit = () => {
    setSelectedAgencyId(agency.id);
    setOpenEdit(true);
    setOpen(false);
  };

  const handleDelete = () => {
    setSelectedAgencyId(agency.id);
    setOpenDelete(true);
    setOpen(false);
  };

  const handleSuspend = () => {
    setSelectedAgencyId(agency.id);
    setOpenSuspend(true);
    setOpen(false);
  };

  const handleActivate = () => {
    setSelectedAgencyId(agency.id);
    setOpenActivate(true);
    setOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedAgencyId) return;

    try {
      await deleteAgency.mutateAsync(selectedAgencyId ?? "");

      toast.success("Agency deleted");

      setOpenDelete(false);
      setSelectedAgencyId(undefined);
    } catch {
      toast.error("Could not delete agency");
    }
  };

  const confirmSuspend = async () => {
    if (!selectedAgencyId) return;

    try {
      await suspendAgency.mutateAsync(selectedAgencyId ?? "");

      toast.success("Agency suspended");

      setOpenSuspend(false);
      setSelectedAgencyId(undefined);
    } catch {
      toast.error("Could not suspend agency");
    }
  };

  const confirmActivate = async () => {
    if (!selectedAgencyId) return;

    try {
      await activateAgency.mutateAsync(selectedAgencyId ?? "");

      toast.success("Agency activated");

      setOpenActivate(false);
      setSelectedAgencyId(undefined);
    } catch {
      toast.error("Could not activate agency");
    }
  };

  const handleEditOpenChange = (isOpen: boolean) => {
    setOpenEdit(isOpen);

    if (!isOpen) {
      setSelectedAgencyId(undefined);
    }
  };

  const handleDeleteOpenChange = (isOpen: boolean) => {
    setOpenDelete(isOpen);

    if (!isOpen && !deleteAgency.isPending) {
      setSelectedAgencyId(undefined);
    }
  };

  const handleSuspendOpenChange = (isOpen: boolean) => {
    setOpenSuspend(isOpen);

    if (!isOpen && !suspendAgency.isPending) {
      setSelectedAgencyId(undefined);
    }
  };

  const handleActivateOpenChange = (isOpen: boolean) => {
    setOpenActivate(isOpen);

    if (!isOpen && !activateAgency.isPending) {
      setSelectedAgencyId(undefined);
    }
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <EllipsisVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={4}
          className="z-[60] w-[160px]"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem onSelect={handleEdit}>
            Edit Agency
            <DropdownMenuShortcut>
              <Pencil size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {agency.status === "active" ? (
            <DropdownMenuItem onSelect={handleSuspend}>
              Suspend Agency
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={handleActivate}>
              Activate Agency
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleViewDetails}>
            View Details
            <DropdownMenuShortcut>
              <Eye size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={handleDelete} className="!text-red-500">
            Delete Agency
            <DropdownMenuShortcut>
              <Trash2 size={16} className="text-red-500" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit */}
      <AddAgency
        open={openEdit}
        onOpenChange={handleEditOpenChange}
        agencyId={selectedAgencyId}
      />

      {/* Delete */}
      <ConfirmDialog
        open={openDelete}
        onOpenChange={handleDeleteOpenChange}
        handleConfirm={confirmDelete}
        disabled={deleteAgency.isPending}
        isLoading={deleteAgency.isPending}
        className="!max-w-xl !bg-[#F9FAFB]"
        title={<span>Delete Agency?</span>}
        desc={
          <div className="space-y-6">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold">{agency.name}</span>?
            </p>
          </div>
        }
        confirmText="Delete Agency"
        destructive
      />

      {/* Suspend */}
      <ConfirmDialog
        open={openSuspend}
        onOpenChange={handleSuspendOpenChange}
        handleConfirm={confirmSuspend}
        disabled={suspendAgency.isPending}
        isLoading={suspendAgency.isPending}
        className="!max-w-xl !bg-[#F9FAFB]"
        title={<span>Suspend Agency?</span>}
        desc={
          <div className="space-y-6">
            <p>
              Are you sure you want to suspend{" "}
              <span className="font-bold">{agency.name}</span>?
            </p>
          </div>
        }
        confirmText="Suspend Agency"
      />

      {/* Activate */}
      <ConfirmDialog
        open={openActivate}
        onOpenChange={handleActivateOpenChange}
        handleConfirm={confirmActivate}
        disabled={activateAgency.isPending}
        isLoading={activateAgency.isPending}
        className="!max-w-xl !bg-[#F9FAFB]"
        title={<span>Activate Agency?</span>}
        desc={
          <div className="space-y-6">
            <p>
              Are you sure you want to activate{" "}
              <span className="font-bold">{agency.name}</span>?
            </p>
          </div>
        }
        confirmText="Activate Agency"
      />
      <AgencyDetails
        open={openDetails}
        onOpenChange={(isOpen) => {
          setOpenDetails(isOpen);

          if (!isOpen) {
            setSelectedAgencyId(undefined);
          }
        }}
        agencyId={selectedAgencyId}
      />
    </>
  );
}
