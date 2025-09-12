import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../components/info-row";
import { Button } from "@/components/ui/button";
import { CircleDashed, NotebookText } from "lucide-react";
import { EditIcon } from "@/assets/icons";
const WellbeingOverview = () => {
  return (
    <Card>
      <CardContent className="grid grid-cols-1  sm:grid-cols-2 gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-xl"> Wellbeing Overview</h2>
          <p className=" text-sm text-muted-foreground">
            A short introduction to help carers understand the person and their
            current health status behind the profile.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="gap-2">
              <EditIcon />
              Update
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <InfoRow label="Details" icon={<NotebookText size={17.65} />}>
              RESPIRATORY FAILURE ON 2 LITERS OF OXYGEN 24/7 ON NIV AT NIGHT
              DIFFICULT IN BREATHING
            </InfoRow>
            <InfoRow label="Risk Level" icon={<CircleDashed size={17.65} />}>
              <span className="bg-yellow-100 text-xs text-yellow-700  rounded-md px-2 py-1">
                Mid
              </span>
            </InfoRow>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default WellbeingOverview;
