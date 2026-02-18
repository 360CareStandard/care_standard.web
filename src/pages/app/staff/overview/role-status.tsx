import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditIcon } from "@/assets/icons";
import { InfoRow } from "../../clients/client/components/info-row";
import { Staff } from "@/types/staff";
import { ShieldTick, Ship, Status } from "iconsax-react";
import { cn } from "@/lib/utils";

interface Props {
  personal: Staff | undefined;
  isLoading: boolean;
  openSheet: () => void;
}
const RoleStatus = ({ personal, isLoading, openSheet }: Props) => {
  return (
    <Card>
      <CardContent className="grid grid-cols-1  sm:grid-cols-2 gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-xl"> Role & Status</h2>
          <p className=" text-sm text-muted-foreground">
            Staff role, employment status
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              disabled={isLoading}
              onClick={openSheet}
            >
              <EditIcon />
              Update
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <InfoRow label="Role" icon={<Ship size={17.65} />}>
              <span className="capitalize">{personal?.staffRole}</span>
            </InfoRow>

            <InfoRow label="Status" icon={<Status size={17.65} />}>
              <span
                className={cn(
                  "rounded-full  py-0.5 text-xs capitalize",
                  personal?.status === "active" && " text-primary",
                  personal?.status === "paused" && " text-destructive",
                  personal?.status === "inactive" && " text-neutral-700",
                )}
              >
                {personal?.status ?? "—"}
              </span>
            </InfoRow>
            <InfoRow label="Admin" icon={<ShieldTick size={17.65} />}>
              {personal?.adminAccessLevel ? "Yes" : "No"}
            </InfoRow>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default RoleStatus;
