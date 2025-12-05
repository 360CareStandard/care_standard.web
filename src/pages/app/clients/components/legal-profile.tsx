import { Card, CardContent } from "@/components/ui/card";
import { ClientLegalProfile } from "@/types/client/legal-profile";
import { InfoRow } from "../client/components/info-row";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface Props {
  data: ClientLegalProfile;
}

const BoolBadge = ({ value }: { value: boolean }) => (
  <span
    className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
      value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
    }`}
  >
    {value ? "Yes" : "No"}
  </span>
);

export const LegalProfile = ({ data }: Props) => {
  const formatDate = (d?: string | null) =>
    d ? dayjs(d).format("DD/MM/YYYY") : "-";

  const daysUntil = (d?: string | null) => {
    if (!d) return "-";
    const diff = dayjs(d).diff(dayjs(), "day");
    if (diff === 0) return "Today";
    if (diff > 0) return `${diff} day${diff > 1 ? "s" : ""} left`;
    return `${Math.abs(diff)} day${Math.abs(diff) > 1 ? "s" : ""} ago`;
  };

  const contactMethods = [
    data.contactConsentEmail ? "Email" : null,
    data.contactConsentSMS ? "SMS" : null,
    data.contactConsentPhone ? "Phone" : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg
                width={18}
                height={18}
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {" "}
                <path
                  d="M3.19531 8.26508V11.9926C3.19531 13.3576 3.19531 13.3576 4.48531 14.2276L8.03281 16.2751C8.56531 16.5826 9.43531 16.5826 9.96781 16.2751L13.5153 14.2276C14.8053 13.3576 14.8053 13.3576 14.8053 11.9926V8.26508C14.8053 6.90008 14.8053 6.90008 13.5153 6.03008L9.96781 3.98258C9.43531 3.67508 8.56531 3.67508 8.03281 3.98258L4.48531 6.03008C3.19531 6.90008 3.19531 6.90008 3.19531 8.26508Z"
                  stroke="#025134"
                  strokeWidth="0.9375"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />{" "}
                <path
                  d="M13.125 5.7225V3.75C13.125 2.25 12.375 1.5 10.875 1.5H7.125C5.625 1.5 4.875 2.25 4.875 3.75V5.67"
                  stroke="#025134"
                  strokeWidth="0.9375"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />{" "}
                <path
                  d="M9.47185 8.24125L9.89935 8.90875C9.96685 9.01375 10.1168 9.11875 10.2293 9.14875L10.9943 9.34375C11.4668 9.46375 11.5943 9.86875 11.2868 10.2438L10.7843 10.8513C10.7093 10.9488 10.6493 11.1213 10.6568 11.2413L10.7018 12.0288C10.7318 12.5163 10.3868 12.7638 9.93685 12.5838L9.20185 12.2913C9.08935 12.2463 8.90185 12.2463 8.78935 12.2913L8.05435 12.5838C7.60435 12.7638 7.25935 12.5088 7.28935 12.0288L7.33435 11.2413C7.34185 11.1213 7.28185 10.9413 7.20685 10.8513L6.70435 10.2438C6.39685 9.86875 6.52435 9.46375 6.99685 9.34375L7.76185 9.14875C7.88185 9.11875 8.03185 9.00625 8.09185 8.90875L8.51935 8.24125C8.78935 7.83625 9.20935 7.83625 9.47185 8.24125Z"
                  stroke="#025134"
                  strokeWidth="0.9375"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />{" "}
              </svg>
              <h3 className="font-semibold text-lg">
                Legal Status & Authorization
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Power of Attorney, mental capacity, and legal orders
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <InfoRow label="Power of Attorney">
              <div>
                <p className="capitalize">{data.powerOfAttorney || "-"}</p>
                {/* <p className="font-normal text-xs">
                  Holder: {data.poaHolderName || "-"}
                </p>
                <p className="font-normal text-xs">
                  Contact: {data.poaContact || "-"}
                </p>
                <p className="font-normal text-xs">
                  Valid from: {formatDate(data.poaValidFrom)}
                </p> */}
              </div>
            </InfoRow>

            <InfoRow label="DNAR Status">
              <div>
                <p>{data.dnarActive ? "Active" : "Not Active"}</p>
                <p className="font-normal text-xs">
                  Signed: {formatDate(data.dnarSignedDate)}
                </p>
                {/* {data.dnarReason ? (
                  <p className="font-normal text-xs">
                    Reason: {data.dnarReason}
                  </p>
                ) : null} */}
              </div>
            </InfoRow>

            <InfoRow label="Mental Capacity">
              <span className="capitalize"> {data.mentalCapacity || "-"}</span>
            </InfoRow>

            <InfoRow label="Legal Orders">
              <div>
                <div className="flex items-center gap-2">
                  <BoolBadge value={!!data.hasDoLS} />
                  <span className="text-xs">DoLS</span>
                  <BoolBadge value={!!data.hasLPS} />
                  <span className="text-xs">LPS</span>
                </div>

                {/* <p className="font-normal text-xs mt-1">
                  Court Order: {data.hasCourtOrder ? "Yes" : "No"}
                </p> */}

                {/* <p className="font-normal text-xs">
                  Guardianship: {data.hasGuardianship ? "Yes" : "No"}
                </p> */}

                <p className="font-normal text-xs">
                  Ref: {data.legalReferenceNumber || "-"}
                </p>
                {/* <p className="font-normal text-xs">
                  Authority: {data.legalResponsibleAuthority || "-"}
                </p>
                <p className="font-normal text-xs">
                  From: {formatDate(data.legalStartDate)} — To:{" "}
                  {formatDate(data.legalEndDate)}
                </p> */}
              </div>
            </InfoRow>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Grid - Consent & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Consent & Data Sharing */}
        <Card>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {" "}
                  <path
                    d="M7.86762 1.67242L4.12512 3.08242C3.26262 3.40492 2.55762 4.42492 2.55762 5.33992V10.9124C2.55762 11.7974 3.14262 12.9599 3.85512 13.4924L7.08012 15.8999C8.13762 16.6949 9.87762 16.6949 10.9351 15.8999L14.1601 13.4924C14.8726 12.9599 15.4576 11.7974 15.4576 10.9124V5.33992C15.4576 4.41742 14.7526 3.39742 13.8901 3.07492L10.1476 1.67242C9.51012 1.43992 8.49012 1.43992 7.86762 1.67242Z"
                    stroke="#025134"
                    strokeWidth="0.9375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                  <path
                    d="M9 9.375C9.82843 9.375 10.5 8.70343 10.5 7.875C10.5 7.04657 9.82843 6.375 9 6.375C8.17157 6.375 7.5 7.04657 7.5 7.875C7.5 8.70343 8.17157 9.375 9 9.375Z"
                    stroke="#025134"
                    strokeWidth="0.9375"
                    strokeMiterlimit={10}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                  <path
                    d="M9 9.375V11.625"
                    stroke="#025134"
                    strokeWidth="0.9375"
                    strokeMiterlimit={10}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </svg>
                <h3 className="font-semibold text-lg">
                  Consent & Data Sharing
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow label="Data Sharing Consent">
                <div>
                  <div className="flex items-center gap-2">
                    <BoolBadge value={!!data.dataSharingConsent} />
                    <span className="text-xs">
                      {data.dataSharingConsent ? "Consent given" : "No consent"}
                    </span>
                  </div>

                  <p className="font-normal text-xs my-1">
                    Date: {formatDate(data.dataSharingConsentDate)}
                  </p>
                  {/* <p className="font-normal text-xs">
                    Signed by: {data.dataSharingConsentSignedBy || "-"}
                  </p> */}
                  {data.dataSharingScope && (
                    <p className="font-normal text-xs">
                      Scope:
                      {data.dataSharingScope?.split(",").map((d, i) => (
                        <span
                          className="py-0.5 px-2 bg-gray-200 mx-1 text-xs rounded-full"
                          key={i}
                        >
                          {d}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </InfoRow>

              <InfoRow label="Photo / Media Consent">
                <div className="flex items-center gap-2">
                  <BoolBadge value={!!data.photoConsent} />

                  <span className="text-xs">
                    {data.photoConsent ? "Allowed" : "Not allowed"}
                  </span>
                </div>
                <p className="font-normal text-xs my-1">
                  Date: {formatDate(data.photoConsentDate)}
                </p>
              </InfoRow>

              <InfoRow label="Contact Methods">
                <div>
                  <p>{contactMethods || "None selected"}</p>
                  <p className="font-normal text-xs mt-1">
                    Family app access:{" "}
                    <BoolBadge value={!!data.familyAppPermission} />
                  </p>
                </div>
              </InfoRow>
            </div>
          </CardContent>
        </Card>

        {/* Documents & Review */}
        <Card>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.5 7.5V11.25C16.5 15 15 16.5 11.25 16.5H6.75C3 16.5 1.5 15 1.5 11.25V6.75C1.5 3 3 1.5 6.75 1.5H10.5"
                    stroke="#025134"
                    strokeWidth="0.9375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.5 7.5H13.5C11.25 7.5 10.5 6.75 10.5 4.5V1.5L16.5 7.5Z"
                    stroke="#025134"
                    strokeWidth="0.9375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.25 9.75H9.75"
                    stroke="#025134"
                    strokeWidth="0.9375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.25 12.75H8.25"
                    stroke="#025134"
                    strokeWidth="0.9375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <h3 className="font-semibold text-lg">Documents & Review</h3>
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow label="Uploaded Documents">
                <div>
                  {Array.isArray(data.legalDocuments) &&
                  data.legalDocuments.length > 0 ? (
                    <ul className="space-y-1">
                      {data.legalDocuments.map((doc: any, idx: number) => (
                        <li key={idx}>
                          <span className="font-medium">
                            {doc.name || `Document ${idx + 1}`}
                          </span>
                          {doc.date ? (
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({formatDate(doc.date)})
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No documents uploaded
                    </span>
                  )}
                </div>
              </InfoRow>

              <InfoRow label="Review Due">
                <div>
                  <p>
                    {formatDate(data.reviewDueDate)}{" "}
                    <span className="text-xs">
                      ( {daysUntil(data.reviewDueDate)})
                    </span>
                  </p>
                  {/* <p className="text-xs text-muted-foreground">
                   
                  </p> */}
                </div>
              </InfoRow>

              <InfoRow label="Responsible Person">
                <div>
                  <p>{data.responsiblePerson || "-"}</p>
                  {/* <p className="text-xs text-muted-foreground">
                    Status: {data.status || "unknown"}
                  </p> */}
                </div>
              </InfoRow>

              <InfoRow label="Notes / Summary">
                <div>
                  <p>{data.notesSummary || "-"}</p>
                  {/* <p className="text-xs text-muted-foreground mt-1">
                    Created: {formatDate(data.createdAt)} • Updated:{" "}
                    {formatDate(data.updatedAt)}
                  </p> */}
                </div>
              </InfoRow>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
