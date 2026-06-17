import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock3, ShieldAlert } from "lucide-react";
import { badgeStyles, formatStatus, statusStyles } from "../../utils";
import dayjs from "@/lib/dayjs";

export function AlertRow({
  item,
  openDetailSheet,
}: {
  item: {
    id: string;
    title: string;
    type:
      | "safeguarding-concern"
      | "incident"
      | "accident"
      | "near-miss"
      | "complaint"
      | "compliment"
      | "other";
    status: string;
    client: string;
    carer: string;
    description: string;
    time: string;
    priority: string;
    location: string;
  };

  openDetailSheet: (reportId: string) => void;
}) {
  return (
    <div className="flex gap-4 border-b px-4 py-5 last:border-b-0">
      <div className="w-1 rounded-full bg-red-500" />

      <div className="flex flex-1 items-start justify-between gap-4">
        <div className="flex  gap-3">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md border border-red-200 bg-red-50">
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </div>

          <div className="min-w-0">
            <div className="font-bold text-base">{item.title}</div>

            <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
              <div>
                <p className="text-muted-foreground">Client</p>
                <p className="font-medium text-foreground">{item.client}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">{item.location}</p>
              </div>
            </div>

            <div className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              {item.description}
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div className="capitalize flex items-center gap-1 text-[11px] text-muted-foreground">
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_5616_84928)">
                    <path
                      d="M7.5 1H3C2.73478 1 2.48043 1.10536 2.29289 1.29289C2.10536 1.48043 2 1.73478 2 2V10C2 10.2652 2.10536 10.5196 2.29289 10.7071C2.48043 10.8946 2.73478 11 3 11H9C9.26522 11 9.51957 10.8946 9.70711 10.7071C9.89464 10.5196 10 10.2652 10 10V3.5L7.5 1Z"
                      stroke="#62748E"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 1V3C7 3.26522 7.10536 3.51957 7.29289 3.70711C7.48043 3.89464 7.73478 4 8 4H10"
                      stroke="#62748E"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 4.5H4"
                      stroke="#62748E"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 6.5H4"
                      stroke="#62748E"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 8.5H4"
                      stroke="#62748E"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5616_84928">
                      <rect width={12} height={12} fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                {item.type}
              </div>
              <div className=" flex items-center gap-1 text-[11px] text-muted-foreground">
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5 10.5V9.5C9.5 8.96957 9.28929 8.46086 8.91421 8.08579C8.53914 7.71071 8.03043 7.5 7.5 7.5H4.5C3.96957 7.5 3.46086 7.71071 3.08579 8.08579C2.71071 8.46086 2.5 8.96957 2.5 9.5V10.5"
                    stroke="#62748E"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 5.5C7.10457 5.5 8 4.60457 8 3.5C8 2.39543 7.10457 1.5 6 1.5C4.89543 1.5 4 2.39543 4 3.5C4 4.60457 4.89543 5.5 6 5.5Z"
                    stroke="#62748E"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {item.carer}
              </div>
              <div className=" flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock3 className="h-3 w-3" stroke="#62748E" />
                {item.time
                  ? dayjs(item.time).format("D MMM YYYY, hh:mm A")
                  : ""}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Badge
            variant="outline"
            className={
              item.priority === "High"
                ? badgeStyles.high
                : item.priority === "Medium"
                  ? badgeStyles.medium
                  : badgeStyles.low
            }
          >
            {item.priority}
          </Badge>
          <Badge
            variant="outline"
            className={statusStyles[item.status] ?? "bg-gray-100 text-gray-700"}
          >
            {formatStatus(item.status)}
          </Badge>
          <div className="flex flex-row items-center justify-center h-40 ">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => openDetailSheet(item.id)}
              // disabled={isUpdating}
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
