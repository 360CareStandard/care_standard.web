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
  Users2,
  Tag,
} from "lucide-react";
import { InfoRow } from "./info-row"; // <- your InfoRow from the prompt
import { ClientContact } from "@/types/client/contact";
import { Edit, Trash } from "iconsax-react";

type Props = {
  contact: ClientContact;
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
    contactName,
    contactPhone,
    contactEmail,
    contactAddress,
    notes,
    isPrimaryContact,
    isEmergencyContact,
    hasAppAccess,
    relationshipToClient,
  } = contact;

  const TagBadges = () => (
    <div className="flex flex-wrap gap-2 mt-1">
      {isPrimaryContact && (
        <Badge className="bg-green-100  text-green-600 rounded-full">
          Primary
        </Badge>
      )}
      {isEmergencyContact && (
        <Badge className="bg-red-100  text-red-600 rounded-full">
          Emergency
        </Badge>
      )}
      {hasAppAccess && (
        <Badge className="bg-gray-100  text-gray-600 rounded-full">
          App Access
        </Badge>
      )}
      {!isPrimaryContact && !isEmergencyContact && !hasAppAccess ? (
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
      <CardHeader className="flex items-center justify-between space-y-0 px-4 !py-0">
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
              <Edit size={20} color="#667185" />
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              size="icon"
              variant="outline"
              onClick={onDelete}
              aria-label="Delete contact"
            >
              <Trash color="#E26E6A" size={20} />
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="!p-0">
        <InfoRow label="Full name" icon={<User2 className="h-4 w-4" />}>
          {empty(contactName)}
        </InfoRow>

        <InfoRow label="Relationship" icon={<Users2 className="h-4 w-4" />}>
          <span className="capitalize"> {empty(relationshipToClient)}</span>
        </InfoRow>

        <InfoRow label="Phone" icon={<Phone className="h-4 w-4" />}>
          {empty(contactPhone)}
        </InfoRow>

        <InfoRow label="Email" icon={<Mail className="h-4 w-4" />}>
          {empty(contactEmail)}
        </InfoRow>

        <InfoRow label="Address" icon={<MapPin className="h-4 w-4" />}>
          {empty(contactAddress)}
        </InfoRow>

        {notes && (
          <InfoRow label="Notes" icon={<NotebookText className="h-4 w-4" />}>
            {empty(notes)}
          </InfoRow>
        )}
        <InfoRow label="Tags" icon={<Tag className="h-4 w-4" />}>
          <TagBadges />
        </InfoRow>
      </CardContent>
    </Card>
  );
}
