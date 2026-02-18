import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../components/info-row";
import { Button } from "@/components/ui/button";
import { CircleDashed, NotebookText } from "lucide-react";
import { EditIcon } from "@/assets/icons";
import { Client } from "@/types/client/client";
import { cn } from "@/lib/utils";
import { riskColorMap } from "@/helpers/risk-colors";

interface Props {
  personal: Client | undefined;
  isLoading: boolean;
  openSheet: () => void;
}

const WellbeingOverview = ({ personal, openSheet }: Props) => {
  // Normalize the riskLevel string (e.g., "High" → "high")
  const riskLevel = personal?.riskLevel?.toLowerCase();
  const riskStyle =
    riskLevel && riskColorMap[riskLevel]
      ? riskColorMap[riskLevel]
      : { bg: "bg-gray-100", text: "text-gray-600" };

  return (
    <Card>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-xl">Wellbeing Overview</h2>
          <p className="text-sm text-muted-foreground">
            A short introduction to help carers understand the person and their
            current health status behind the profile.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={openSheet}
            >
              <EditIcon />
              Update
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <InfoRow label="Details" icon={<NotebookText size={17.65} />}>
              {personal?.wellbeingDetails || "—"}
            </InfoRow>

            <InfoRow label="Risk Level" icon={<CircleDashed size={17.65} />}>
              <span
                className={cn(
                  "text-xs font-medium rounded-md px-2 py-1 capitalize",
                  riskStyle.bg,
                  riskStyle.text,
                )}
              >
                {riskLevel || "Unknown"}
              </span>
            </InfoRow>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default WellbeingOverview;
