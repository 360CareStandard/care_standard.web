// src/schemas/legal.ts
import { z } from "zod";

// helper: accept FileList or array of files -> array
const fileArrayPreprocess = z
  .preprocess((v) => {
    if (!v) return undefined;
    // convert FileList -> Array<File> on the client
    if (typeof File !== "undefined" && v instanceof FileList) {
      return Array.from(v);
    }
    if (Array.isArray(v)) return v;
    return undefined;
  }, z.array(z.instanceof(File)))
  .optional();

// If you prefer to avoid z.instanceof(File) (e.g. for server validation), use:
// const fileArrayPreprocess = z.preprocess((v) => {/*...*/}, z.array(z.any()).optional());

export const legalFormSchema = z.object({
  powerOfAttorney: z.enum(["none", "health", "finance", "health-finance"]),
  poaHolderName: z.string().optional().or(z.literal("")),
  poaContact: z.string().optional().or(z.literal("")),
  poaValidFrom: z.string().optional().or(z.literal("")),
  mentalCapacity: z.enum([
    "has-capacity",
    "lacks-capacity",
    "under-assessment",
  ]),
  dnarActive: z.boolean().optional(),
  dnarReason: z.string().optional().or(z.literal("")),
  dnarSignedDate: z.string().optional().or(z.literal("")),
  hasDoLS: z.boolean().optional(),
  hasLPS: z.boolean().optional(),
  hasCourtOrder: z.boolean().optional(),
  hasGuardianship: z.boolean().optional(),
  legalReferenceNumber: z.string().optional().or(z.literal("")),
  legalResponsibleAuthority: z.string().optional().or(z.literal("")),
  legalStartDate: z.string().optional().or(z.literal("")),
  legalEndDate: z.string().optional().or(z.literal("")),
  // consent fields...
  dataSharingConsent: z.boolean().optional(),
  dataSharingConsentDate: z.string().optional().or(z.literal("")),
  dataSharingConsentSignedBy: z.string().optional().or(z.literal("")),
  dataSharingScope: z.string().optional().or(z.literal("")),
  photoConsent: z.boolean().optional(),
  photoConsentDate: z.string().optional().or(z.literal("")),
  contactConsentEmail: z.boolean().optional(),
  contactConsentSMS: z.boolean().optional(),
  contactConsentPhone: z.boolean().optional(),
  familyAppPermission: z.boolean().optional(),

  // NEW: files attached to legal documents (client-side File objects)
  legalDocuments: z.array(z.string()),
  legalDocumentsFiles: fileArrayPreprocess,
  reviewDueDate: z.string().optional().or(z.literal("")),
  responsiblePerson: z.string().optional().or(z.literal("")),
  notesSummary: z.string().optional().or(z.literal("")),
  metadata: z.record(z.string(), z.unknown()).optional(),
  status: z
    .enum(["active", "inactive", "archived"])
    .optional()
    .default("active"),
});

export type LegalForm = z.input<typeof legalFormSchema>; // <-- IMPORTANT: use z.input
export type LegalApiPayload = z.infer<typeof legalFormSchema>; // if you ever want parsed type

export default legalFormSchema;
