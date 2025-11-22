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
              <h3 className="font-semibold text-lg">Conditions & History</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Diagnosed medical conditions and clinical notes
            </p>
          </div>

          {/* Use InfoRow to present the diagnosed conditions + clinical notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <InfoRow label="Diagnosed Conditions">
              <div className="space-y-4">
                {data.diagnosedConditions &&
                data.diagnosedConditions.length > 0 ? (
                  data.diagnosedConditions.map((c, i) => (
                    <div key={i} className="space-y-1">
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Diagnosed: {formatDate(c.diagnosisDate)}
                      </p>
                      <p className="text-sm">{c.notes}</p>
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
                <div className="space-y-3">
                  {data.knownAllergies && data.knownAllergies.length > 0 ? (
                    data.knownAllergies.map((a, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="font-medium">{a.allergen}</p>
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {a.type}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${severityClasses(
                              a.severity
                            )}`}
                          >
                            {a.severity}
                          </span>
                        </div>
                        <p className="text-sm">{a.notes}</p>
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
                <h3 className="font-semibold text-lg">Clinical Risks</h3>
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow label="Overall Risk Level">
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-medium capitalize ${
                      data.overallRiskLevel === "high"
                        ? "bg-red-100 text-red-800"
                        : data.overallRiskLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {data.overallRiskLevel || "-"}
                  </span>
                </div>
              </InfoRow>

              <InfoRow label="Risk Categories">
                <div className="flex flex-wrap gap-2">
                  {data.riskCategories && data.riskCategories.length > 0 ? (
                    data.riskCategories.map((rc, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
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
