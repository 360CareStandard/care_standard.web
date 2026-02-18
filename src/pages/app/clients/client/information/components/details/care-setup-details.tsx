import { Card, CardContent } from "@/components/ui/card";
import { ClientClientCarePlan } from "@/types/client/care-setup";
import { InfoRow } from "../../../components/info-row";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // 👈 import the plugin
import { User } from "iconsax-react";
dayjs.extend(utc); // 👈 register the plugin before using it

interface Props {
  data: ClientClientCarePlan;
}

export const CareSetupDetails = ({ data }: Props) => {
  const plan = data;

  return (
    <div className="space-y-6">
      {/* Service Package Section */}
      <Card>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="font-semibold text-lg">Service Package</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Care package details and visit configuration
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <InfoRow label="Package Type">{plan.carePlan?.name || "-"}</InfoRow>
            <InfoRow label="Visit Duration Presets">
              {plan.visitDurationPreset || "-"} Min
            </InfoRow>
            <InfoRow label="Start Date">
              {plan.startDate
                ? new Date(plan.startDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-"}
            </InfoRow>
            <InfoRow label="Double-up Visits">
              {plan.doubleUpVisitRequired
                ? "Required (2 carers)"
                : "Not required"}
            </InfoRow>
            <InfoRow label="Authorised Hours">
              {plan.authorisedHoursPerWeek
                ? `${plan.authorisedHoursPerWeek} hours per week`
                : "-"}
            </InfoRow>
            <InfoRow label="Overnight Care">
              {plan.overnightCareRequired
                ? `${
                    plan.overnightCareType === "sleep-in"
                      ? "Sleep-in"
                      : "Waking night"
                  } (${
                    dayjs(`1970-01-01T${plan.overnightCareStartTime}`).format(
                      "hh:mm A",
                    ) || "-"
                  } - ${
                    dayjs(`1970-01-01T${plan.overnightCareEndTime}`).format(
                      "hh:mm A",
                    ) || "-"
                  })`
                : "-"}
            </InfoRow>
          </div>
        </CardContent>
      </Card>

      {/* Scheduling Preferences Section */}
      <Card>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-semibold text-lg">Scheduling Preferences</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Carer preferences and timing requirement
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <InfoRow label="Time Windows">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                  {plan.visitPeriodPreset || "Not set"}
                </span>
                {/* <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                  Evening
                </span> */}
              </div>
            </InfoRow>

            <InfoRow label="Preferred Carers">
              {plan.preferredCarersDetails &&
              plan.preferredCarersDetails.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {plan.preferredCarersDetails.map((carer, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                    >
                      <User size={12} className="inline-block mr-1" />
                      {`${carer.user.firstname} ${carer.user.lastname}` ||
                        carer.preferredName}
                    </span>
                  ))}
                </div>
              ) : (
                "Not set"
              )}
            </InfoRow>

            <InfoRow label="Continuity Priority">
              {plan.continuityPriority ? "Prioritised" : "Not prioritised"}
            </InfoRow>

            <InfoRow label="Avoid Carers">
              {plan.avoidedCarersDetails &&
              plan.avoidedCarersDetails.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {plan.avoidedCarersDetails.map((carer, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full"
                    >
                      <User size={12} className="inline-block mr-1" />
                      {`${carer.user.firstname} ${carer.user.lastname}` ||
                        carer.preferredName}
                    </span>
                  ))}
                </div>
              ) : (
                "Not set"
              )}
            </InfoRow>

            <InfoRow label="Language Requirement">
              {plan.languageRequirements?.join(", ") || "—"}
            </InfoRow>

            <InfoRow label="Required Skills">
              {plan.requiredSkills && plan.requiredSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {plan.requiredSkills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <>Not set</>
              )}
            </InfoRow>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Grid - Funding and Safety */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Funding Section */}
        <Card>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <h3 className="font-semibold text-lg">
                  Funding & Authorization
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow label="Funding Source">
                <span className="uppercase">{plan.fundingSource || "-"}</span>
              </InfoRow>

              <InfoRow label="Funder/Council/ICB">{plan.funder || "-"}</InfoRow>

              <InfoRow label="Authorisation/Reference Number">
                {plan.authorizationNumber || "-"}
              </InfoRow>

              <InfoRow label="Budget Cap/Rate Plan">
                £{plan.budgetCap || 0}/week
              </InfoRow>
            </div>
          </CardContent>
        </Card>

        {/* Safety Section */}
        <Card>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <h3 className="font-semibold text-lg">Safety & Check-in</h3>
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow label="Check-in Method">
                <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded uppercase">
                  {plan.checkInMethod || "Not set"}
                </span>
              </InfoRow>

              <InfoRow label="Late Visit Alert">
                {plan.lateVisitAlertThreshold || 0} minutes
              </InfoRow>

              <InfoRow label="Escalation Contact">
                {plan.escalationContact || "-"}
              </InfoRow>

              <InfoRow label="Lone Worker Alert">
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                    plan.loneWorkerAlertEnabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {plan.loneWorkerAlertEnabled ? "Enabled" : "Disabled"}
                </span>
              </InfoRow>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
