import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../components/info-row";
import { Button } from "@/components/ui/button";
import { MapIcon, MapPin, MapPinnedIcon, NotebookText } from "lucide-react";
import { EditIcon } from "@/assets/icons";
const Addresses = () => {
  return (
    <Card>
      <CardContent className="grid grid-cols-1  sm:grid-cols-2 gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-xl"> Address</h2>
          <p className=" text-sm text-muted-foreground">
            Clients primary’s address and additional ones
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
            <InfoRow label="Address" icon={<MapPin size={17.65} />}>
              25 Followup Drive, Thirlmere Drive, City , County, Postal Code,
              Country
            </InfoRow>
            <InfoRow
              label="Secure Check in (Location within)"
              icon={<MapPinnedIcon size={17.65} />}
            >
              459m
            </InfoRow>
            <InfoRow
              label="Access Details"
              icon={<NotebookText size={17.65} />}
            >
              Details of the access
            </InfoRow>
            <InfoRow label="Map" icon={<MapIcon size={17.65} />}>
              <span className="underline underline-offset-4 cursor-pointer">
                Show map
              </span>
            </InfoRow>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default Addresses;
