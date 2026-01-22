import * as React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Employment from "./employment";

const TAB_KEYS = ["employment", "document", "additional-documents"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export default function OnboardingDocument() {
  const { staffId } = useParams<{ staffId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // read from url, validate, fallback
  const raw = searchParams.get("tab") ?? "employment";
  const currentTab: TabKey = (TAB_KEYS as readonly string[]).includes(raw)
    ? (raw as TabKey)
    : "employment";

  // Change handler updates only the 'tab' param, preserves the rest
  const onTabChange = (next: string) => {
    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      sp.set("tab", next);
      return sp;
    }); // push into history so Back/Forward works
  };

  // Optional: if no tab in URL, write the default once (nice for refresh/back)
  React.useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams(
        (prev) => {
          const sp = new URLSearchParams(prev);
          sp.set("tab", "employment");
          return sp;
        },
        { replace: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Onboarding & Documents</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Track employment details and required documents for this staff member
        </p>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={onTabChange}
        className="mt-12 w-[933px]"
      >
        <TabsList className=" justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="employment"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Employment
          </TabsTrigger>
          <TabsTrigger
            value="document"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Document
          </TabsTrigger>
          <TabsTrigger
            value="additional-documents"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Additional Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employment" className="space-y-5 pt-4">
          <Employment staffId={staffId as string} />
        </TabsContent>

        <TabsContent value="document" className="pt-4">
          <div>Document here</div>
        </TabsContent>
        <TabsContent value="additional-documents" className="pt-4">
          <div>Additional Documents here</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
