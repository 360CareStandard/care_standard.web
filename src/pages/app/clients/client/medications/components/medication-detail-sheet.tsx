import { SheetForm } from "@/components/shared/sheet-form";
import { Medication } from "@/types/client/medication";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { callTypes } from "../../../components/data/data";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoRow } from "../../components/info-row";
import dayjs from "dayjs";
import { Edit, Trash } from "iconsax-react";
import { Undo } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  medication: Medication | null;
  requestStop: (med: Medication) => void;
  requestResolve: (med: Medication) => void;
  onEdit: (med: Medication) => void;
}

export function MedicationDetailSheet({
  open,
  onOpenChange,
  medication,
  onEdit,
  requestStop,
  requestResolve,
}: Props) {
  if (!medication) return null;
  const badgeColor = callTypes.get(medication.status);

  return (
    <SheetForm
      open={open}
      onOpenChange={onOpenChange}
      title="Medication Details"
      description="View medication and administration information"
      submitLabel={null}
    >
      <div className="flex-1 overflow-y-auto py-5 space-y-6">
        {/* top row: status + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex space-x-2">
            <Badge variant="outline" className={cn("capitalize", badgeColor)}>
              {medication.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="flex gap-2">
            {medication.status === "active" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(medication)}
              >
                <Edit />
                Update
              </Button>
            )}
            {medication.status === "active" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => requestStop?.(medication)}
              >
                <Trash />
                Stop
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => requestResolve?.(medication)}
              >
                <Undo />
                Resolve
              </Button>
            )}
          </div>
        </div>

        {/* title + meta */}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">
            {medication.medicationName} {medication.dosage}
          </h2>
          <p className="text-xs text-muted-foreground">
            Created: {dayjs(medication.startDate).format("DD MMM YYYY")}
            {medication.prescriberName && (
              <>
                {" "}
                | By:{" "}
                <span className="font-medium">{medication.prescriberName}</span>
              </>
            )}
          </p>
        </div>
        <Tabs defaultValue="overview">
          <TabsList className=" justify-start rounded-none border-b bg-transparent p-0">
            {["overview", "audit"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {tab === "overview"
                  ? "Overview"
                  : tab[0].toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="border grid grid-cols-1 lg:grid-cols-2 rounded-2xl px-5 py-2  bg-white shadow shadow-gray-50">
              <InfoRow label="Dosage">{medication.dosage}</InfoRow>
              <InfoRow label="Route">{medication.route}</InfoRow>
              <InfoRow label="Frequency">{medication.frequency}</InfoRow>
              <InfoRow label="Dose">{medication.doseInstruction}</InfoRow>
              {medication.doseTimes.map((d, i) => (
                <InfoRow label={`Time of Dose ${i + 1}`}>{d}</InfoRow>
              ))}
              <InfoRow label="Start Date">
                {dayjs(medication.startDate).format("DD MMMM YYYY")}
              </InfoRow>
              <InfoRow label="End Date">
                {medication.noEndDate
                  ? "No end date"
                  : dayjs(medication.endDate).format("DD MMMM YYYY")}
              </InfoRow>
            </div>
            <div className="border  rounded-2xl px-5 py-2  bg-white shadow shadow-gray-50">
              <InfoRow label="Prescriber">{medication.prescriberName}</InfoRow>
              <InfoRow label="Instructions">
                {medication.additionalInstructions}
              </InfoRow>
            </div>
            <div className="border  rounded-2xl px-5 py-2  bg-white shadow shadow-gray-50">
              <InfoRow label="Administered By">
                {medication.administeredBy}
              </InfoRow>
              {medication.linkedCareDomain && (
                <InfoRow label="Linked Care Domain">
                  {medication.linkedCareDomain}
                </InfoRow>
              )}
            </div>
          </TabsContent>
          <TabsContent value="audit" className="mt-4">
            <div className="border rounded-2xl px-5 py-2 bg-white ">
              <InfoRow label="Created">
                {" "}
                {new Date(medication.createdAt).toLocaleString()}
                {medication.createdBy && ` by ${medication.createdBy}`}
              </InfoRow>
              <InfoRow label="Last Updated">
                {" "}
                {new Date(medication.updatedAt).toLocaleString()}
                {medication.updatedBy && ` by ${medication.updatedBy}`}
              </InfoRow>
              <InfoRow label="Status">
                {" "}
                <p className="capitalize">{medication.status}</p>
              </InfoRow>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SheetForm>
  );
}
