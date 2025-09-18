import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  MapPin,
  NotebookText,
  User2,
  Users,
  Pencil,
  Trash2,
  Users2,
  Tag,
} from "lucide-react";
import { InfoRow } from "./info-row"; // <- your InfoRow from the prompt

type ContactDetails = {
  fullName: string;
  relationship:
    | "Spouse"
    | "Son"
    | "Daughter"
    | "Sibling"
    | "Parent"
    | "Friend"
    | "Neighbor"
    | "Carer"
    | "Other"; // "Son" | "Spouse" | ...
  phone: string; // keep as "" if not provided
  email: string;
  address: string;
  notes: string;
  primaryContact: boolean;
  emergencyContact: boolean;
  familyAccessApp: boolean;
};

type Props = {
  contact: ContactDetails;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
};

export function ContactDetailsCard({
  contact,
  onEdit,
  onDelete,
  className,
}: Props) {
  const {
    fullName,
    relationship,
    phone,
    email,
    address,
    notes,
    primaryContact,
    emergencyContact,
    familyAccessApp,
  } = contact;

  const TagBadges = () => (
    <div className="flex flex-wrap gap-2">
      {primaryContact && <Badge variant="default">Primary</Badge>}
      {emergencyContact && <Badge variant="destructive">Emergency</Badge>}
      {familyAccessApp && <Badge>App Access</Badge>}
      {!primaryContact && !emergencyContact && !familyAccessApp ? (
        <span className="text-xs text-muted-foreground">No tags</span>
      ) : null}
    </div>
  );

  const empty = (v: string) =>
    v && v.trim().length > 0 ? (
      v
    ) : (
      <span className="text-muted-foreground">—</span>
    );

  return (
    <Card className={className}>
      <CardHeader className="flex items-center justify-between space-y-0 px-4 ">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Contact Details</h3>
        </div>
        <div className="flex items-center gap-1">
          {onEdit ? (
            <Button
              size="icon"
              variant="outline"
              onClick={onEdit}
              aria-label="Edit contact"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              size="icon"
              variant="outline"
              onClick={onDelete}
              aria-label="Delete contact"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <InfoRow label="Full name" icon={<User2 className="h-4 w-4" />}>
          {empty(fullName)}
        </InfoRow>

        <InfoRow label="Relationship" icon={<Users2 className="h-4 w-4" />}>
          {empty("Family")}
        </InfoRow>

        <InfoRow label="Phone" icon={<Phone className="h-4 w-4" />}>
          {empty(phone)}
        </InfoRow>

        <InfoRow label="Email" icon={<Mail className="h-4 w-4" />}>
          {empty(email)}
        </InfoRow>

        <InfoRow label="Address" icon={<MapPin className="h-4 w-4" />}>
          {empty(address)}
        </InfoRow>

        <InfoRow label="Notes" icon={<NotebookText className="h-4 w-4" />}>
          {empty(notes)}
        </InfoRow>
        <InfoRow label="Tags" icon={<Tag className="h-4 w-4" />}>
          <TagBadges />
        </InfoRow>
      </CardContent>
    </Card>
  );
}
