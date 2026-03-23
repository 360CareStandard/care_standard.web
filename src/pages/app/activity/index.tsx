import React from "react";
import { useSearchParams } from "react-router-dom";
import {
  CalendarClock,
  ChevronDown,
  ChevronRight,
  Clock3,
  Filter,
  ShieldAlert,
  UserCog,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/layouts/main";

const TAB_KEYS = ["alert", "care-logs", "system"] as const;
type TabKey = (typeof TAB_KEYS)[number];

type SortOption = "recently-created" | "first-created" | "last-30-days";

type AlertPriority = "High" | "Medium" | "Info";
type CareLogStatus = "Completed" | "Missed";

type AlertItem = {
  id: string;
  type: "alert";
  title: string;
  client: string;
  carer: string;
  description: string;
  time: string;
  priority: AlertPriority;
};

type CareLogItem = {
  id: string;
  type: "care-log";
  title: string;
  client: string;
  carer: string;
  time: string;
  status: CareLogStatus;
};

type SystemItem = {
  id: string;
  type: "system";
  title: string;
  staff: string;
  description: string;
  time: string;
  actor: string;
};

const alertData: AlertItem[] = [
  {
    id: "a1",
    type: "alert",
    title: "Alert Title",
    client: "Michael Brown",
    carer: "Temiloluwa Samuel",
    description: "Description",
    time: "24 February, 14:22",
    priority: "Info",
  },
  {
    id: "a2",
    type: "alert",
    title: "Incident Reported",
    client: "Michael Brown",
    carer: "Temiloluwa Samuel",
    description: "Minor fall in bathroom. Client uninjured, GP notified.",
    time: "24 February, 14:22",
    priority: "High",
  },
  {
    id: "a3",
    type: "alert",
    title: "Alert Title",
    client: "Michael Brown",
    carer: "Temiloluwa Samuel",
    description: "Description",
    time: "24 February, 14:22",
    priority: "Medium",
  },
];

const careLogData: CareLogItem[] = [
  {
    id: "c1",
    type: "care-log",
    title: "Visit Completed",
    client: "Michael Brown",
    carer: "Temiloluwa Samuel",
    time: "Today, 14:22",
    status: "Completed",
  },
  {
    id: "c2",
    type: "care-log",
    title: "Visit Missed",
    client: "Michael Brown",
    carer: "Temiloluwa Samuel",
    time: "Today, 14:22",
    status: "Missed",
  },
  {
    id: "c3",
    type: "care-log",
    title: "Visit Completed",
    client: "Michael Brown",
    carer: "Temiloluwa Samuel",
    time: "Today, 14:22",
    status: "Completed",
  },
  {
    id: "c4",
    type: "care-log",
    title: "Visit Missed",
    client: "Michael Brown",
    carer: "Temiloluwa Samuel",
    time: "Today, 14:22",
    status: "Missed",
  },
];

const systemData: SystemItem[] = [
  {
    id: "s1",
    type: "system",
    title: "Permission Updated",
    staff: "Daniel Samuel",
    description: "Role changed from Carer to Admin",
    time: "24 February, 14:22",
    actor: "Temiloluwa Samuel",
  },
  {
    id: "s2",
    type: "system",
    title: "Permission Updated",
    staff: "Daniel Samuel",
    description: "Role changed from Carer to Admin",
    time: "24 February, 14:22",
    actor: "Temiloluwa Samuel",
  },
  {
    id: "s3",
    type: "system",
    title: "Permission Updated",
    staff: "Daniel Samuel",
    description: "Role changed from Carer to Admin",
    time: "24 February, 14:22",
    actor: "Temiloluwa Samuel",
  },
];

const sortLabelMap: Record<SortOption, string> = {
  "recently-created": "Recently Created",
  "first-created": "First Created",
  "last-30-days": "Last 30 days",
};

const badgeStyles = {
  info: "bg-blue-50 text-blue-700 hover:bg-blue-50 border-transparent",
  high: "bg-red-50 text-red-700 hover:bg-red-50 border-transparent",
  medium: "bg-orange-50 text-orange-700 hover:bg-orange-50 border-transparent",
  completed: "bg-green-50 text-green-700 hover:bg-green-50 border-transparent",
  missed: "bg-red-50 text-red-700 hover:bg-red-50 border-transparent",
};

function getSortedData<T extends { id: string }>(data: T[], sort: SortOption) {
  if (sort === "first-created") return [...data];
  if (sort === "recently-created") return [...data].reverse();
  return [...data].reverse();
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <Avatar className="mb-4 h-28 w-28 rounded-none">
        <AvatarImage src="/EmptyState.svg" alt="Empty state" />
        <AvatarFallback>ES</AvatarFallback>
      </Avatar>

      <h4 className="font-semibold text-foreground">
        No activity events found
      </h4>
      <p className="mt-1 text-xs text-muted-foreground">
        Adjust filters or date range to see more events
      </p>

      <Button variant="outline" className="mt-5" onClick={onReset}>
        Reset All Filters
      </Button>
    </div>
  );
}

