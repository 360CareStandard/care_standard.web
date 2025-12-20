import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Add, CloseCircle, TickCircle } from "iconsax-react";
import { MissingHealthInfoCard } from "./components/missing-info-card";
import { useClientGpSupport } from "@/hooks/client/useClientGpSupport";
import { useNavigate, useParams } from "react-router-dom";
import { useClientContacts } from "@/hooks/client/useClientContacts";
import React from "react";
import { useClientHealthDetails } from "@/hooks/client/useClientHealthDetailts";
import { SheetForm } from "@/components/shared/sheet-form";
import medicationSchema, { MedicationForm } from "../../schemas/medication";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/shared/spinner";
import toast from "react-hot-toast";
import { MedicationAccordion } from "../components/accordion/medication-accordion";
import {
  useCreateMedication,
  useMedications,
  useResolveMedication,
  useStopMedication,
  useUpdateMedication,
} from "@/hooks/client/useMedication";
import { Medication } from "@/types/client/medication";
import { MedicationDetailSheet } from "./components/medication-detail-sheet";
import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MedicationList } from "./components/medication-list";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const initialMedicationValues: MedicationForm = {
  // createdBy: "",
  medicationName: "",
  dosage: "",
  route: "oral",
  frequency: "",
  doseInstruction: "",
  doseTimes: [],
  startDate: "",
  endDate: null,
  noEndDate: false,
  prescriberName: "",
  additionalInstructions: "",
  administeredBy: "carer",
  linkedCareDomain: "",
  metadata: {
    source: "web-app",
  },
};

