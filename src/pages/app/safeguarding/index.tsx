import React from "react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/layouts/main";
import { Add } from "iconsax-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import {
  SafeguardingFormData,
  safeguardingSchema,
} from "@/pages/schemas/safeguarding";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateSafeguardingReport,
  useSafeguarding,
  useSafeguardingAction,
  useSafeguardingInfinite,
  useSafeguardingReport,
} from "@/hooks/safeguarding";
import toast from "react-hot-toast";
import { handleFormApiError } from "@/lib/handle-form-error";
import { Spinner } from "@/components/shared/spinner";
import SafeguardingFormField from "./components/form/safeguarding-form";
import { ActivityShell } from "./components/ui/actvitity-shell";
import { TopControls } from "./components/ui/top-controls";
import { AlertRow } from "./components/ui/alert-row";
import { DateRange } from "react-day-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "./components/ui/empty-state";
import { SafeguardDetailsSheet } from "./components/ui/sheet";
const TAB_KEYS = ["cases", "reports"] as const;
type TabKey = (typeof TAB_KEYS)[number];

const resolver = zodResolver(
  safeguardingSchema,
) as unknown as Resolver<SafeguardingFormData>;

const STATUS_OPTIONS = [
  { label: "Open", value: "open" },
  { label: "Under Review", value: "under-review" },
  { label: "Action Taken", value: "action-taken" },
  { label: "Closed", value: "closed" },
];
const SafeGuarding = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const raw = searchParams.get("tab") ?? "cases";
  const currentTab: TabKey = (TAB_KEYS as readonly string[]).includes(raw)
    ? (raw as TabKey)
    : "cases";
  const methods = useForm<SafeguardingFormData>({
    resolver,
    defaultValues: {
      clientId: "",
      reportedByStaffId: "",
      incidentType: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<string | undefined>();
  const [priority, setPriority] = React.useState<string | undefined>();

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [actionModal, setActionModal] = React.useState<{
    open: boolean;
    id: string | null;
    status: string;
  }>({
    open: false,
    id: null,
    status: "under-review", // default
  });

  const [open, setOpen] = React.useState(false);
  const [selectedReportId, setSelectedReportId] = React.useState<
    string | undefined
  >(undefined);

  const openDetailSheet = (reportId: string) => {
    setSelectedReportId(reportId);
    setOpen(true);
  };

  const [actionText, setActionText] = React.useState("");
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const openActionModal = (id: string, currentStatus: string) => {
    setActionModal({
      open: true,
      id,
      status: currentStatus, // prefill
    });
  };

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
          sp.set("tab", "cases");
          return sp;
        },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams]);

  const { mutateAsync: createSafeguardingReport, isPending: isCreating } =
    useCreateSafeguardingReport();
  const { mutateAsync: takeAction, isPending: isUpdating } =
    useSafeguardingAction();

  const {
    data: safeguardingData,
    isLoading: isSafeguardingDataLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useSafeguardingInfinite({
    // status: currentTab === "reports" ? "open" : "not-open",
    limit: 10,
    search,
    priority,
    dateFrom: dateRange?.from?.toISOString(),
    dateTo: dateRange?.to?.toISOString(),
  });

  const { data: safeguardDetails, isLoading: safeguardDetailsLoading } =
    useSafeguarding(selectedReportId, Boolean(selectedReportId)); // disable auto-fetch

  const { data: safeguardReportData } = useSafeguardingReport(
    selectedReportId!,
  );

  const reports = safeguardingData?.pages.flatMap((p) => p.reports) ?? [];
  const mappedReports = React.useMemo(() => {
    return reports.map((r) => ({
      id: r.id,
      type: r.incidentType,
      title: r.title,
      client: `${r.client.firstname} ${r.client.lastname}`,
      carer: `${r.reportedBy.user.firstname} ${r.reportedBy.user.lastname}`,
      description: r.description,
      time: new Date(r.incidentDateTime).toLocaleString(),
      location: r.location,
      status: r.status,
      priority:
        r.priority === "high"
          ? "High"
          : r.priority === "medium"
            ? "Medium"
            : r.priority === "low"
              ? "Low"
              : "Critical",
    }));
  }, [reports]);

  const observerRef = React.useRef<IntersectionObserver | null>(null);

  const lastItemRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage], // ✅ FIXED
  );

  const reportsOnly = React.useMemo(() => {
    return mappedReports.filter((r) => r.status === "open");
  }, [mappedReports]);

  const cases = React.useMemo(() => {
    return mappedReports.filter((r) => r.status !== "open");
  }, [mappedReports]);
  const isSubmitting = isCreating || isUpdating;

  const onValidSubmit = async (vals: SafeguardingFormData) => {
    const payload = {
      ...vals,
    };

    try {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value == null) return;
        formData.append(key, value instanceof File ? value : String(value));
      });

      await createSafeguardingReport(formData);
      toast?.success?.("Report created");

      setSheetOpen(false);
      methods.reset();
    } catch (err) {
      handleFormApiError<SafeguardingFormData>(
        err,
        methods.setError,
        "Failed to create report",
      );
    }
  };

  // SheetForm owns the <form>
  const onFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    return methods.handleSubmit(onValidSubmit)(e);
  };

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold">Safeguarding</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage incidents, concerns, and risk cases
          </p>
        </div>
        <Button onClick={() => setSheetOpen(true)}>
          <Add />
          New Report
        </Button>
      </div>

      <Tabs value={currentTab} onValueChange={onTabChange} className="mt-8">
        <TabsList className="justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="cases"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Cases
          </TabsTrigger>

          <TabsTrigger
            value="reports"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="mt-4">
          <ActivityShell
            controls={
              <TopControls
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                priority={priority}
                setPriority={setPriority}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            }
          >
            {isSafeguardingDataLoading ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : cases.length === 0 ? (
              <EmptyState
                title="No cases reported yet"
                onReset={() => {
                  setSearch("");
                  setStatus(undefined);
                  setPriority(undefined);
                  setDateRange(undefined); // 👈 here
                }}
              />
            ) : (
              cases.map((item, index) => {
                const isLast = index === cases.length - 1;

                return (
                  <div ref={isLast ? lastItemRef : null} key={item.id}>
                    <AlertRow openDetailSheet={openDetailSheet} item={item} />
                  </div>
                );
              })
            )}
          </ActivityShell>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <ActivityShell
            controls={
              <TopControls
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                priority={priority}
                setPriority={setPriority}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            }
          >
            {isSafeguardingDataLoading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : reportsOnly.length === 0 ? (
              <EmptyState
                title="No reports found"
                onReset={() => {
                  setSearch("");
                  setStatus(undefined);
                  setPriority(undefined);
                  setDateRange(undefined);
                }}
              />
            ) : (
              reportsOnly.map((item, index) => {
                const isLast = index === reportsOnly.length - 1;

                return (
                  <div ref={isLast ? lastItemRef : null} key={item.id}>
                    <AlertRow openDetailSheet={openDetailSheet} item={item} />
                  </div>
                );
              })
            )}
          </ActivityShell>
        </TabsContent>
      </Tabs>
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
      <Dialog
        open={actionModal.open}
        onOpenChange={(open) => setActionModal((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>

          {/* 🔽 Status Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={actionModal.status}
              onValueChange={(value) =>
                setActionModal((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 📝 Action Text */}
          <div className="space-y-2 ">
            <label className="text-sm font-medium">Action Taken</label>
            <Textarea
              placeholder="Describe action taken..."
              value={actionText}
              onChange={(e) => setActionText(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setActionModal({
                  open: false,
                  id: null,
                  status: "under-review",
                })
              }
            >
              Cancel
            </Button>

            <Button
              disabled={!actionText || !actionModal.id}
              onClick={async () => {
                if (!actionModal.id) return;

                try {
                  setActiveId(actionModal.id);

                  await takeAction({
                    id: actionModal.id,
                    status: actionModal.status,
                    actionTaken: actionText,
                  });

                  setActionModal({
                    open: false,
                    id: null,
                    status: "under-review",
                  });
                  setActionText("");
                } catch (err) {
                  handleFormApiError<SafeguardingFormData>(
                    err,
                    methods.setError,
                    "Action failed",
                  );
                } finally {
                  setActiveId(null);
                }
              }}
            >
              {activeId === actionModal.id ? <Spinner size="sm" /> : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SheetForm
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={"Submit Safeguarding Report"}
        description="Report an incident, concern, or risk case. All fields marked with * are required."
        headerClassName="bg-[#E4E7EC] py-2.5"
        onSubmit={onFormSubmit}
        submitLabel={isSubmitting ? <Spinner size="sm" /> : "Create New Report"}
        submitDisabled={isSubmitting}
      >
        <FormProvider {...methods}>
          <SafeguardingFormField />
        </FormProvider>
      </SheetForm>

      <SafeguardDetailsSheet
        open={open}
        onOpenChange={setOpen}
        item={safeguardDetails}
        isLoading={safeguardDetailsLoading}
        openActionModal={openActionModal}
        isUpdating={isUpdating}
        auditLog={safeguardReportData?.timeline}
      />
    </Main>
  );
};

export default SafeGuarding;
