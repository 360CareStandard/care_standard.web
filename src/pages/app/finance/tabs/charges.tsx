import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ChargesTable from "../components/charges-table/charges-table";
import ChargesToolbar from "../components/charges-table/charges-toolbar";
import { Info } from "lucide-react";

const ChargesTab = () => {
  const [client, setClient] = useState("all");
  const [status, setStatus] = useState("billed");
  const [rateType, setRateType] = useState("all");

  return (
    <Card className="rounded-lg border shadow-none">
      <CardContent className="space-y-4">
        <ChargesToolbar
          client={client}
          status={status}
          rateType={rateType}
          onClientChange={setClient}
          onStatusChange={setStatus}
          onRateTypeChange={setRateType}
        />
        <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 my-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-blue-600">
              <Info className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-900">
                Charges are automatically created from completed visits
              </p>

              <p className="mt-0.5 text-xs text-blue-600">
                Visit data flows into charges, which are then grouped into
                invoices.
              </p>
            </div>
          </div>
        </div>
        <ChargesTable
          initialPage={1}
          initialLimit={10}
          client={client}
          status={status}
          rateType={rateType}
        />
      </CardContent>
    </Card>
  );
};

export default ChargesTab;