const Medications = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [viewing, setViewing] = React.useState<Medication | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [stopTarget, setStopTarget] = React.useState<Medication | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [openResolve, setOpenResolve] = React.useState(false);
  const [value, setValue] = React.useState("");
  const navigate = useNavigate();
  const HEALTH_ROUTES: Record<string, string> = {
    "GP details": `/app/clients/${clientId}/info?tab=gp-support`,
    "Emergency contact": `/app/clients/${clientId}/info?tab=contact-next-of-kin`,
    Allergies: `/app/clients/${clientId}/info?tab=health`,
  };
  const { data: gp, isLoading: gpLoading } = useClientGpSupport(
    clientId as string,
    Boolean(clientId)
  );

  const { data: contacts, isLoading: contactsLoading } = useClientContacts(
    clientId as string
  );
  const { data: allergies, isLoading: allergiesLoading } =
    useClientHealthDetails(clientId as string, Boolean(clientId));

  const { data, isLoading } = useMedications(clientId as string);
  const medications: Medication[] = data?.medications ?? [];

  const createMedication = useCreateMedication(clientId as string);
  const updateMedication = useUpdateMedication(clientId as string);
  const stopMedication = useStopMedication(clientId as string);
  const resolveMedication = useResolveMedication(clientId as string);

  const methods = useForm<MedicationForm>({
    resolver: zodResolver(medicationSchema) as unknown as Resolver<
      MedicationForm,
      any
    >,
    mode: "onChange",
    defaultValues: initialMedicationValues as MedicationForm,
  });
  const mapApiToFormValues = (medication: Medication): MedicationForm => ({
    medicationName: medication.medicationName,
    dosage: medication.dosage,
    route: medication.route,
    frequency: medication.frequency,
    doseInstruction: medication.doseInstruction,
    doseTimes: medication.doseTimes,
    startDate: medication.startDate,
    endDate: medication.endDate,
    noEndDate: medication.noEndDate,
    prescriberName: medication.prescriberName,
    additionalInstructions: medication.additionalInstructions,
    administeredBy: medication.administeredBy,
    linkedCareDomain: medication.linkedCareDomain,
    metadata: medication.metadata ?? { source: "web-app" },
  });
  const openForEdit = (medication: Medication) => {
    const mapped = mapApiToFormValues(medication);
    methods.reset(mapped as any);
    setEditingId(medication.id);
    setOpen(true);
  };
  const handleView = (medication: Medication) => {
    setViewing(medication);
    setViewOpen(true);
  };

  const requestStop = (medication: Medication) => {
    setStopTarget(medication);
    setConfirmOpen(true);
  };

  const confirmStop = async () => {
    if (!stopTarget) return;
    if (value.trim() === "") {
      toast.error("Please enter reason to confirm.");
      return;
    }

    try {
      await stopMedication.mutateAsync({
        medicationId: stopTarget.id,
        body: { stopReason: value.trim(), status: "stopped" },
      });
      toast.success("Medication stopped");
    } catch {
      toast.error("Could not stop medication");
    } finally {
      setValue("");
      setConfirmOpen(false);
      setStopTarget(null);
    }
  };
  const requestResolve = (medication: Medication) => {
    setStopTarget(medication);
    setOpenResolve(true);
  };

  const confirmResolve = async () => {
    if (!stopTarget) return;
    try {
      await resolveMedication.mutateAsync({
        medicationId: stopTarget.id,
      });
      toast.success("Medication Resolved");
    } catch {
      toast.error("Could not resolve medication");
    } finally {
      setOpenResolve(false);
      setStopTarget(null);
    }
  };

  const isHealthInfoLoading = gpLoading || contactsLoading || allergiesLoading;

  const missingHealthInfo = React.useMemo(() => {
    const missing: string[] = [];
    if (!gp) missing.push("GP details");
    if (!contacts?.length) missing.push("Emergency contact");
    if (!allergies) missing.push("Allergies");
    return missing;
  }, [gp, contacts, allergies]);

  const hasRequiredHealthInfo = missingHealthInfo.length === 0;
  const openForAdd = () => {
    methods.reset(initialMedicationValues as any);
    setEditingId(null);
    setOpen(true);
  };
  const onSubmit = async (values: MedicationForm) => {
    try {
      const payload = { ...values };

      if (editingId) {
        await updateMedication.mutateAsync({
          medicationId: editingId,
          body: payload,
        });
        toast.success("Medication updated");
      } else {
        await createMedication.mutateAsync(payload);
        toast.success("Medication created");
      }

      setOpen(false);
      setEditingId(null);
      methods.reset(initialMedicationValues as any);
    } catch (err: any) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };
  const hasMedications = medications.length > 0;

  return (
    <div className="space-y-6 w-full flex-1 ">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-semibold">Medications</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            eMAR and medication administration records
          </p>
        </div>
        {hasMedications && (
          <Button size="sm" className="gap-2" onClick={openForAdd}>
            <Add className="w-4 h-4" />
            Add Medication
          </Button>
        )}
      </div>
      {/* BLOCKING HEALTH CHECK */}
      {!isHealthInfoLoading && !hasRequiredHealthInfo && (
        <MissingHealthInfoCard
          missing={missingHealthInfo}
          onResolve={() => {
            const firstMissing = missingHealthInfo[0];
            navigate(HEALTH_ROUTES[firstMissing]);
          }}
        />
      )}

      {/* Empty state when no plans */}
      {/* LOADING */}
      {isHealthInfoLoading && isLoading && (
        <div
          className=" mt-20  overflow-auto pb-4  bg-white shadow
      rounded-lg
      "
        >
          <DataTableSkeleton
            columnCount={10}
            rowCount={8}
            searchableColumnCount={1}
            filterableColumnCount={1}
            showViewOptions={false}
          />
        </div>
      )}

      {/* EMPTY */}
      {hasRequiredHealthInfo && !hasMedications && !isLoading && (
        <MedicationEmptyState
          hasRequiredHealthInfo={hasRequiredHealthInfo}
          openForAdd={openForAdd}
        />
      )}

      {/* DATA */}

      {hasRequiredHealthInfo && hasMedications && (
        <MedicationList
          medications={medications}
          clientId={clientId as string}
          onEdit={openForEdit}
          requestStop={requestStop}
          onResolve={requestResolve}
          onView={handleView}
        />
      )}

      {/* Sheet for Add / Edit */}
      <SheetForm
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setEditingId(null);
            methods.reset(initialMedicationValues as any);
          }
        }}
        title={editingId ? "Edit Medication" : "Add Medication"}
        description="Capture client's eMAR and medication administration records."
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={
          methods.formState.isSubmitting ? (
            <Spinner size="sm" />
          ) : editingId ? (
            "Save Changes"
          ) : (
            "Save Medications"
          )
        }
        submitDisabled={methods.formState.isSubmitting}
        onSubmit={handleSheetSubmit}
      >
        <FormProvider {...methods}>
          <MedicationAccordion />
        </FormProvider>
      </SheetForm>
      <MedicationDetailSheet
        open={viewOpen}
        onOpenChange={setViewOpen}
        medication={viewing}
        onEdit={openForEdit}
        requestStop={requestStop}
        requestResolve={requestResolve}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        handleConfirm={confirmStop}
        disabled={stopMedication.isPending}
        isLoading={stopMedication.isPending}
        className="!bg-[#F9FAFB] !max-w-xl"
        title={<span>Stop Medication?</span>}
        desc={
          <div className="space-y-6">
            <p className="mb-2">
              Are you sure you want to stop{" "}
              <span className="font-bold">{stopTarget?.medicationName}</span>?
              <br />
            </p>
            <div className="rounded-lg border bg-white p-4 space-y-3">
              <p className="text-sm ">Stopping will:</p>

              <ul className="space-y-2">
                {[
                  "Archive this item",
                  "Remove upcoming doses",
                  "Keep all past records",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CloseCircle className="h-5 w-5 text-orange-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Label className="my-2">Reason for stopping</Label>
            <Textarea
              className="mt-2 bg-white min-h-20"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="...."
            />
          </div>
        }
        confirmText="Stop Medication"
        destructive
      />
      <ConfirmDialog
        open={openResolve}
        onOpenChange={setOpenResolve}
        handleConfirm={confirmResolve}
        disabled={resolveMedication.isPending}
        isLoading={resolveMedication.isPending}
        className="!bg-[#F9FAFB] !max-w-xl"
        title={<span>Resolve Medication?</span>}
        desc={
          <div className="space-y-6">
            <p className="mb-2">
              Are you sure you want to resolve{" "}
              <span className="font-bold">{stopTarget?.medicationName}</span>?
              <br />
            </p>
            <div className="rounded-lg border bg-white p-4 space-y-3">
              <p className="text-sm ">Resolving will:</p>

              <ul className="space-y-2">
                {[
                  "Return medication to active lists",
                  "Remove from stopped lists",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <TickCircle className="h-5 w-5 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Label className="my-2">Reason for resolving (optional)</Label>
            <Textarea className="mt-2 bg-white min-h-20" placeholder="...." />
          </div>
        }
        confirmText="Resolve Medication"
      />
    </div>
  );
};

export default Medications;

const MedicationEmptyState = ({
  hasRequiredHealthInfo,
  openForAdd,
}: {
  openForAdd: () => void;
  hasRequiredHealthInfo: boolean;
}) => {
  return (
    <Card className="flex-1 mt-8 mx-auto w-full ">
      <CardContent className="flex flex-col items-center justify-center py-6 gap-3">
        <Capsule />
        <h4 className="font-semibold">No medications have been added yet.</h4>
        <p className="text-muted-foreground text-sm text-center max-w-xl">
          Add the first medication to start tracking doses for clients.
        </p>
        <Button
          onClick={openForAdd}
          className="text-xs mt-1"
          disabled={!hasRequiredHealthInfo}
        >
          <Add className="w-4 h-4" />
          Add Medication
        </Button>
      </CardContent>
    </Card>
  );
};

const Capsule = () => {
  return (
    <svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1952_67158)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.1085 2.73867C14.3304 0.989271 11.933 0.013359 9.43859 0.023516C6.94418 0.033673 4.55484 1.02908 2.79101 2.7929C1.02718 4.55673 0.0317809 6.94607 0.0216239 9.44048C0.0114669 11.9349 0.987379 14.3323 2.73678 16.1104L13.8786 27.2553C15.652 29.0287 18.0572 30.025 20.5652 30.025C23.0732 30.025 25.4784 29.0287 27.2518 27.2553C29.0253 25.4819 30.0215 23.0767 30.0215 20.5687C30.0215 18.0607 29.0253 15.6554 27.2518 13.882L25.0235 11.6552C25.0062 11.6384 24.9889 11.6216 24.9715 11.6048L16.1085 2.73867ZM17.8105 8.89896L13.8801 4.96703C12.6979 3.78483 11.0945 3.12067 9.42264 3.12067C7.75075 3.12067 6.14734 3.78483 4.96514 4.96703C3.78294 6.14923 3.11878 7.75264 3.11878 9.42453C3.11878 11.0964 3.78294 12.6998 4.96514 13.882L8.89707 17.814C9.02276 15.4903 10.004 13.2953 11.6518 11.6521C13.2945 10.0056 15.4881 9.02499 17.8105 8.89896ZM16.1085 25.0254C17.2907 26.2076 18.8941 26.8717 20.566 26.8717C22.2379 26.8717 23.8413 26.2076 25.0235 25.0254C26.2057 23.8432 26.8698 22.2398 26.8698 20.5679C26.8698 18.896 26.2057 17.2926 25.0235 16.1104L22.7542 13.8411C21.5665 12.6643 19.9601 12.0075 18.2882 12.0152C16.6163 12.0229 15.0159 12.6944 13.8392 13.882C12.6624 15.0697 12.0056 16.6761 12.0133 18.348C12.021 20.0199 12.6925 21.6203 13.8801 22.797L16.1085 25.0254Z"
          fill="#191D31"
        />
      </g>
      <defs>
        <clipPath id="clip0_1952_67158">
          <rect width={30} height={30} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
