import { Card, CardContent } from "@/components/ui/card";
import InvoiceTable from "../components/invoice-table/invoice-table";

interface Props {
  openDetailSheet: (invoiceId: string) => void;
}
const InvoicesTab = ({ openDetailSheet }: Props) => {
  return (
    <Card className=" rounded-lg border shadow-none ">
      <CardContent>
        <InvoiceTable
          initialPage={1}
          initialLimit={10}
          openDetailSheet={openDetailSheet}
        />
      </CardContent>
    </Card>
  );
};

export default InvoicesTab;
