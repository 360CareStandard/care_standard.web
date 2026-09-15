import { Card, CardContent } from "@/components/ui/card";
import PaymentTable from "../components/payments-table/payment-table";
import { useState } from "react";
import PaymentsToolbar from "../components/payments-table/payment-toolbar";
import { Payment } from "@/types/finance/payments";

interface Props {
  openDetailSheet: (paymentId: string) => void;
  openConfirmPaymentModal: (payment: Payment) => void;
}

const PaymentsTab = ({ openDetailSheet, openConfirmPaymentModal }: Props) => {
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
          openConfirmPaymentModal={openConfirmPaymentModal}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentsTab;
