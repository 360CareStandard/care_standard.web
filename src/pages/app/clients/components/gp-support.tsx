import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../client/components/info-row";
import { ClientGPAndSupport } from "@/types/client/gp-support";
import dayjs from "dayjs";

interface Props {
  data: ClientGPAndSupport;
}

const formatDate = (d?: string | null) =>
  d ? dayjs(d).format("DD MMM YYYY") : "-";

export const GPSupportDetails = ({ data }: Props) => {
  const gp = data?.gpDetails;

  return (
    <div className="space-y-6">
      {/* GP Information - full width card */}
      <Card>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {/* Keep your icon here if desired */}
              <h3 className="font-semibold text-lg">GP Information</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Primary GP and practice details
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 ">
            <InfoRow label="GP Name">{gp?.gpName || "-"}</InfoRow>
            <InfoRow label="Practice">{gp?.practiceName || "-"}</InfoRow>
            <InfoRow label="Address">{gp?.practiceAddress || "-"}</InfoRow>

            <InfoRow label="Phone">{gp?.phone || "-"}</InfoRow>
            <InfoRow label="Email">{gp?.email || "-"}</InfoRow>
            <InfoRow label="Updated">{formatDate(data?.updatedAt)}</InfoRow>
          </div>
        </CardContent>
      </Card>

      {/* Other Healthcare Professionals - single full-width card with stacked entries */}
      <Card>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {/* Keep your icon here */}
              <h3 className="font-semibold text-lg">
                Other Healthcare Professionals
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Additional healthcare contacts and support professionals
            </p>
          </div>

          <div className="space-y-4">
            {data?.otherHealthcareProfessionals &&
            data.otherHealthcareProfessionals.length > 0 ? (
              data.otherHealthcareProfessionals.map((p, idx) => (
                <div key={idx} className="pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 ">
                    <InfoRow label="Role">
                      <p className="font-medium inline-flex items-center gap-2">
                        {p.role || "-"}
                        {/* small badge placeholder — add if you have a role badge component */}
                      </p>
                    </InfoRow>
                    {p.organisation ? (
                      <InfoRow label="Organisation">{p.organisation} </InfoRow>
                    ) : null}
                    <InfoRow label="Phone">{p.phone || "-"} </InfoRow>

                    <InfoRow label="Email">{p.email || "-"}</InfoRow>
                    <InfoRow label="Notes">{p.notes || "-"}</InfoRow>
                  </div>

                  {/* divider between entries (not after last) */}
                  {idx < data.otherHealthcareProfessionals.length - 1 && (
                    <div className="border-t border-muted my-2" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No additional healthcare professionals recorded
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
