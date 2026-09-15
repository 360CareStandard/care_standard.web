import { SheetForm } from "@/components/shared/sheet-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SinglePageLoader from "@/components/loading/single-page-loader";
import { Invoice } from "@/types/finance/single-invoice";
import { Download, FileText } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Invoice | undefined;
  isLoading?: boolean;
};

const statusStyles: Record<Invoice["status"], string> = {
  draft: "bg-gray-100 text-gray-700 border-gray-200",
  sent: "bg-blue-100 text-blue-700 border-blue-200",
  paid: "bg-green-100 text-green-700 border-green-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);
};

const formatDateRange = (start: string, end: string) => {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
};

export function InvoiceDetailsSheet({
  open,
  onOpenChange,
  item,
  isLoading,
}: Props) {
  if (isLoading) return <SinglePageLoader />;
  if (!item) return null;

  const clientName = `${item.client.firstname} ${item.client.lastname}`.trim();

  return (
    <SheetForm
      open={open}
      onOpenChange={onOpenChange}
      title="Invoice Details"
      description=""
      submitLabel=""
      submitDisabled
    >
      <div className="flex min-h-full flex-col">
        {/* Invoice Header */}
        <div className="border-b pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-50">
                <FileText className="h-4 w-4 text-green-700" />
              </div>

              <div>
                <h3 className="font-semibold text-sm">{item.invoiceNumber}</h3>

                <p className="text-xs text-muted-foreground">
                  {formatDateRange(item.periodStart, item.periodEnd)}
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
                statusStyles[item.status] ??
                "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              {item.status}
            </Badge>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="flex-1 space-y-5 py-4">
          {/* Bill To */}
          <section>
            <h4 className="mb-2 text-xs font-semibold">Bill To</h4>

            <Card className="shadow-none">
              <CardContent className="p-3">
                <p className="text-sm font-medium">{clientName}</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.billToAddress || "No billing address provided."}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Visit Breakdown */}
          <section>
            <h4 className="mb-2 text-xs font-semibold">Visit Breakdown</h4>

            <div className="overflow-hidden rounded-md border">
              {/* Table Header */}
              <div className="grid grid-cols-[1.1fr_0.8fr_0.9fr_1.1fr_1fr] border-b bg-muted/30 px-3 py-2 text-[10px] font-medium text-muted-foreground">
                <span>Date</span>
                <span>Time</span>
                <span>Duration</span>
                <span>Rate</span>
                <span className="text-right">Amount</span>
              </div>

              {/* Rows */}
              <div>
                {item.visitBreakdown.rows.map((row, index) => (
                  <div
                    key={`${row.date}-${row.time}-${index}`}
                    className="grid grid-cols-[1.1fr_0.8fr_0.9fr_1.1fr_1fr] items-center border-b px-3 py-2.5 last:border-b-0"
                  >
                    <div className="text-[10px]">{row.date}</div>

                    <div className="text-[10px] text-muted-foreground">
                      {row.time}
                    </div>

                    <div className="text-[10px]">{row.duration}</div>

                    <div>
                      <p className="text-[10px]">{row.rate}</p>

                      <p className="text-[9px] text-muted-foreground">
                        {row.rateName}
                      </p>
                    </div>

                    <div className="text-right text-[10px] font-medium">
                      {row.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Totals */}
          <Card className="shadow-none">
            <CardContent className="divide-y p-0">
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-xs text-muted-foreground">
                  Total Hours
                </span>

                <span className="text-xs font-medium">
                  {item.visitBreakdown.totalHours}
                </span>
              </div>

              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-xs font-medium">Total Amount</span>

                <span className="text-sm font-semibold">
                  {item.visitBreakdown.totalAmount}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          {(item.amountPaid > 0 || item.paidAt || item.paymentMethod) && (
            <section>
              <h4 className="mb-2 text-xs font-semibold">Payment</h4>

              <Card className="shadow-none">
                <CardContent className="space-y-2 p-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Amount Paid
                    </span>

                    <span className="text-xs font-medium">
                      {formatCurrency(item.amountPaid, item.currency)}
                    </span>
                  </div>

                  {item.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        Payment Method
                      </span>

                      <span className="text-xs font-medium capitalize">
                        {item.paymentMethod}
                      </span>
                    </div>
                  )}

                  {item.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        Paid On
                      </span>

                      <span className="text-xs font-medium">
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(item.paidAt))}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          )}

          {/* Notes */}
          {item.notes && (
            <section>
              <h4 className="mb-2 text-xs font-semibold">Notes</h4>

              <p className="rounded-md border bg-muted/20 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
                {item.notes}
              </p>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="border-t pt-3">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={() => {
              // TODO: connect this to your PDF download endpoint
            }}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </SheetForm>
  );
}
