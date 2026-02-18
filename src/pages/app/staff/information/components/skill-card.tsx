import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Edit, Trash } from "iconsax-react";
import { InfoRow } from "@/pages/app/clients/client/components/info-row";
import { StaffSkill } from "@/types/staff/skill";
import dayjs from "dayjs";

type Props = {
  skill: StaffSkill;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
};

export function SkillCard({ skill, onEdit, onDelete, className }: Props) {
  const { certificateUrl, skillName, note, expiredAt } = skill;

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
          <h3 className="text-sm font-semibold">Skill Details</h3>
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

      <CardContent>
        <InfoRow label="Skill name">{empty(skillName)}</InfoRow>

        {note && <InfoRow label="Notes">{empty(note || "")}</InfoRow>}

        {certificateUrl && (
          <InfoRow label="File">
            <a
              href={certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              View File
            </a>
          </InfoRow>
        )}

        {expiredAt && (
          <InfoRow label="Expiry Date">
            Expires{" "}
            <span className="capitalize">
              {expiredAt ? dayjs(expiredAt).format("MMM DD, YYYY") : "N/A"}
            </span>
          </InfoRow>
        )}
      </CardContent>
    </Card>
  );
}
