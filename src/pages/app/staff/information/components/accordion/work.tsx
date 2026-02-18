import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { StaffAccordionSection } from "../../../components/staff-accordion";
import { Map, Money } from "iconsax-react";
import { LocationAndTransport } from "../form/work/location";
import { PayAndRate } from "../form/work/pay";
import { CommunicationPreferences } from "../form/work/communication-preferences";

export function WorkAccordion() {
  // optional: control which is open
  const [open, setOpen] = React.useState<string | undefined>(
    "location-transport",
  );

  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={(v) => setOpen(v as string | undefined)}
      className="w-full space-y-2"
    >
      <StaffAccordionSection
        value="location-transport"
        icon={<Map />}
        title="Location & Transport"
      >
        <LocationAndTransport />
      </StaffAccordionSection>

      <StaffAccordionSection value="pay" icon={<Money />} title="Pay & Rate">
        <PayAndRate />
      </StaffAccordionSection>
      <StaffAccordionSection
        value="communication-preferences"
        icon={<Money />}
        title="Communication Preferences"
      >
        <CommunicationPreferences />
      </StaffAccordionSection>
    </Accordion>
  );
}
