import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { Medication } from "@/types/client/medication";

interface Props {
  medication: Medication;
  onView: (medication: Medication) => void;
  onEdit: (m: Medication) => void;
}

export function MedicationCard({ medication, onView, onEdit }: Props) {
  const isStopped = medication.stoppedAt !== null;

  const statusLabel = isStopped
    ? "Stopped"
    : medication.status === "discontinued"
    ? "Archived"
    : "Active";

  return (
    <Card
      className="cursor-pointer hover:shadow-sm transition"
      onClick={() => onView(medication)}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{medication.medicationName}</h4>
            <p className="text-xs text-muted-foreground">
              {medication.dosage} • {medication.route}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(medication);
            }}
            className="text-xs text-primary"
          >
            Edit
          </button>

          <Badge
            variant={
              statusLabel === "Active"
                ? "default"
                : statusLabel === "Stopped"
                ? "destructive"
                : "secondary"
            }
          >
            {statusLabel}
          </Badge>
        </div>

        <div className="text-sm">
          <p>
            <span className="text-muted-foreground">Frequency:</span>{" "}
            {medication.frequency}
          </p>
          <p>
            <span className="text-muted-foreground">Prescriber:</span>{" "}
            {medication.prescriberName}
          </p>
        </div>

        <div className="flex justify-end">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
