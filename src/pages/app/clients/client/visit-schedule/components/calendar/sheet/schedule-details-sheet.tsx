// pages/components/care-plan-details-sheet.tsx

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { SheetForm } from "@/components/shared/sheet-form";
import {
  Clock,
  Edit,
  Health,
  InfoCircle,
  People,
  TickCircle,
  Trash,
} from "iconsax-react";
import { VisitScheduleType } from "@/types/client/visit-schedule";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../../../../components/info-row";
import dayjs from "dayjs";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: VisitScheduleType | undefined;
  onEdit?: (schedule: VisitScheduleType) => void;
  onArchive?: (schedule: VisitScheduleType) => void;
  isLoadingDetails: boolean;
};

export function ScheduleDetailsSheet({
  open,
  onOpenChange,
  schedule,
  onEdit,
  onArchive,
  isLoadingDetails,
}: Props) {
  if (!schedule) return null;
  const startDateTime = dayjs(
    `${schedule.startDate}T${schedule.visitStartTime}`,
  );

  const endDateTime = dayjs(`${schedule.startDate}T${schedule.visitEndTime}`);
  return (
    <SheetForm
      open={open}
      onOpenChange={onOpenChange}
      title="Visit Details"
      description=" View client visit details"
      submitLabel=""
      submitDisabled
    >
      {isLoadingDetails ? (
        <div className="flex items-center justify-center h-48">
          <div className="p-6">
            <Skeleton className="h-6 w-1/3 mb-3" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
          {/* top row: status + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex space-x-2">
              <Button
                type="button"
                className={cn(
                  "bg-gray-100 capitalize rounded-full font-semibold text-gray-700 hover:bg-green-100",
                  schedule.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : schedule.status === "scheduled"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700",
                )}
                size="sm"
              >
                <Clock strokeWidth={4} />
                {schedule.status}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(schedule)}
              >
                <Edit />
                Update
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onArchive?.(schedule)}
              >
                <Trash />
                Delete
              </Button>
            </div>
          </div>

          {/* title + meta */}
          <div className="space-y-1">
            {/* <h2 className="text-xl font-semibold">{assessmentLabel}</h2> */}
            <p className="text-xs text-muted-foreground">
              {schedule.startDate
                ? `${dayjs(schedule.startDate).format("DD MMMM YYYY")} | 
       ${startDateTime.format("h:mm A")} - 
       ${endDateTime.format("h:mm A")} 
       (${schedule.duration} m)`
                : "No start date"}
            </p>
          </div>

          {/* tabs */}
          <Tabs defaultValue="overview">
            <div className="overflow-x-auto pb-4">
              <TabsList className=" justify-start rounded-none border-b bg-transparent p-0">
                {[
                  "overview",
                  "activities",
                  "attendance",
                  "notes & observations",
                  "audit",
                ].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    {tab === "overview"
                      ? "Overview"
                      : tab[0].toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* OVERVIEW */}
            <TabsContent value="overview">
              <div className="space-y-4">
                <Card>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <InfoCircle size={18} color="#025134" />

                        <h3 className="font-medium text-sm">
                          Visit Information
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 ">
                      <InfoRow label="Visit Type">
                        <span className="capitalize">
                          {schedule.scheduleType || "-"}
                        </span>
                      </InfoRow>
                      <InfoRow label="Duration">
                        {schedule.duration ? `${schedule.duration} mins` : "-"}
                      </InfoRow>
                      <InfoRow label="Repeat Pattern">
                        <span className="capitalize">
                          {schedule.visitFrequency || "-"}
                        </span>
                      </InfoRow>
                      <InfoRow label="Funding">
                        <span className="uppercase">
                          {schedule.fundingSource || "-"}
                        </span>
                      </InfoRow>
                      <InfoRow label="Start Date">
                        {schedule.startDate
                          ? dayjs(schedule.startDate).format("DD MMMM YYYY")
                          : "-"}
                      </InfoRow>
                      <InfoRow label="End Date">
                        {schedule.noEndDate
                          ? "No end date"
                          : schedule.endDate
                            ? dayjs(schedule.endDate).format("DD MMMM YYYY")
                            : "-"}
                      </InfoRow>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <People size={18} color="#025134" />

                        <h3 className="font-medium text-sm">Assigned Carers</h3>
                      </div>
                    </div>

                    {/* <div className="grid grid-cols-2 gap-x-12 ">
                      <InfoRow label="Visit Type">
                        <span className="capitalize">
                          {schedule.scheduleType || "-"}
                        </span>
                      </InfoRow>
                      <InfoRow label="Duration">
                        {schedule.duration ? `${schedule.duration} mins` : "-"}
                      </InfoRow>
                    </div> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Health size={18} color="#025134" />

                        <h3 className="font-medium text-sm">Required Skills</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 ">
                      <InfoRow label="">
                        {schedule.requiredSkills?.map((skill) => (
                          <span
                            key={skill}
                            className="capitalize bg-gray-200 px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        )) || "-"}
                      </InfoRow>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* GOALS */}
            <TabsContent value="activities">
              <div className="space-y-4">
                {schedule.activitiesRequired?.map((activities) => (
                  <Card key={activities}>
                    <CardContent className="space-y-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TickCircle size={18} color="#025134" />

                          <h3 className="font-medium text-sm">{activities}</h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TASKS */}
            <TabsContent value="tasks" className="mt-4">
              <div className="space-y-3"></div>
            </TabsContent>

            {/* AUDIT */}
            <TabsContent value="audit" className="mt-4">
              <div className="border rounded-2xl px-5 py-2 bg-white "></div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </SheetForm>
  );
}
