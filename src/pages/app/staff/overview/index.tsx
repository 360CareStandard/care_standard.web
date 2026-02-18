import * as React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStaffDetails } from "@/hooks/staff/useStaff";
import PersonalDetails from "./personal-details";
import ContactDetails from "./contact-details";
import RoleStatus from "./role-status";
import Highlights from "./highlights";
import AddStaff from "../components/forms/add-staff";
// import ContactDetails from "./contact-details";
// import Addresses from "./addresses";
// import WellbeingOverview from "./wellbeing";

const TAB_KEYS = ["personal", "contact", "role", "highlights"] as const;
type TabKey = (typeof TAB_KEYS)[number];
const TAB_TO_STEP: Record<TabKey, number> = {
  personal: 1,
  contact: 2,
  role: 3,
  highlights: 4,
};

const StaffOverview = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const { data: staffData, isLoading } = useStaffDetails(staffId);
  const [open, setOpen] = React.useState(false);
  const [startStep, setStartStep] = React.useState(1);

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
        { replace: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openSheet = () => {
    setStartStep(TAB_TO_STEP[currentTab]);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Staff Overview</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          A quick snapshot of this staff member’s role, status, and current
          involvement
        </p>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={onTabChange}
        className="mt-12 w-[933px]"
      >
        <TabsList className=" justify-start rounded-none border-b bg-transparent p-0">
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
            value="role"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Role & Status
          </TabsTrigger>
          <TabsTrigger
            value="highlights"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Highlights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-5 pt-4">
          <PersonalDetails
            personal={staffData}
            openSheet={openSheet}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="contact" className="pt-4">
          <ContactDetails
            personal={staffData}
            isLoading={isLoading}
            openSheet={openSheet}
          />
        </TabsContent>

        <TabsContent value="role" className="pt-4">
          <RoleStatus
            personal={staffData}
            isLoading={isLoading}
            openSheet={openSheet}
          />
        </TabsContent>

        <TabsContent value="highlights" className="pt-4">
          <Highlights
            personal={staffData}
            isLoading={isLoading}
            openSheet={openSheet}
          />
        </TabsContent>
      </Tabs>
      <AddStaff
        open={open}
        setOpen={setOpen}
        staffId={staffId}
        startStep={startStep}
      />
    </div>
  );
};
export default StaffOverview;
