import * as React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactNextOfKin from "./contact";
import Work from "./work";
import Skill from "./skill";

const TAB_KEYS = ["contact", "work-details", "skills-training"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export default function StaffInformation() {
  const { staffId } = useParams<{ staffId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // read from url, validate, fallback
  const raw = searchParams.get("tab") ?? "contact";
  const currentTab: TabKey = (TAB_KEYS as readonly string[]).includes(raw)
    ? (raw as TabKey)
    : "contact";

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
          sp.set("tab", "contact");
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
        <h1 className="text-2xl font-semibold">Staff Information</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Detailed information about this staff member
        </p>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={onTabChange}
        className="mt-12 w-[933px]"
      >
        <TabsList className=" justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="contact"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Contacts & Next of Kin
          </TabsTrigger>
          <TabsTrigger
            value="work-details"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Work Details
          </TabsTrigger>
          <TabsTrigger
            value="skills-training"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Skills & Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-5 pt-4">
          <ContactNextOfKin staffId={staffId as string} />
        </TabsContent>

        <TabsContent value="work-details" className="pt-4">
          <Work staffId={staffId as string} />
        </TabsContent>
        <TabsContent value="skills-training" className="pt-4">
          <Skill staffId={staffId as string} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
