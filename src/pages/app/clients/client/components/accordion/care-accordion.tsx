// components/care/CareSetupAccordion.tsx
import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { Package, CalendarClock, Wallet2, ShieldCheck } from "lucide-react";
import { CareAccordionSection } from "../wrapper/care-accordion";
import { ServicePackageFields } from "../../information/components/forms/care-setup/service-package";
import { SchedulingPreferencesFields } from "../../information/components/forms/care-setup/scheduling-preferences";
import { FundingFields } from "../../information/components/forms/care-setup/funding-fields";
import { SafetyCheckinFields } from "../../information/components/forms/care-setup/safety-checkin-fields";

export function CareSetupAccordion({ clientId }: { clientId: string }) {
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
        <SafetyCheckinFields clientId={clientId} />
      </CareAccordionSection>
    </Accordion>
  );
}
