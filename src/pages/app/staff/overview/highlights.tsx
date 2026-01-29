import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditIcon } from "@/assets/icons";
import { InfoRow } from "../../clients/client/components/info-row";
import { Staff } from "@/types/staff";
import { NoteText } from "iconsax-react";

interface Props {
  personal: Staff | undefined;
  isLoading: boolean;
  openSheet: () => void;
}
const Highlights = ({ personal, isLoading, openSheet }: Props) => {
  return (
    <Card>
      <CardContent className="grid grid-cols-1  sm:grid-cols-2 gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-xl"> Highlights</h2>
          <p className=" text-sm text-muted-foreground">
            A short introduction to help understand the person behind the
            profile.
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
            <InfoRow label="Details" icon={<NoteText size={17.65} />}>
              {personal?.highlights}
            </InfoRow>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default Highlights;
