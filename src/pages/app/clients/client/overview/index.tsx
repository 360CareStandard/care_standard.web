import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalDetails from "./personal-details";
import ContactDetails from "./contact-details";
import Addresses from "./addresses";
import WellbeingOverview from "./wellbeing";

const personal = {
  title: "Mrs",
  firstName: "Jemmy",
  lastName: "Wilson",
  preferredName: "Jem",
  pronouns: "She/Her",
  dateOfBirth: "07 October 1943 (81 years old)",
  status: "Active",
  name: "Jemmy Wilson",
  avatarUrl: "/images/smiley-elder-woman-standing-kitchen.png",
  avatarFallback: "JW",
};

const TAB_KEYS = ["personal", "contact", "addresses", "wellbeing"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export default function Overview() {
  const [searchParams, setSearchParams] = useSearchParams();

  // read from url, validate, fallback
  const raw = searchParams.get("tab") ?? "personal";
  const currentTab: TabKey = (TAB_KEYS as readonly string[]).includes(raw)
    ? (raw as TabKey)
    : "personal";

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
          sp.set("tab", "personal");
          return sp;
        },
        { replace: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Client Overview</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Your quick snapshot of this client’s personal details, contact
          details, addresses and highlights
        </p>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={onTabChange}
        className="mt-12 w-[933px]"
      >
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="personal"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Personal Details
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Contact Details
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Addresses
          </TabsTrigger>
          <TabsTrigger
            value="wellbeing"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Wellbeing Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-5 pt-4">
          <PersonalDetails personal={personal} />
        </TabsContent>

        <TabsContent value="contact" className="pt-4">
          <ContactDetails />
        </TabsContent>

        <TabsContent value="addresses" className="pt-4">
          <Addresses />
        </TabsContent>

        <TabsContent value="wellbeing" className="pt-4">
          <WellbeingOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
}
