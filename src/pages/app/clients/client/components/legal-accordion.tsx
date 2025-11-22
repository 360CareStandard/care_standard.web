// components/care/CareSetupAccordion.tsx
import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { Award, Shield, FileUp, Clock } from "lucide-react";
import { CareAccordionSection } from "./wrapper/care-accordion";
import { CoreLegalStatusFields } from "../forms/legal/CoreLegalStatusFields";
import { ConsentDataSharingFields } from "../forms/legal/ConsentDataSharingFields";
import { DocumentsEvidenceFields } from "../forms/legal/DocumentsEvidenceFields";
import { AuditReviewFields } from "../forms/legal/AuditReviewFields";
import { useFormContext, useWatch } from "react-hook-form";

export function LegalSetupAccordion() {
  // optional: control which is open
  const [open, setOpen] = React.useState<string | undefined>("legal");
  const { formState } = useFormContext();
  const files = useWatch({ name: "legalDocuments" }) as File[] | undefined;
  const hasFiles = Array.isArray(files) && files.length > 0;
  const fileError = !!formState.errors.legalDocumentsFiles;
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
        title={
          <div className="flex items-center gap-2">
            Documents & Evidence
            <div className="flex items-center gap-2 mb-1">
              {/* show subtle red dot / Required badge */}
              {!hasFiles && (
                <span className="inline-flex items-center rounded-full bg-red-50 text-red-700 text-xs px-2 py-0.5">
                  Required
                </span>
              )}

              {/* or show error icon when validation triggered */}
              {fileError && (
                <span className="text-red-600 text-sm font-medium">⚠</span>
              )}
            </div>
          </div>
        }
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
