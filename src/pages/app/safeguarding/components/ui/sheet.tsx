import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SheetForm } from "@/components/shared/sheet-form";
import { InfoCircle, QuoteUp } from "iconsax-react";
import { Card, CardContent } from "@/components/ui/card";

import {
  SafeguardingReport,
  SafeguardingReportAudit,
} from "@/types/safeguarding";
import { badgeStyles, formatStatus, statusStyles } from "../../utils";
import { Badge } from "@/components/ui/badge";
import { InfoRow } from "@/pages/app/clients/client/components/info-row";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuditLogUi from "./audit-log";
import SinglePageLoader from "@/components/loading/single-page-loader";
import dayjs from "@/lib/dayjs";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SafeguardingReport | undefined;
  isLoading?: boolean;
  openActionModal: (id: string, currentStatus: string) => void;
  isUpdating: boolean;
  auditLog: SafeguardingReportAudit[] | undefined;
};

export function SafeguardDetailsSheet({
  open,
  isUpdating,
  openActionModal,
  onOpenChange,
  item,
  isLoading,
  auditLog,
}: Props) {
  if (isLoading) return <SinglePageLoader />;
  if (!item) return null;

  return (
    <SheetForm
      footerExtra={
        <div className="flex items-center gap-4">
          <Button
            disabled={isLoading || isUpdating}
            onClick={() => openActionModal(item.id, item.status)}
          >
            Take Action <ChevronDown />
          </Button>
        </div>
      }
      open={open}
      onOpenChange={onOpenChange}
      title="Safeguarding Details"
      description=" "
      submitLabel=""
      submitDisabled
    >
      <div className="flex-1  py-2 space-y-4">
        {/* top row: status + actions */}
        <h4 className="font-bold">{item.title}</h4>
        <div className="flex items-start gap-4">
          <Badge
            variant="outline"
            className={`${badgeStyles[item.priority] ?? "bg-gray-100 text-gray-700"} rounded-full px-2 py-1 text-xs font-medium capitalize`}
          >
            {item.priority}
          </Badge>
          <Badge
            variant="outline"
            className={`${statusStyles[item.status] ?? "bg-gray-100 text-gray-700"} rounded-full px-2 py-1 text-xs font-medium capitalize`}
          >
            {formatStatus(item.status)}
          </Badge>
        </div>
        {/* title + meta */}

        {/* tabs */}
        <Tabs defaultValue="details" className="w-full">
          <div className="overflow-x-auto pb-4">
            <TabsList className=" justify-start rounded-none border-b bg-transparent p-0">
              {/* "audit", */}
              {["details", "audit"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="relative rounded-none capitalize border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  {tab === "details"
                    ? "details"
                    : tab[0].toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Details */}
          <TabsContent value="details">
            <div className="space-y-4">
              <Card>
                <CardContent className="space-y-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <InfoCircle size={18} color="#025134" />

                      <h3 className="font-medium text-sm">Event Details</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-12 ">
                    <InfoRow label="Client">
                      <span className="capitalize">
                        {item.client.firstname} {item.client.lastname}
                      </span>
                    </InfoRow>
                    <span></span>
                    <InfoRow label="Reported By">
                      <span className="capitalize">
                        {item.reportedBy.user.firstname}{" "}
                        {item.reportedBy.user.lastname}
                      </span>
                    </InfoRow>
                    <InfoRow label="Incident Type">
                      <span className="capitalize">
                        {item.incidentType || "-"}
                      </span>
                    </InfoRow>
                    <InfoRow label="Location">
                      <span>{item.location || "-"}</span>
                    </InfoRow>
                    <InfoRow label="Date & Time">
                      {item.incidentDateTime
                        ? dayjs(item.incidentDateTime).format(
                            "D MMM YYYY, hh:mm A",
                          )
                        : ""}
                    </InfoRow>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <QuoteUp
                        size={18}
                        color="#025134"
                        className="rotate-180"
                      />

                      <h3 className="font-medium text-sm">
                        Incident Description
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {item.description || "No description provided."}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <QuoteUp
                        size={18}
                        color="#025134"
                        className="rotate-180"
                      />

                      <h3 className="font-medium text-sm">Action Taken</h3>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {item.actionTaken || "No action taken ."}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <InfoCircle size={18} color="#025134" />

                      <h3 className="font-medium text-sm">Evidence</h3>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Avatar className="h-13 w-13 ring-2 ring-white shadow rounded-md">
                      <AvatarImage
                        src={item?.attachedEvidence?.[0]?.url || ""}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-base">
                        <Image />
                      </AvatarFallback>
                    </Avatar>

                    <div className="gap-1 flex flex-col">
                      <p className="font-medium text-sm">
                        {item?.attachedEvidence?.[0]?.filename ||
                          "No picture attached."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* GOALS */}
          <TabsContent value="audit">
            <AuditLogUi item={auditLog ?? []} />
          </TabsContent>
        </Tabs>
      </div>
    </SheetForm>
  );
}
