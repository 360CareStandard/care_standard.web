// components/care/CareSetupAccordion.tsx
import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { Package, CalendarClock, Wallet2, ShieldCheck } from "lucide-react";
import { CareAccordionSection } from "./wrapper/care-accordion";
import { ServicePackageFields } from "../forms/service-package";
import { SchedulingPreferencesFields } from "../forms/scheduling-preferences";
import { FundingFields } from "../forms/funding-fields";
import { SafetyCheckinFields } from "../forms/safety-checkin-fields";

export function CareSetupAccordion() {
  // optional: control which is open
  const [open, setOpen] = React.useState<string | undefined>("service");

  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={(v) => setOpen(v as string | undefined)}
      className="w-full space-y-2"
    >
      <CareAccordionSection
        value="service"
        icon={<Package className="h-4 w-4" />}
        title="Service Package"
        // subtitle="Configure package, dates, duration & staffing"
      >
        <ServicePackageFields />
      </CareAccordionSection>

      <CareAccordionSection
        value="scheduling"
        icon={<CalendarClock className="h-4 w-4" />}
        title="Scheduling Preferences"
        // subtitle="Preferred times, days, cadence & constraints"
      >
        <SchedulingPreferencesFields />
      </CareAccordionSection>

      <CareAccordionSection
        value="funding"
        icon={<Wallet2 className="h-4 w-4" />}
        title="Funding & Authorisation"
        // subtitle="Funding source, weekly budget, auth references"
      >
        <FundingFields />
      </CareAccordionSection>

      <CareAccordionSection
        value="safety"
        icon={<ShieldCheck className="h-4 w-4" />}
        title="Safety & Check-in"
        // subtitle="Lone worker risk, key safe, access notes"
      >
        <SafetyCheckinFields
          contacts={[
            { id: "none", label: "No escalation contact" }, // optional; we already inject "None" in the field component
            { id: "a2f8…", label: "Elizabeth Wilson (Daughter)" },
            { id: "b933…", label: "David Wilson (Son)" },
            { id: "c1aa…", label: "Sarah Johnson (Daughter)" },
          ]}
        />
      </CareAccordionSection>
    </Accordion>
  );
}
