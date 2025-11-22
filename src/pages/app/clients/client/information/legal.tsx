// pages/legal/Legal.tsx
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
import { DocIcon } from "../icons/doc";
import { LegalSetupAccordion } from "../components/legal-accordion";

import legalFormSchema, { type LegalForm } from "../../schemas/legal-setup";
import {
  useClientLegalProfile,
  useCreateClientLegalProfile,
  useUpdateClientLegalProfile,
} from "@/hooks/client/useClientLegalProfile";
import toast from "react-hot-toast";
import { ClientLegalProfile } from "@/types/client/legal-profile";
import { LegalProfile } from "../../components/legal-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUpdatedAt } from "@/helpers/last-updated";
import { Spinner } from "@/components/shared/spinner";

function formatDateForInput(d?: string | null) {
  if (!d) return "";
  const date = new Date(d);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function mapApiToFormValues(api?: ClientLegalProfile): Partial<LegalForm> {
  if (!api) return {};
  return {
    powerOfAttorney: api.powerOfAttorney ?? "none",
    poaHolderName: api.poaHolderName ?? "",
    poaContact: api.poaContact ?? "",
    poaValidFrom: api.poaValidFrom ? formatDateForInput(api.poaValidFrom) : "",
    mentalCapacity: api.mentalCapacity ?? "has-capacity",
    dnarActive: Boolean(api.dnarActive),
    dnarReason: api.dnarReason ?? "",
    dnarSignedDate: api.dnarSignedDate
      ? formatDateForInput(api.dnarSignedDate)
      : "",
    hasDoLS: Boolean(api.hasDoLS),
    hasLPS: Boolean(api.hasLPS),
    hasCourtOrder: Boolean(api.hasCourtOrder),
    hasGuardianship: Boolean(api.hasGuardianship),
    legalReferenceNumber: api.legalReferenceNumber ?? "",
    legalResponsibleAuthority: api.legalResponsibleAuthority ?? "",
    legalStartDate: api.legalStartDate
      ? formatDateForInput(api.legalStartDate)
      : "",
    legalEndDate: api.legalEndDate ? formatDateForInput(api.legalEndDate) : "",
    dataSharingConsent: Boolean(api.dataSharingConsent),
    dataSharingConsentDate: api.dataSharingConsentDate
      ? formatDateForInput(api.dataSharingConsentDate)
      : "",
    dataSharingConsentSignedBy: api.dataSharingConsentSignedBy ?? "",
    dataSharingScope: api.dataSharingScope ?? "",
    photoConsent: Boolean(api.photoConsent),
    contactConsentEmail: Boolean(api.contactConsentEmail),
    contactConsentSMS: Boolean(api.contactConsentSMS),
    contactConsentPhone: Boolean(api.contactConsentPhone),
    familyAppPermission: Boolean(api.familyAppPermission),
    legalDocuments: api.legalDocuments ?? [],
    reviewDueDate: api?.reviewDueDate
      ? formatDateForInput(api.reviewDueDate)
      : "",
    responsiblePerson: api?.responsiblePerson ?? "",
    notesSummary: api?.notesSummary ?? "",
    metadata: api.metadata ?? {},
    status: api.status ?? "active",
  } as Partial<LegalForm>;
}

const initialFormValues: Partial<LegalForm> = {
  powerOfAttorney: "none",
  poaHolderName: "",
  poaContact: "",
  poaValidFrom: "",
  mentalCapacity: "has-capacity",
  dnarActive: false,
  dnarReason: "",
  dnarSignedDate: "",
  hasDoLS: false,
  hasLPS: false,
  hasCourtOrder: false,
  hasGuardianship: false,
  legalReferenceNumber: "",
  legalResponsibleAuthority: "",
  legalStartDate: "",
  legalEndDate: "",
  dataSharingConsent: false,
  dataSharingConsentDate: "",
  dataSharingConsentSignedBy: "",
  dataSharingScope: "",
  photoConsent: false,
  contactConsentEmail: false,
  contactConsentSMS: false,
  contactConsentPhone: false,
  familyAppPermission: false,
  legalDocuments: [],
  legalDocumentsFiles: [],
  reviewDueDate: "",
  responsiblePerson: "",
  notesSummary: "",
  metadata: {},
  status: "active",
};
type Props = {
  clientId: string;
};

const Legal = ({ clientId }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [editingData, setEditingData] = React.useState<any | null>(null);

  const createLegal = useCreateClientLegalProfile(clientId);
  const updateLegal = useUpdateClientLegalProfile(clientId);
  const { data: clientLegalProfile, isLoading } = useClientLegalProfile(
    clientId,
    Boolean(clientId)
  );

  const methods = useForm<LegalForm>({
    resolver: zodResolver(legalFormSchema),
    mode: "onChange",
    defaultValues: initialFormValues as any,
  });

  // Optional: console.log full form values whenever user submits or as they change
  // React.useEffect(() => {
  //   const subscription = methods.watch((value) => {
  //     console.log("FORM VALUES (live):", value);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [methods]);

  const openForAdd = () => {
    methods.reset(initialFormValues as any);
    setEditingData(null);
    setOpen(true);
  };

  // Example: open with API data
  const openForEdit = (apiRecord: ClientLegalProfile) => {
    const mapped = mapApiToFormValues(apiRecord);
    methods.reset({
      ...mapped,
      legalDocuments: apiRecord.legalDocuments ?? [],
    });
    setEditingData(apiRecord);
    setOpen(true);
  };

  // Build FormData for multipart/form-data send
  function buildFormData(values: LegalForm) {
    const fd = new FormData();

    const appendIf = (k: string, v: any) => {
      if (v === undefined || v === null) return;
      if (typeof v === "boolean") return fd.append(k, String(v));
      if (v === "") return; // skip empty strings if you prefer
      fd.append(k, String(v));
    };

    // primitives (example subset — include all your fields similarly)
    appendIf("powerOfAttorney", values.powerOfAttorney);
    appendIf("poaHolderName", values.poaHolderName);
    appendIf("poaContact", values.poaContact);
    appendIf("poaValidFrom", values.poaValidFrom);
    appendIf("mentalCapacity", values.mentalCapacity);
    appendIf("dnarActive", values.dnarActive);
    appendIf("dnarReason", values.dnarReason);
    appendIf("dnarSignedDate", values.dnarSignedDate);
    appendIf("hasDoLS", values.hasDoLS);
    appendIf("hasLPS", values.hasLPS);
    appendIf("hasCourtOrder", values.hasCourtOrder);
    appendIf("hasGuardianship", values.hasGuardianship);
    appendIf("legalReferenceNumber", values.legalReferenceNumber);
    appendIf("legalResponsibleAuthority", values.legalResponsibleAuthority);
    appendIf("legalStartDate", values.legalStartDate);
    appendIf("legalEndDate", values.legalEndDate);
    appendIf("dataSharingConsent", values.dataSharingConsent);
    appendIf("dataSharingConsentDate", values.dataSharingConsentDate);
    appendIf("dataSharingConsentSignedBy", values.dataSharingConsentSignedBy);
    appendIf("dataSharingScope", values.dataSharingScope);
    appendIf("photoConsent", values.photoConsent);
    appendIf("contactConsentEmail", values.contactConsentEmail);
    appendIf("contactConsentSMS", values.contactConsentSMS);
    appendIf("contactConsentPhone", values.contactConsentPhone);
    appendIf("familyAppPermission", values.familyAppPermission);
    appendIf("reviewDueDate", values.reviewDueDate ?? "");
    appendIf("responsiblePerson", values.responsiblePerson ?? "");
    appendIf("notesSummary", values.notesSummary ?? "");

    // // send legalDocuments metadata fields as top-level keys (your screenshot shows them top-level)
    // if (values.legalDocuments && typeof values.legalDocuments === "object") {
    //   const ld = values.legalDocuments as Record<string, any>;
    // }

    // IMPORTANT: append files under the API key 'legalDocuments'
    // read from internal client-side field 'legalDocumentsFiles'
    const files = (values as any).legalDocumentsFiles as File[] | undefined;
    if (Array.isArray(files) && files.length) {
      files.forEach((f) => {
        // append using API key name the server expects
        fd.append("legalDocuments", f, f.name);
      });
    }

    // metadata as JSON if present
    // if (values.metadata && Object.keys(values.metadata).length > 0) {
    //   fd.append("metadata", JSON.stringify(values.metadata));
    // }

    appendIf("status", values.status ?? "active");
    return fd;
  }

  const onSubmit = async (values: LegalForm) => {
    try {
      // Build FormData using your helper
      const fd = buildFormData(values);

      // If editingData exists (you're in edit mode), call update; else create
      if (editingData && editingData.id) {
        // Option A: If backend requires the resource id in the URL, ensure updateForm uses it
        // and your hook or ClientCarePlanApi.updateForm handles it.
        await updateLegal.mutateAsync(fd);
        toast.success("Legal profile updated");
      } else {
        await createLegal.mutateAsync(fd);
        toast.success("Legal profile created");
      }

      setOpen(false);
      setEditingData(null);
      methods.reset(initialFormValues as any);
    } catch (err: any) {
      console.error("Save failed", err);
      toast.error(err?.message ?? "Save failed");
    }
  };

  // SheetForm submit event handler (prevents default and triggers RHF submit)
  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <>
      <Card>
        <CardContent
          className={`grid grid-cols-1 ${
            clientLegalProfile ? "gap-8" : "sm:grid-cols-2 gap-16"
          } `}
        >
          {!isLoading && clientLegalProfile ? (
            <div className="flex justify-between items-center gap-4">
              <div className=" space-y-1">
                <h2 className="font-bold text-xl">Legal</h2>
                <p className="text-xs text-muted-foreground">
                  {formatUpdatedAt(clientLegalProfile.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  {clientLegalProfile?.status.charAt(0).toUpperCase() +
                    clientLegalProfile.status.slice(1)}
                </span>
                <Button
                  onClick={() => openForEdit(clientLegalProfile)}
                  variant="outline"
                  className="gap-2"
                >
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.16699 1.66602H7.50033C3.33366 1.66602 1.66699 3.33268 1.66699 7.49935V12.4993C1.66699 16.666 3.33366 18.3327 7.50033 18.3327H12.5003C16.667 18.3327 18.3337 16.666 18.3337 12.4993V10.8327"
                      stroke="#61779C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.3666 2.51639L6.7999 9.08306C6.5499 9.33306 6.2999 9.82472 6.2499 10.1831L5.89157 12.6914C5.75823 13.5997 6.3999 14.2331 7.30823 14.1081L9.81657 13.7497C10.1666 13.6997 10.6582 13.4497 10.9166 13.1997L17.4832 6.63306C18.6166 5.49972 19.1499 4.18306 17.4832 2.51639C15.8166 0.849722 14.4999 1.38306 13.3666 2.51639Z"
                      stroke="#61779C"
                      strokeWidth="1.5"
                      strokeMiterlimit={10}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.4248 3.45898C12.9831 5.45065 14.5415 7.00898 16.5415 7.57565"
                      stroke="#61779C"
                      strokeWidth="1.5"
                      strokeMiterlimit={10}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Update Legal Info
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-xl">Legal</h2>
              <p className="text-sm text-muted-foreground">
                Record legal status, consent and authorised contacts that affect
                this client's care
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={openForAdd}
                  variant="outline"
                  className="gap-2"
                >
                  <PlusIcon />
                  Add Legal Info
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            // <div className="col-span-2 sm:col-span-2">
            //   <CareSetupSkeleton />
            // </div>
            <div className="space-y-4 p-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ) : clientLegalProfile ? (
            <LegalProfile data={clientLegalProfile} />
          ) : (
            <EmptyStateCard
              icon={<DocIcon />}
              title="No legal documents or consent records have been added"
              description="Record Power of Attorney, DNAR, mental capacity notes, data-sharing consent, court orders and signed documents for audit, compliance and to safely invite family users."
              btnText="Add Legal Info"
              button
              onClick={openForAdd}
            />
          )}
        </CardContent>
      </Card>

      <SheetForm
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setEditingData(null);
            methods.reset(initialFormValues as any);
          }
        }}
        title={editingData ? "Edit Legal Info" : "Add Legal Information"}
        description="Record legal status, consent and authorization details."
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitDisabled={methods.formState.isSubmitting}
        submitLabel={
          methods.formState.isSubmitting ? (
            <Spinner size="sm" />
          ) : editingData ? (
            "Save Changes"
          ) : (
            "Save Legal Info"
          )
        }
        onSubmit={handleSheetSubmit}
      >
        <FormProvider {...methods}>
          <LegalSetupAccordion />
        </FormProvider>
      </SheetForm>
    </>
  );
};

export default Legal;
