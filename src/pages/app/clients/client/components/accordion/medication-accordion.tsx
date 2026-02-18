import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { CareAccordionSection } from "../wrapper/care-accordion";
import { InfoCircle, User } from "iconsax-react";
import { MedicationDetailsSection } from "../../medications/components/forms/medication-details";
import Prescriber from "../../medications/components/forms/prescriber";
import Responsibilities from "../../medications/components/forms/responsibilities";

export function MedicationAccordion() {
  // optional: control which is open
  const [open, setOpen] = React.useState<string | undefined>(
    "medication-details"
  );

  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={(v) => setOpen(v as string | undefined)}
      className="w-full space-y-2"
    >
      <CareAccordionSection
        value="medication-details"
        icon={<InfoCircle className="h-5 w-5" />}
        title="Medication Details"
      >
        <MedicationDetailsSection />
      </CareAccordionSection>

      <CareAccordionSection
        value="prescriber-safety"
        icon={<User className="h-5 w-5" />}
        title="Prescriber & Safety"
      >
        <Prescriber />
      </CareAccordionSection>
      <CareAccordionSection
        value="responsibilities"
        icon={<User className="h-5 w-5" />}
        title="Responsibilities"
      >
        <Responsibilities />
      </CareAccordionSection>
    </Accordion>
  );
}
