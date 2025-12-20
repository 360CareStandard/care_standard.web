import { Medication } from "@/types/client/medication";
import MedicationTable from "./table/medication-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMedications } from "@/hooks/client/useMedication";
import React from "react";

interface Props {
  medications: Medication[];
  onView: (med: Medication) => void;
  requestStop: (med: Medication) => void;
  onEdit: (med: Medication) => void;
  onResolve: (med: Medication) => void;
  clientId: string;
}

export function MedicationList({
  requestStop,
  onView,
  onEdit,
  onResolve,
  clientId,
}: Props) {
  const [tab, setTab] = React.useState<"active" | "stopped">("active");

  const statusParam = tab === "active" ? "active" : "stopped";

  const { data, isLoading } = useMedications(clientId, {
    page: 1,
    limit: 10,
    status: statusParam,
  });

  const rows = data?.medications ?? [];

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mt-12">
      <TabsList className="justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="active"
          className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Active Medications
        </TabsTrigger>

        <TabsTrigger
          value="stopped"
          className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Stopped Medications
        </TabsTrigger>
      </TabsList>

      <TabsContent value={tab} className="mt-4">
        <div className="overflow-auto rounded-lg bg-white pb-4 shadow">
          <MedicationTable
            rows={rows}
            clientId={clientId}
            onEdit={onEdit}
            onStop={requestStop}
            onView={onView}
            onResolve={onResolve}
            isLoading={isLoading}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
