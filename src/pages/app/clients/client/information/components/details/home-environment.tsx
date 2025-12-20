import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../../../components/info-row";
import dayjs from "dayjs";
import { ClientHomeEnvironment } from "@/types/client/home-environment";
import { Eye, EyeSlash, Key, Profile2User, Setting2 } from "iconsax-react";
import { Button } from "@/components/ui/button";
import React from "react";

interface Props {
  data: ClientHomeEnvironment;
}

const formatDate = (d?: string | null) =>
  d ? dayjs(d).format("DD MMM YYYY") : "-";

export const HomeEnvironmentDetails = ({ data }: Props) => {
  const ls = data?.livingSituation;
  const access = data?.accessAndSecurity;
  const env = data?.environmentAndEquipment;
  const [showKeySafe, setShowKeySafe] = React.useState(false);
  const [showBuzzer, setShowBuzzer] = React.useState(false);
  React.useEffect(() => {
    if (!showKeySafe) return;
    const t = setTimeout(() => setShowKeySafe(false), 10_000);
    return () => clearTimeout(t);
  }, [showKeySafe]);

  React.useEffect(() => {
    if (!showBuzzer) return;
    const t = setTimeout(() => setShowBuzzer(false), 10_000);
    return () => clearTimeout(t);
  }, [showBuzzer]);

  return (
    <div className="space-y-6">
      {/* Consent & Data Sharing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Profile2User color="#025134" size={18} />
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
                <span className="bg-black text-white px-2 py-1 rounded-full">
                  {typeof ls?.livesAlone === "boolean"
                    ? ls?.livesAlone
                      ? "Yes"
                      : "No"
                    : "-"}
                </span>
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
                <Key color="#025134" size={18} />
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
                <div className="flex items-center gap-2">
                  <span className="font-mono">
                    {access?.keySafeCode
                      ? showKeySafe
                        ? access.keySafeCode
                        : "****"
                      : "-"}
                  </span>

                  {access?.keySafeCode && (
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label={
                        showKeySafe
                          ? "Hide key safe code"
                          : "Show key safe code"
                      }
                      onClick={() => setShowKeySafe((v) => !v)}
                      className="rounded-full w-6 h-6"
                    >
                      {showKeySafe ? <EyeSlash size={12} /> : <Eye size={12} />}
                    </Button>
                  )}
                </div>
              </InfoRow>

              <InfoRow label="Buzzer Code">
                <div className="flex items-center gap-2">
                  <span className="font-mono">
                    {access?.buzzerCode
                      ? showBuzzer
                        ? access.buzzerCode
                        : "****"
                      : "-"}
                  </span>

                  {access?.buzzerCode && (
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label={
                        showBuzzer ? "Hide buzzer code" : "Show buzzer code"
                      }
                      onClick={() => setShowBuzzer((v) => !v)}
                      className="rounded-full w-6 h-6"
                    >
                      {showBuzzer ? <EyeSlash size={12} /> : <Eye size={12} />}
                    </Button>
                  )}
                </div>
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
              <Setting2 color="#025134" size={18} />
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
