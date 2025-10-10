// components/care/CareSetupAccordion.tsx
import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { FileHeart, FileWarning, TriangleAlert } from "lucide-react";
import { CareAccordionSection } from "./wrapper/care-accordion";
import { ConditionHistoryFields } from "../forms/health/ConditionHistoryFields";
import { AllergiesIntolerancesFields } from "../forms/health/AllergiesIntolerancesFields";
import { ClinicalRisksFields } from "../forms/health/ClinicalRisksFields";

export function HealthSetupAccordion() {
  // optional: control which is open
  const [open, setOpen] = React.useState<string | undefined>("condition");

  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={(v) => setOpen(v as string | undefined)}
      className="w-full space-y-2"
    >
      <CareAccordionSection
        value="condition"
        icon={<FileHeart className="h-4 w-4" />}
        title="Condition & History"
      >
        <ConditionHistoryFields />
      </CareAccordionSection>

      <CareAccordionSection
        value="allergies"
        icon={<FileWarning className="h-4 w-4" />}
        title="Allergies & Intolerances"
      >
        <AllergiesIntolerancesFields />
      </CareAccordionSection>

      <CareAccordionSection
        value="clinical"
        icon={<TriangleAlert className="h-4 w-4" />}
        title="Clinical Risks"
      >
        <ClinicalRisksFields />
      </CareAccordionSection>
    </Accordion>
  );
}
