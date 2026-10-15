import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Row, Table } from "@tanstack/react-table";
import { Edit, InfoCircle, Trash } from "iconsax-react";
import { ClientContact } from "@/types/client/contact";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import React from "react";
import { useClientContactInvitation } from "@/hooks/client/useClientContacts";
import { toast } from "react-hot-toast";

interface DataTableRowActionsProps {
  row: Row<ClientContact>;
  table: Table<ClientContact>;
}

export function DataTableRowActions({ row, table }: DataTableRowActionsProps) {
  const { openForEdit, openDeleteDialog } = table.options.meta as {
    openForEdit: (contactId: string) => void;
    openDeleteDialog: (
      contactId: string,
      contactName?: string | undefined,
    ) => void;
  };

  const contact = row.original;
  const [openInviteDialog, setOpenInviteDialog] = React.useState(false);
  const inviteContact = useClientContactInvitation(contact.clientId);

  const handleSendInvite = async () => {
    setOpenInviteDialog(true);
    if (!contact) return;
    try {
      await inviteContact.mutateAsync({ email: contact.contactEmail });
      toast.success("Invite sent");
      setOpenInviteDialog(false);
    } catch {
      toast.error("Could not send invite");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={4}>
          <DropdownMenuItem
            className="text-sm"
            onSelect={() => setOpenInviteDialog(true)}
          >
            <InfoCircle size={15} className="" />
            Send Invite
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => openForEdit(row.original.id)}
            className="text-sm"
          >
            <Edit size={15} />
            Edit Member
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() =>
              openDeleteDialog(row.original.id, row.original.contactName)
            }
            className="text-red-500 text-sm"
          >
            <Trash size={15} className=" text-red-500" />
            Delete Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={openInviteDialog}
        onOpenChange={setOpenInviteDialog}
        handleConfirm={handleSendInvite}
        disabled={inviteContact.isPending}
        isLoading={inviteContact.isPending}
        className="!max-w-xl !bg-[#F9FAFB]"
        title={<span>Send Invite?</span>}
        desc={
          <div className="space-y-6">
            <p>
              Are you sure you want to send an invite to{" "}
              <span className="font-bold">{contact.contactName}</span>?
            </p>
          </div>
        }
        confirmText="Send Invite"
      />
    </>
  );
}
