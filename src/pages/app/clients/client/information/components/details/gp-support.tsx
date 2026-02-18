import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../../../components/info-row";
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
              <SethICon />
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
              <UsersICon />
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
                <div key={idx}>
                  <div className="grid grid-cols-1 md:grid-cols-2 ">
                    <InfoRow label="Name">
                      <p className="font-medium inline-flex items-center gap-2">
                        {p.name || "-"}
                      </p>
                    </InfoRow>
                    <InfoRow label="Role">
                      <p className="font-medium inline-flex items-center gap-2">
                        {p.role || "-"}
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
                    <hr className="w-full my-2" />
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

const SethICon = () => {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.3083 18C8.73531 18 7.39543 17.4507 6.28869 16.3522C5.18194 15.2537 4.62857 13.9173 4.62857 12.3429V11.8111C3.32571 11.6897 2.22857 11.1411 1.33714 10.1654C0.445715 9.19097 0 8.03109 0 6.68571V1.02857H3.08571V0H4.11429V3.08571H3.08571V2.05714H1.02857V6.68571C1.02857 7.81714 1.43143 8.78571 2.23714 9.59143C3.04286 10.3971 4.01143 10.8 5.14286 10.8C6.27429 10.8 7.24286 10.3971 8.04857 9.59143C8.85429 8.78571 9.25714 7.81714 9.25714 6.68571V2.05714H7.2V3.08571H6.17143V0H7.2V1.02857H10.2857V6.68571C10.2857 8.03109 9.84 9.19131 8.94857 10.1664C8.05714 11.1415 6.96 11.6897 5.65714 11.8111V12.3429C5.65714 13.6286 6.10903 14.7216 7.0128 15.6219C7.91794 16.5216 9.01612 16.9714 10.3073 16.9714C11.593 16.9714 12.6857 16.5216 13.5854 15.6219C14.485 14.7223 14.9352 13.6293 14.9359 12.3429V10.7383C14.4545 10.6251 14.0571 10.3721 13.7438 9.9792C13.4304 9.58629 13.2737 9.1344 13.2737 8.62354C13.2737 8.02011 13.4856 7.50651 13.9094 7.08274C14.3331 6.65966 14.8474 6.44811 15.4522 6.44811C16.057 6.44811 16.5706 6.65966 16.993 7.08274C17.4154 7.50583 17.6263 8.01977 17.6256 8.62457C17.6256 9.13474 17.4689 9.58629 17.1555 9.9792C16.8429 10.3721 16.4458 10.6255 15.9645 10.7393V12.3429C15.9645 13.9173 15.4152 15.2537 14.3167 16.3522C13.2182 17.4507 11.8821 18 10.3083 18Z"
        fill="#025134"
      />
    </svg>
  );
};
const UsersICon = () => {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.86992 8.1525C6.79492 8.145 6.70492 8.145 6.62242 8.1525C4.83742 8.0925 3.41992 6.63 3.41992 4.83C3.41992 2.9925 4.90492 1.5 6.74992 1.5C8.58742 1.5 10.0799 2.9925 10.0799 4.83C10.0724 6.63 8.65492 8.0925 6.86992 8.1525Z"
        stroke="#191D31"
        strokeWidth="0.9375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.3075 3C13.7625 3 14.9325 4.1775 14.9325 5.625C14.9325 7.0425 13.8075 8.1975 12.405 8.25C12.345 8.2425 12.2775 8.2425 12.21 8.25"
        stroke="#191D31"
        strokeWidth="0.9375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.12004 10.92C1.30504 12.135 1.30504 14.115 3.12004 15.3225C5.18254 16.7025 8.56504 16.7025 10.6275 15.3225C12.4425 14.1075 12.4425 12.1275 10.6275 10.92C8.57254 9.5475 5.19004 9.5475 3.12004 10.92Z"
        stroke="#191D31"
        strokeWidth="0.9375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.7549 15C14.2949 14.8875 14.8049 14.67 15.2249 14.3475C16.3949 13.47 16.3949 12.0225 15.2249 11.145C14.8124 10.83 14.3099 10.62 13.7774 10.5"
        stroke="#191D31"
        strokeWidth="0.9375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
