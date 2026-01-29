import { Card, CardContent } from "@/components/ui/card";

import { InfoRow } from "@/pages/app/clients/client/components/info-row";
import { employmentDetails } from "@/types/staff/employment";
import dayjs from "dayjs";

interface Props {
  data: employmentDetails;
}

export const EmploymentDetails = ({ data }: Props) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4 items-baseline">
            <InfoRow label="Start Date">
              {dayjs(data.startDate).format("DD MMMM YYYY ") || "-"}
            </InfoRow>
            <InfoRow label="Weekly  Hours">
              {data.weeklyContractedHours || "-"}
            </InfoRow>
            <InfoRow label="Type">{data.employmentType || "-"}</InfoRow>
            <InfoRow label="Terminated">
              {data.status === "terminated" ? "Yes" : "-"}
            </InfoRow>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
