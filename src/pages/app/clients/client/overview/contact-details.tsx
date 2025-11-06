import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../components/info-row";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { EditIcon } from "@/assets/icons";
import { Client } from "@/types/client/client";
import { UkFlagIcon } from "../icons/uk-flag";

interface Props {
  personal: Client | undefined;
  isLoading: boolean;
}
const ContactDetails = ({ personal }: Props) => {
  return (
    <Card>
      <CardContent className="grid grid-cols-1  sm:grid-cols-2 gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-xl"> Contact Details</h2>
          <p className=" text-sm text-muted-foreground">
            Clients contact details
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2">
              <EditIcon />
              Update
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <InfoRow
              label="Primary Phone number"
              icon={<Phone size={17.65} />}
              className="flex gap-2 items-center py-1"
            >
              <UkFlagIcon /> {personal?.phone}{" "}
              <span className="text-muted-foreground">
                {personal?.phoneType}
              </span>
            </InfoRow>
            {personal?.secondaryPhone && (
              <InfoRow
                label="Additional Phone number"
                icon={<Phone size={17.65} />}
                className="flex gap-2 items-center py-1"
              >
                <UkFlagIcon /> {personal?.secondaryPhone}{" "}
                <span className="text-muted-foreground">
                  {personal?.secondaryPhoneType}
                </span>
              </InfoRow>
            )}
            <InfoRow label="Email Address" icon={<Mail size={17.65} />}>
              <a href={`mailto:${personal?.email}`} className="hover:underline">
                {personal?.email}
              </a>
            </InfoRow>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ContactDetails;
