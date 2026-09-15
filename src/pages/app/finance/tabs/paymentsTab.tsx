import { Card, CardContent } from "@/components/ui/card";
import PaymentTable from "../components/payments-table/payment-table";
import { useState } from "react";
import PaymentsToolbar from "../components/payments-table/payment-toolbar";

interface Props {
  openDetailSheet: (paymentId: string) => void;
}

const PaymentsTab = ({ openDetailSheet }: Props) => {
  const [status, setStatus] = useState("paid");
  return (
    <Card className=" rounded-lg border shadow-none ">
      <CardContent className="space-y-4">
        <PaymentsToolbar status={status} onStatusChange={setStatus} />
        <PaymentTable
          initialPage={1}
          initialLimit={10}
          openDetailSheet={openDetailSheet}
          status={status}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentsTab;
