import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../client/components/info-row";
import dayjs from "dayjs";
import { ClientHomeEnvironment } from "@/types/client/home-environment";

interface Props {
  data: ClientHomeEnvironment;
}

const formatDate = (d?: string | null) =>
  d ? dayjs(d).format("DD MMM YYYY") : "-";

export const HomeEnvironmentDetails = ({ data }: Props) => {
  const ls = data?.livingSituation;
  const access = data?.accessAndSecurity;
  const env = data?.environmentAndEquipment;

  return (
    <div className="space-y-6">
      {/* Consent & Data Sharing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ConsentIcon />
                <h3 className="font-semibold text-lg">
                  Consent &amp; Data Sharing
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Property and household information
              </p>
            </div>

            <div className="grid">
              <InfoRow label="Lives Alone">
                {typeof ls?.livesAlone === "boolean"
                  ? ls?.livesAlone
                    ? "Yes"
                    : "No"
                  : "-"}
              </InfoRow>

              <InfoRow label="Household Members">
                {ls?.householdMembers && ls.householdMembers.length > 0 ? (
                  <div className="flex flex-col">
                    {ls.householdMembers.map((m, idx) => (
                      <span key={idx} className="font-medium">
                        {m?.name ? m.name.trim() : "-"}
                        {m?.relationship ? ` (${m.relationship})` : ""}
                      </span>
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </InfoRow>

              <InfoRow label="Property Type">{ls?.propertyType || "-"}</InfoRow>
              <InfoRow label="Support Type">{ls?.supportType || "-"}</InfoRow>
              <InfoRow label="Updated">{formatDate(data?.updatedAt)}</InfoRow>
            </div>
          </CardContent>
        </Card>

        {/* Documents & Review */}
        <Card>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DocumentsIcon />
                <h3 className="font-semibold text-lg">
                  Documents &amp; Review
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Entry and security information
              </p>
            </div>

            <div className="grid ">
              <InfoRow label="Access Method">
                {access?.accessMethod || "-"}
              </InfoRow>

              <InfoRow label="Key Safe Code">
                {access?.keySafeCode ? "****" : "-"}
                {/* eye icon placeholder */}
                {access?.keySafeCode ? (
                  <button
                    type="button"
                    aria-label="Show key safe code"
                    className="ml-2 inline-flex items-center justify-center rounded-full w-6 h-6 border"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z"
                        stroke="#191D31"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#191D31"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : null}
              </InfoRow>

              <InfoRow label="Buzzer Code">
                {access?.buzzerCode ? "****" : "-"}
                {access?.buzzerCode ? (
                  <button
                    type="button"
                    aria-label="Show buzzer code"
                    className="ml-2 inline-flex items-center justify-center rounded-full w-6 h-6 border"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z"
                        stroke="#191D31"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#191D31"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : null}
              </InfoRow>

              <InfoRow label="Notes / Summary">
                {access?.specialAccessNotes || "-"}
              </InfoRow>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environment & Equipment */}
      <Card>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <EnvironmentIcon />
              <h3 className="font-semibold text-lg">
                Environment &amp; Equipment
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Equipment, pets, and safety considerations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
            <div>
              <InfoRow label="Equipment Present">
                {env?.equipmentPresent && env.equipmentPresent.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {env.equipmentPresent.map((eq, idx) => (
                      <span
                        key={idx}
                        className="inline-block text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-500"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </InfoRow>

              <InfoRow label="Equipment Present">
                {env?.equipmentPresent && env.equipmentPresent.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {/* duplicate label in screenshot — preserving pattern from reference */}
                    {env.equipmentPresent.map((eq, idx) => (
                      <span
                        key={`dup-${idx}`}
                        className="inline-block text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-500"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </InfoRow>
            </div>

            <div>
              <InfoRow label="Pets">{env?.pets || "-"}</InfoRow>

              <InfoRow label="Known Hazards">
                {env?.knownHazards && env.knownHazards.length > 0 ? (
                  <div className="flex flex-col">
                    <div className="flex flex-wrap gap-2">
                      {env.knownHazards.map((h, idx) => (
                        <span
                          key={idx}
                          className="inline-block text-xs px-2 py-1 rounded-full bg-red-50 text-red-500"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  "-"
                )}
              </InfoRow>

              <InfoRow label="Notes...">-</InfoRow>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ---------- Icons (inline, same approach as reference) ---------- */
const ConsentIcon = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.86992 8.1525C6.79492 8.145 6.70492 8.145 6.62242 8.1525C4.83742 8.0925 3.41992 6.63 3.41992 4.83C3.41992 2.9925 4.90492 1.5 6.74992 1.5C8.58742 1.5 10.0799 2.9925 10.0799 4.83C10.0724 6.63 8.65492 8.0925 6.86992 8.1525Z"
      stroke="#025134"
      strokeWidth="0.9375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.3075 3C13.7625 3 14.9325 4.1775 14.9325 5.625C14.9325 7.0425 13.8075 8.1975 12.405 8.25C12.345 8.2425 12.2775 8.2425 12.21 8.25"
      stroke="#025134"
      strokeWidth="0.9375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.12004 10.92C1.30504 12.135 1.30504 14.115 3.12004 15.3225C5.18254 16.7025 8.56504 16.7025 10.6275 15.3225C12.4425 14.1075 12.4425 12.1275 10.6275 10.92C8.57254 9.5475 5.19004 9.5475 3.12004 10.92Z"
      stroke="#025134"
      strokeWidth="0.9375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.7549 15C14.2949 14.8875 14.8049 14.67 15.2249 14.3475C16.3949 13.47 16.3949 12.0225 15.2249 11.145C14.8124 10.83 14.3099 10.62 13.7774 10.5"
      stroke="#025134"
      strokeWidth="0.9375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DocumentsIcon = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.8425 11.1977C13.2975 12.7352 11.085 13.2077 9.14249 12.6002L5.60999 16.1252C5.35499 16.3877 4.85249 16.5452 4.49249 16.4927L2.85749 16.2677C2.31749 16.1927 1.81499 15.6827 1.73249 15.1427L1.50749 13.5077C1.45499 13.1477 1.62749 12.6452 1.87499 12.3902L5.39999 8.86523C4.79999 6.91523 5.26499 4.70273 6.80999 3.16523C9.02249 0.952734 12.615 0.952734 14.835 3.16523C17.055 5.37773 17.055 8.98523 14.8425 11.1977Z"
      stroke="#025134"
      strokeWidth="0.9375"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.16748 13.1172L6.89248 14.8422"
      stroke="#025134"
      strokeWidth="0.9375"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.875 8.25C11.4963 8.25 12 7.74632 12 7.125C12 6.50368 11.4963 6 10.875 6C10.2537 6 9.75 6.50368 9.75 7.125C9.75 7.74632 10.2537 8.25 10.875 8.25Z"
      stroke="#025134"
      strokeWidth="0.9375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EnvironmentIcon = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z"
      stroke="#025134"
      strokeWidth="0.9375"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.5 9.6591V8.3391C1.5 7.5591 2.1375 6.9141 2.925 6.9141C4.2825 6.9141 4.8375 5.9541 4.155 4.7766C3.765 4.1016 3.9975 3.2241 4.68 2.8341L5.9775 2.0916C6.57 1.7391 7.335 1.9491 7.6875 2.5416L7.77 2.6841C8.445 3.8616 9.555 3.8616 10.2375 2.6841L10.32 2.5416C10.6725 1.9491 11.4375 1.7391 12.03 2.0916L13.3275 2.8341C14.01 3.2241 14.2425 4.1016 13.8525 4.7766C13.17 5.9541 13.725 6.9141 15.0825 6.9141C15.8625 6.9141 16.5075 7.5516 16.5075 8.3391V9.6591C16.5075 10.4391 15.87 11.0841 15.0825 11.0841C13.725 11.0841 13.17 12.0441 13.8525 13.2216C14.2425 13.9041 14.01 14.7741 13.3275 15.1641L12.03 15.9066C11.4375 16.2591 10.6725 16.0491 10.32 15.4566L10.2375 15.3141C9.5625 14.1366 8.4525 14.1366 7.77 15.3141L7.6875 15.4566C7.335 16.0491 6.57 16.2591 5.9775 15.9066L4.68 15.1641C3.9975 14.7741 3.765 13.8966 4.155 13.2216C4.8375 12.0441 4.2825 11.0841 2.925 11.0841C2.1375 11.0841 1.5 10.4391 1.5 9.6591Z"
      stroke="#025134"
      strokeWidth="0.9375"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- Uploaded screenshot path (transform to URL on your side) ---------- */
/* use this path as the file url for the Figma/UI image when needed:
   /mnt/data/Screenshot 2025-11-25 at 10.27.42 PM.png
*/
