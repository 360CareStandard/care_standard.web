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
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.16675 1.66699H7.50008C3.33341 1.66699 1.66675 3.33366 1.66675 7.50033V12.5003C1.66675 16.667 3.33341 18.3337 7.50008 18.3337H12.5001C16.6667 18.3337 18.3334 16.667 18.3334 12.5003V10.8337"
                  stroke="#667185"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.3666 2.51639L6.7999 9.08306C6.5499 9.33306 6.2999 9.82472 6.2499 10.1831L5.89157 12.6914C5.75823 13.5997 6.3999 14.2331 7.30823 14.1081L9.81657 13.7497C10.1666 13.6997 10.6582 13.4497 10.9166 13.1997L17.4832 6.63306C18.6166 5.49972 19.1499 4.18306 17.4832 2.51639C15.8166 0.849722 14.4999 1.38306 13.3666 2.51639Z"
                  stroke="#667185"
                  strokeWidth="1.5"
                  strokeMiterlimit={10}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.425 3.45801C12.9834 5.44967 14.5417 7.00801 16.5417 7.57467"
                  stroke="#667185"
                  strokeWidth="1.5"
                  strokeMiterlimit={10}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              size="icon"
              variant="outline"
              onClick={onDelete}
              aria-label="Delete contact"
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.5 4.98307C14.725 4.70807 11.9333 4.56641 9.15 4.56641C7.5 4.56641 5.85 4.64974 4.2 4.81641L2.5 4.98307"
                  stroke="#E26E6A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.08325 4.14199L7.26659 3.05033C7.39992 2.25866 7.49992 1.66699 8.90825 1.66699H11.0916C12.4999 1.66699 12.6083 2.29199 12.7333 3.05866L12.9166 4.14199"
                  stroke="#E26E6A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.7084 7.61621L15.1667 16.0079C15.0751 17.3162 15.0001 18.3329 12.6751 18.3329H7.32508C5.00008 18.3329 4.92508 17.3162 4.83341 16.0079L4.29175 7.61621"
                  stroke="#E26E6A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.6084 13.75H11.3834"
                  stroke="#E26E6A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.91675 10.417H12.0834"
                  stroke="#E26E6A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="!p-0">
        <InfoRow label="Full name" icon={<User2 className="h-4 w-4" />}>
          {empty(contactName)}
        </InfoRow>

        <InfoRow label="Relationship" icon={<Users2 className="h-4 w-4" />}>
          {empty(relationshipToClient)}
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
