import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Add } from "iconsax-react";
import React from "react";
import { useSearchParams } from "react-router-dom";
import OverviewTab from "./components/overview";
const TAB_KEYS = [
  "overview",
  "invoices",
  "charges",
  "payments",
  "settings",
] as const;
type TabKey = (typeof TAB_KEYS)[number];
const Finance = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const raw = searchParams.get("tab") ?? "cases";
  const currentTab: TabKey = (TAB_KEYS as readonly string[]).includes(raw)
    ? (raw as TabKey)
    : "overview";

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
          sp.set("tab", "overview");
          return sp;
        },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams]);
  return (
    <div className="p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold">Finance</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage billing, invoices, and payments
          </p>
        </div>
        <Button>
          <Add className="h-4 w-4" />
          Generate Invoice
        </Button>
      </div>

      <Tabs value={currentTab} onValueChange={onTabChange} className="mt-8">
        <TabsList className="justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="invoices"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Invoices
          </TabsTrigger>
          <TabsTrigger
            value="charges"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Charges
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Payments
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <div>2</div>
        </TabsContent>
        <TabsContent value="charges" className="mt-4">
          <div>3</div>
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <div>4</div>
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <div>5</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
