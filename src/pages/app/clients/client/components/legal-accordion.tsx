// components/care/CareSetupAccordion.tsx
import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { Award, Shield, FileUp, Clock } from "lucide-react";
import { CareAccordionSection } from "./wrapper/care-accordion";
import { CoreLegalStatusFields } from "../forms/legal/CoreLegalStatusFields";
import { ConsentDataSharingFields } from "../forms/legal/ConsentDataSharingFields";
import { DocumentsEvidenceFields } from "../forms/legal/DocumentsEvidenceFields";
import { AuditReviewFields } from "../forms/legal/AuditReviewFields";

export function LegalSetupAccordion() {
  // optional: control which is open
  const [open, setOpen] = React.useState<string | undefined>("legal");

  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={(v) => setOpen(v as string | undefined)}
      className="w-full space-y-2"
    >
      <CareAccordionSection
        value="legal"
        icon={<Award className="h-4 w-4" />}
        title="Core Legal Status"
      >
        <CoreLegalStatusFields />
      </CareAccordionSection>

      <CareAccordionSection
        value="consent"
        icon={<Shield className="h-4 w-4" />}
        title="Consent & Data Sharing"
      >
        <ConsentDataSharingFields />
      </CareAccordionSection>

      <CareAccordionSection
        value="document"
        icon={<FileUp className="h-4 w-4" />}
        title="Documents & Evidence"
      >
        <DocumentsEvidenceFields />
      </CareAccordionSection>

      <CareAccordionSection
        value="audit"
        icon={<Clock className="h-4 w-4" />}
        title="Audit & Review"
      >
        <AuditReviewFields />
      </CareAccordionSection>
    </Accordion>
  );
}
