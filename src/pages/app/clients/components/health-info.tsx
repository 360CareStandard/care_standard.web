import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../client/components/info-row";
import { ClientHealthDetails } from "@/types/client/health";
import dayjs from "dayjs";

interface Props {
  data: ClientHealthDetails;
}

const formatDate = (d?: string | null) =>
  d ? dayjs(d).format("DD MMM YYYY") : "-";

const severityClasses = (s?: string) => {
  switch ((s || "").toLowerCase()) {
    case "severe":
      return "bg-red-100 text-red-800";
    case "moderate":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-green-100 text-green-800";
  }
};

export const HealthInfo = ({ data }: Props) => {
  return (
    <div className="space-y-6">
      {/* CONDITIONS & HISTORY */}
      <Card>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {/* keep your icon here if you want */}
              <HeartBeatIcon />

              <h3 className="font-semibold text-lg">Conditions & History</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Diagnosed medical conditions and clinical notes
            </p>
          </div>

          {/* Use InfoRow to present the diagnosed conditions + clinical notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 items-start">
            <InfoRow label="Diagnosed Conditions">
              <div className="space-y-4 mt-1">
                {data.diagnosedConditions &&
                data.diagnosedConditions.length > 0 ? (
                  data.diagnosedConditions.map((c, i) => (
                    <div key={i} className="space-y-1 flex items-start gap-1">
                      <HeartBeatIcon />
                      <div>
                        <p className="font-medium capitalize">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Diagnosed: {formatDate(c.diagnosisDate)}
                        </p>
                        <p className="text-sm">{c.notes}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No conditions recorded
                  </p>
                )}
              </div>
            </InfoRow>

            <InfoRow label="Clinical Notes">
              <div>
                <p className="text-sm">{data.clinicalNotes || "-"}</p>
              </div>
            </InfoRow>
          </div>
        </CardContent>
      </Card>

      {/* Bottom grid: Allergies & Clinical Risks (2 columns on md+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allergies Card */}
        <Card>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <WarningIcon />
                <h3 className="font-semibold text-lg">
                  Allergies & Intolerances
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Known allergies and reactions
              </p>
            </div>

            <div className="space-y-4">
              <InfoRow label="Allergies">
                <div className="space-y-3 mt-1">
                  {data.knownAllergies && data.knownAllergies.length > 0 ? (
                    data.knownAllergies.map((a, i) => (
                      <div key={i} className="space-y-1 flex gap-2 items-start">
                        <WarningIcon color="#DD524D" />
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="font-medium ">{a.allergen}</p>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                              {a.type}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${severityClasses(
                                a.severity
                              )}`}
                            >
                              {a.severity}
                            </span>
                          </div>
                          <p className="text-xs">{a.notes}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No allergies recorded
                    </p>
                  )}
                </div>
              </InfoRow>
            </div>
          </CardContent>
        </Card>

        {/* Clinical Risks Card */}
        <Card>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DangerIcon />
                <h3 className="font-semibold text-lg">Clinical Risks</h3>
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow label="Overall Risk Level">
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      data.overallRiskLevel === "high"
                        ? "bg-red-100 text-red-800"
                        : data.overallRiskLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    } `}
                  >
                    {data.overallRiskLevel || "-"} Risk
                  </span>
                </div>
              </InfoRow>

              <InfoRow label="Risk Categories">
                <div className="flex flex-wrap gap-2">
                  {data.riskCategories && data.riskCategories.length > 0 ? (
                    data.riskCategories.map((rc, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {rc}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </div>
              </InfoRow>

              <InfoRow label="Responsible Person">
                <div>
                  <p className="text-sm">{data.riskResponsiblePerson || "-"}</p>
                </div>
              </InfoRow>

              <InfoRow label="Mitigation Strategies">
                <div>
                  <p className="text-sm">{data.mitigationStrategies || "-"}</p>
                </div>
              </InfoRow>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const HeartBeatIcon = () => {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.72754 16.5H11.2275C14.9775 16.5 16.4775 15 16.4775 11.25V6.75C16.4775 3 14.9775 1.5 11.2275 1.5H6.72754C2.97754 1.5 1.47754 3 1.47754 6.75V11.25C1.47754 15 2.97754 16.5 6.72754 16.5Z"
        stroke="#025134"
        strokeWidth="0.9375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.47754 9.52508L5.97754 9.51008C6.54004 9.51008 7.17004 9.93758 7.38004 10.4626L8.23504 12.6226C8.43004 13.1101 8.73754 13.1101 8.93254 12.6226L10.65 8.26508C10.815 7.84508 11.1225 7.83008 11.3325 8.22758L12.1125 9.70508C12.345 10.1476 12.945 10.5076 13.44 10.5076H16.485"
        stroke="#025134"
        strokeWidth="0.9375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const WarningIcon = ({ color = "#025134" }) => {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 5.8125V9.75"
        stroke={color}
        strokeWidth="0.9375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8102 6.43503V11.565C15.8102 12.405 15.3601 13.185 14.6326 13.6125L10.1776 16.185C9.45014 16.605 8.55013 16.605 7.81512 16.185L3.36012 13.6125C2.63262 13.1925 2.18262 12.4125 2.18262 11.565V6.43503C2.18262 5.59503 2.63262 4.81499 3.36012 4.38749L7.81512 1.815C8.54263 1.395 9.44264 1.395 10.1776 1.815L14.6326 4.38749C15.3601 4.81499 15.8102 5.58753 15.8102 6.43503Z"
        stroke={color}
        strokeWidth="0.9375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12.1504V12.2254"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
const DangerIcon = () => {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 6.75V10.5"
        stroke="#025134"
        strokeWidth="0.9375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.00007 16.0584H4.45507C1.85257 16.0584 0.765072 14.1984 2.02507 11.9259L4.36507 7.71094L6.57007 3.75094C7.90507 1.34344 10.0951 1.34344 11.4301 3.75094L13.6351 7.71844L15.9751 11.9334C17.2351 14.2059 16.1401 16.0659 13.5451 16.0659H9.00007V16.0584Z"
        stroke="#025134"
        strokeWidth="0.9375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.99609 12.75H9.00283"
        stroke="#025134"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
