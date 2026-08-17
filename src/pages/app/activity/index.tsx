// src/pages/app/activity/index.tsx

import * as React from "react";
import { useSearchParams } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  useActivityAlerts,
  useCareLogs,
  useSystemActivities,
} from "@/hooks/useActivity";

import type { AlertPriority, CareLogStatus } from "@/types/activity";
import { ActivityControls, SortOption } from "./components/activity-controls";
import { Main } from "@/layouts/main";
import { ActivityShell } from "./components/activity-shell";
import { ActivitySkeleton } from "./components/activity-skeleton";
import { ActivityErrorState } from "./components/activity-error-state";
import { AlertRow } from "./components/alert-row";
import { ActivityEmptyState } from "./components/activity-empty-state";
import { ActivityPagination } from "./components/activity-pagination";
import { CareLogRow } from "./components/care-log-row";
import { SystemActivityRow } from "./components/system-activity-row";

type TabKey = "alert" | "care-logs" | "system";

const TAB_KEYS: TabKey[] = ["alert", "care-logs", "system"];

const PAGE_SIZE = 20;

const Activity = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ------------------------------------------------------------------------ */
  /*                                  TAB                                     */
  /* ------------------------------------------------------------------------ */

  const rawTab = searchParams.get("tab");

  const currentTab: TabKey =
    rawTab && TAB_KEYS.includes(rawTab as TabKey)
      ? (rawTab as TabKey)
      : "alert";

  /* ------------------------------------------------------------------------ */
  /*                                  STATE                                   */
  /* ------------------------------------------------------------------------ */

  const [sort, setSort] = React.useState<SortOption>("recently-created");

  const [alertPriority, setAlertPriority] = React.useState<
    AlertPriority | undefined
  >();

  const [careLogStatus, setCareLogStatus] = React.useState<
    CareLogStatus | undefined
  >();

  const [alertPage, setAlertPage] = React.useState(1);

  const [careLogPage, setCareLogPage] = React.useState(1);

  const [systemPage, setSystemPage] = React.useState(1);

  /* ------------------------------------------------------------------------ */
  /*                              QUERY PARAMS                                 */
  /* ------------------------------------------------------------------------ */

  const alertQuery = {
    priority: alertPriority,
    page: alertPage,
    limit: PAGE_SIZE,
  };

  const careLogQuery = {
    status: careLogStatus,
    page: careLogPage,
    limit: PAGE_SIZE,
  };

  const systemQuery = {
    page: systemPage,
    limit: PAGE_SIZE,
  };

  /* ------------------------------------------------------------------------ */
  /*                                  QUERIES                                 */
  /* ------------------------------------------------------------------------ */

  const alertsQuery = useActivityAlerts(
    currentTab === "alert" ? alertQuery : undefined,
  );

  const careLogsQuery = useCareLogs(
    currentTab === "care-logs" ? careLogQuery : undefined,
  );

  const systemQueryResult = useSystemActivities(
    currentTab === "system" ? systemQuery : undefined,
  );

  /* ------------------------------------------------------------------------ */
  /*                                  TAB                                      */
  /* ------------------------------------------------------------------------ */

  const onTabChange = (next: string) => {
    const tab = next as TabKey;

    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);

      sp.set("tab", tab);

      return sp;
    });

    // Reset page whenever switching tabs.
    if (tab === "alert") {
      setAlertPage(1);
    }

    if (tab === "care-logs") {
      setCareLogPage(1);
    }

    if (tab === "system") {
      setSystemPage(1);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                                FILTERS                                   */
  /* ------------------------------------------------------------------------ */

  const handleAlertPriorityChange = (value: AlertPriority | undefined) => {
    setAlertPriority(value);
    setAlertPage(1);
  };

  const handleCareLogStatusChange = (value: CareLogStatus | undefined) => {
    setCareLogStatus(value);
    setCareLogPage(1);
  };

  /* ------------------------------------------------------------------------ */
  /*                                  SORT                                     */
  /* ------------------------------------------------------------------------ */

  const handleSortChange = (value: SortOption) => {
    setSort(value);

    /*
     * IMPORTANT:
     *
     * Your current API examples don't expose a sort parameter.
     * Therefore we don't pretend this is server-side sorting.
     *
     * "Recently Created" is already the natural API ordering.
     * "First Created" / "Last 30 days" require backend support
     * if they are meant to be real filters.
     */
  };

  /* ------------------------------------------------------------------------ */
  /*                              RESET FILTERS                                */
  /* ------------------------------------------------------------------------ */

  const resetAllFilters = () => {
    setSort("recently-created");

    setAlertPriority(undefined);
    setCareLogStatus(undefined);

    setAlertPage(1);
    setCareLogPage(1);
    setSystemPage(1);
  };

  /* ------------------------------------------------------------------------ */
  /*                                  RENDER                                  */
  /* ------------------------------------------------------------------------ */

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

        {/* ---------------------------------------------------------------- */}
        {/*                              ALERTS                              */}
        {/* ---------------------------------------------------------------- */}

        <TabsContent value="alert" className="mt-4">
          <ActivityShell
            controls={
              <ActivityControls
                sort={sort}
                onSortChange={handleSortChange}
                currentTab="alert"
                alertPriority={alertPriority}
                onAlertPriorityChange={handleAlertPriorityChange}
                careLogStatus={careLogStatus}
                onCareLogStatusChange={handleCareLogStatusChange}
              />
            }
          >
            {alertsQuery.isPending ? (
              <ActivitySkeleton />
            ) : alertsQuery.isError ? (
              <ActivityErrorState onRetry={() => alertsQuery.refetch()} />
            ) : alertsQuery.data?.alerts.length === 0 ? (
              <ActivityEmptyState onReset={resetAllFilters} />
            ) : (
              <>
                <div
                  className={
                    alertsQuery.isFetching
                      ? "opacity-60 transition-opacity"
                      : undefined
                  }
                >
                  {alertsQuery.data?.alerts.map((item) => (
                    <AlertRow key={item.id} item={item} />
                  ))}
                </div>

                {alertsQuery.data && (
                  <ActivityPagination
                    currentPage={alertsQuery.data.currentPage}
                    totalPages={alertsQuery.data.totalPages}
                    total={alertsQuery.data.total}
                    limit={alertsQuery.data.limit}
                    onPageChange={setAlertPage}
                    disabled={alertsQuery.isFetching}
                  />
                )}
              </>
            )}
          </ActivityShell>
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        {/*                           CARE LOGS                              */}
        {/* ---------------------------------------------------------------- */}

        <TabsContent value="care-logs" className="mt-4">
          <ActivityShell
            controls={
              <ActivityControls
                sort={sort}
                onSortChange={handleSortChange}
                currentTab="care-logs"
                alertPriority={alertPriority}
                onAlertPriorityChange={handleAlertPriorityChange}
                careLogStatus={careLogStatus}
                onCareLogStatusChange={handleCareLogStatusChange}
              />
            }
          >
            {careLogsQuery.isPending ? (
              <ActivitySkeleton />
            ) : careLogsQuery.isError ? (
              <ActivityErrorState onRetry={() => careLogsQuery.refetch()} />
            ) : careLogsQuery.data?.careLogs.length === 0 ? (
              <ActivityEmptyState onReset={resetAllFilters} />
            ) : (
              <>
                <div
                  className={
                    careLogsQuery.isFetching
                      ? "opacity-60 transition-opacity"
                      : undefined
                  }
                >
                  {careLogsQuery.data?.careLogs.map((item) => (
                    <CareLogRow key={item.id} item={item} />
                  ))}
                </div>

                {careLogsQuery.data && (
                  <ActivityPagination
                    currentPage={careLogsQuery.data.currentPage}
                    totalPages={careLogsQuery.data.totalPages}
                    total={careLogsQuery.data.total}
                    limit={careLogsQuery.data.limit}
                    onPageChange={setCareLogPage}
                    disabled={careLogsQuery.isFetching}
                  />
                )}
              </>
            )}
          </ActivityShell>
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        {/*                             SYSTEM                               */}
        {/* ---------------------------------------------------------------- */}

        <TabsContent value="system" className="mt-4">
          <ActivityShell
            controls={
              <ActivityControls
                sort={sort}
                onSortChange={handleSortChange}
                currentTab="system"
                alertPriority={alertPriority}
                onAlertPriorityChange={handleAlertPriorityChange}
                careLogStatus={careLogStatus}
                onCareLogStatusChange={handleCareLogStatusChange}
              />
            }
          >
            {systemQueryResult.isPending ? (
              <ActivitySkeleton />
            ) : systemQueryResult.isError ? (
              <ActivityErrorState onRetry={() => systemQueryResult.refetch()} />
            ) : systemQueryResult.data?.activities.length === 0 ? (
              <ActivityEmptyState onReset={resetAllFilters} />
            ) : (
              <>
                <div
                  className={
                    systemQueryResult.isFetching
                      ? "opacity-60 transition-opacity"
                      : undefined
                  }
                >
                  {systemQueryResult.data?.activities.map((item) => (
                    <SystemActivityRow key={item.id} item={item} />
                  ))}
                </div>

                {systemQueryResult.data && (
                  <ActivityPagination
                    currentPage={systemQueryResult.data.currentPage}
                    totalPages={systemQueryResult.data.totalPages}
                    total={systemQueryResult.data.total}
                    limit={systemQueryResult.data.limit}
                    onPageChange={setSystemPage}
                    disabled={systemQueryResult.isFetching}
                  />
                )}
              </>
            )}
          </ActivityShell>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default Activity;
