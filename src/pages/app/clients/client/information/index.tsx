import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactNextOfKin from "./contact-next-of-kin";
import CareSetup from "./care-setup";
import Legal from "./legal";

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

const TAB_KEYS = [
  "contact&next-of-kin",
  "care-setup",
  "legal",
  "health",
  "gp&support",
  "home&environment",
  "preferences",
] as const;
type TabKey = (typeof TAB_KEYS)[number];

export default function Information() {
  const [searchParams, setSearchParams] = useSearchParams();

  // read from url, validate, fallback
  const raw = searchParams.get("tab") ?? "contact&next-of-kin";
  const currentTab: TabKey = (TAB_KEYS as readonly string[]).includes(raw)
    ? (raw as TabKey)
    : "contact&next-of-kin";

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
          sp.set("tab", "contact&next-of-kin");
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
        <h1 className="text-2xl font-semibold">Client Information</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          The complete information about clients
        </p>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={onTabChange}
        className="mt-12 w-[933px]"
      >
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="contact&next-of-kin"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Contacts & Next of Kin
          </TabsTrigger>
          <TabsTrigger
            value="care-setup"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Care Setup
          </TabsTrigger>
          <TabsTrigger
            value="legal"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Legal
          </TabsTrigger>
          <TabsTrigger
            value="health"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Health
          </TabsTrigger>
          <TabsTrigger
            value="gp&support"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            GP & Support
          </TabsTrigger>
          <TabsTrigger
            value="home&environment"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Home & Environment
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact&next-of-kin" className="space-y-5 pt-4">
          <ContactNextOfKin />
        </TabsContent>

        <TabsContent value="care-setup" className="pt-4">
          <CareSetup />
        </TabsContent>

        <TabsContent value="legal" className="pt-4">
          <Legal />
        </TabsContent>
        <TabsContent value="health" className="pt-4">
          <h1>Health</h1>
        </TabsContent>
        <TabsContent value="gp&support" className="pt-4">
          <h1>GP and Support</h1>
        </TabsContent>
        <TabsContent value="home&environment" className="pt-4">
          <h1>Home and Environs</h1>
        </TabsContent>

        <TabsContent value="preferences" className="pt-4">
          <h1>Preferences</h1>
        </TabsContent>
      </Tabs>
    </div>
  );
}