function TopControls({
  sort,
  onSortChange,
  currentTab,
  alertPriority,
  setAlertPriority,
  careLogStatus,
  setCareLogStatus,
}: {
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  currentTab: TabKey;
  alertPriority: string;
  setAlertPriority: (value: string) => void;
  careLogStatus: string;
  setCareLogStatus: (value: string) => void;
}) {
  const showFilter = currentTab !== "system";

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9 gap-2">
            <ChevronDown className="h-4 w-4" />
            {sortLabelMap[sort]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onSortChange("recently-created")}>
            Recently Created
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("first-created")}>
            First Created
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("last-30-days")}>
            Last 30 days
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>
              {currentTab === "alert" ? "Status priority" : "Status priority"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {currentTab === "alert" && (
              <>
                <DropdownMenuCheckboxItem
                  checked={alertPriority === "All Statuses"}
                  onCheckedChange={() => setAlertPriority("All Statuses")}
                >
                  All Statuses
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={alertPriority === "High"}
                  onCheckedChange={() => setAlertPriority("High")}
                >
                  High
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={alertPriority === "Medium"}
                  onCheckedChange={() => setAlertPriority("Medium")}
                >
                  Medium
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={alertPriority === "Info"}
                  onCheckedChange={() => setAlertPriority("Info")}
                >
                  Info
                </DropdownMenuCheckboxItem>
              </>
            )}

            {currentTab === "care-logs" && (
              <>
                <DropdownMenuCheckboxItem
                  checked={careLogStatus === "All Statuses"}
                  onCheckedChange={() => setCareLogStatus("All Statuses")}
                >
                  All Statuses
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={careLogStatus === "Completed"}
                  onCheckedChange={() => setCareLogStatus("Completed")}
                >
                  Completed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={careLogStatus === "Missed"}
                  onCheckedChange={() => setCareLogStatus("Missed")}
                >
                  Missed
                </DropdownMenuCheckboxItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

function ActivityShell({
  children,
  controls,
}: {
  children: React.ReactNode;
  controls: React.ReactNode;
}) {
  return (
    <Card className="mt-4 rounded-lg border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
        <CardTitle className="text-sm font-medium">Activity Logs</CardTitle>
        {controls}
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

function AlertRow({ item }: { item: AlertItem }) {
  return (
    <div className="flex gap-4 border-b px-4 py-5 last:border-b-0">
      <div className="w-1 rounded-full bg-red-500" />

      <div className="flex flex-1 items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md border border-red-200 bg-red-50">
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </div>

          <div className="min-w-0">
            <div className="font-medium text-sm">{item.title}</div>

            <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
              <div>
                <p className="text-muted-foreground">Client</p>
                <p className="font-medium text-foreground">{item.client}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Carer</p>
                <p className="font-medium text-foreground">{item.carer}</p>
              </div>
            </div>

            <div className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              {item.description}
            </div>

            <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" />
              {item.time}
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
                  : badgeStyles.info
            }
          >
            {item.priority}
          </Badge>

          <div className="flex flex-row items-center justify-center h-40 ">
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CareLogRow({ item }: { item: CareLogItem }) {
  const isCompleted = item.status === "Completed";

  return (
    <div className="flex gap-4 border-b px-4 py-5 last:border-b-0">
      <div
        className={`w-1 rounded-full ${isCompleted ? "bg-green-500" : "bg-red-500"}`}
      />

      <div className="flex flex-1 items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div
            className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-md border ${
              isCompleted
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <CalendarClock
              className={`h-4 w-4 ${isCompleted ? "text-green-600" : "text-red-500"}`}
            />
          </div>

          <div className="min-w-0">
            <div className="font-medium text-sm">{item.title}</div>

            <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
              <div>
                <p className="text-muted-foreground">Client</p>
                <p className="font-medium text-foreground">{item.client}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Carer</p>
                <p className="font-medium text-foreground">{item.carer}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" />
              {item.time}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Badge
            variant="outline"
            className={isCompleted ? badgeStyles.completed : badgeStyles.missed}
          >
            {item.status}
          </Badge>

          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SystemRow({ item }: { item: SystemItem }) {
  return (
    <div className="flex gap-4 border-b px-4 py-5 last:border-b-0">
      <div className="w-1 rounded-full bg-red-500" />

      <div className="flex flex-1 items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md border border-red-200 bg-red-50">
            <UserCog className="h-4 w-4 text-red-500" />
          </div>

          <div className="min-w-0">
            <div className="font-medium text-sm">{item.title}</div>

            <div className="mt-2 text-xs">
              <p className="text-muted-foreground">Staff</p>
              <p className="font-medium text-foreground">{item.staff}</p>
            </div>

            <div className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              {item.description}
            </div>

            <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" />
              {item.time}
              <span>•</span>
              <span>by {item.actor}</span>
            </div>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

const Activity = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const raw = searchParams.get("tab") ?? "alert";
  const currentTab: TabKey = (TAB_KEYS as readonly string[]).includes(raw)
    ? (raw as TabKey)
    : "alert";

  const [sort, setSort] = React.useState<SortOption>("recently-created");
  const [alertPriority, setAlertPriority] =
    React.useState<string>("All Statuses");
  const [careLogStatus, setCareLogStatus] =
    React.useState<string>("All Statuses");

  const onTabChange = (next: string) => {
    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      sp.set("tab", next);
      return sp;
    });
  };

  React.useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams(
        (prev) => {
          const sp = new URLSearchParams(prev);
          sp.set("tab", "alert");
          return sp;
        },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams]);

  const filteredAlerts = React.useMemo(() => {
    const data =
      alertPriority === "All Statuses"
        ? alertData
        : alertData.filter((item) => item.priority === alertPriority);

    return getSortedData(data, sort);
  }, [alertPriority, sort]);

  const filteredCareLogs = React.useMemo(() => {
    const data =
      careLogStatus === "All Statuses"
        ? careLogData
        : careLogData.filter((item) => item.status === careLogStatus);

    return getSortedData(data, sort);
  }, [careLogStatus, sort]);

  const filteredSystem = React.useMemo(() => {
    return getSortedData(systemData, sort);
  }, [sort]);

  const resetAllFilters = () => {
    setSort("recently-created");
    setAlertPriority("All Statuses");
    setCareLogStatus("All Statuses");
  };

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold">Activity</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Track operational events, alerts, and system actions across the
            platform
          </p>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={onTabChange} className="mt-8">
        <TabsList className="justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="alert"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Alerts
          </TabsTrigger>

          <TabsTrigger
            value="care-logs"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Care Logs
          </TabsTrigger>

          <TabsTrigger
            value="system"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alert" className="mt-4">
          <ActivityShell
            controls={
              <TopControls
                sort={sort}
                onSortChange={setSort}
                currentTab={currentTab}
                alertPriority={alertPriority}
                setAlertPriority={setAlertPriority}
                careLogStatus={careLogStatus}
                setCareLogStatus={setCareLogStatus}
              />
            }
          >
            {filteredAlerts.length === 0 ? (
              <EmptyState onReset={resetAllFilters} />
            ) : (
              <div>
                {filteredAlerts.map((item) => (
                  <AlertRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </ActivityShell>
        </TabsContent>

        <TabsContent value="care-logs" className="mt-4">
          <ActivityShell
            controls={
              <TopControls
                sort={sort}
                onSortChange={setSort}
                currentTab={currentTab}
                alertPriority={alertPriority}
                setAlertPriority={setAlertPriority}
                careLogStatus={careLogStatus}
                setCareLogStatus={setCareLogStatus}
              />
            }
          >
            <div>
              {filteredCareLogs.map((item) => (
                <CareLogRow key={item.id} item={item} />
              ))}
            </div>
          </ActivityShell>
        </TabsContent>

        <TabsContent value="system" className="mt-4">
          <ActivityShell
            controls={
              <TopControls
                sort={sort}
                onSortChange={setSort}
                currentTab={currentTab}
                alertPriority={alertPriority}
                setAlertPriority={setAlertPriority}
                careLogStatus={careLogStatus}
                setCareLogStatus={setCareLogStatus}
              />
            }
          >
            <div>
              {filteredSystem.map((item) => (
                <SystemRow key={item.id} item={item} />
              ))}
            </div>
          </ActivityShell>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default Activity;
