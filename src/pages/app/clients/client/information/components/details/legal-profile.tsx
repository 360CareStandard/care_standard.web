import { Card, CardContent } from "@/components/ui/card";
import { ClientLegalProfile } from "@/types/client/legal-profile";
import { InfoRow } from "../../../components/info-row";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Award, DocumentText, Eye, ShieldSecurity } from "iconsax-react";
import { Button } from "@/components/ui/button";
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
              <Award size={18} color="#025134" />

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
                <ShieldSecurity size={18} color="#025134" />

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
                <DocumentText size={18} color="#025134" />

                <h3 className="font-semibold text-lg">Documents & Review</h3>
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow label="Uploaded Documents">
                <div>
                  {Array.isArray(data.legalDocuments) &&
                  data.legalDocuments.length > 0 ? (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {data.legalDocuments.length} FIle
                        {data.legalDocuments.length > 1 ? "s" : ""}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 rounded-full text-xs"
                      >
                        <Eye size={12} /> View All
                      </Button>
                    </div>
                  ) : (
                    // <ul className="space-y-1">
                    //   {data.legalDocuments.map((doc: any, idx: number) => (
                    //     <li key={idx}>
                    //       <span className="font-medium">
                    //         {doc.name || `Document ${idx + 1}`}
                    //       </span>
                    //       {doc.date ? (
                    //         <span className="ml-2 text-xs text-muted-foreground">
                    //           ({formatDate(doc.date)})
                    //         </span>
                    //       ) : null}
                    //     </li>
                    //   ))}
                    // </ul>
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
