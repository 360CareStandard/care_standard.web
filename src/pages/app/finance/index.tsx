import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Add } from "iconsax-react";
import React from "react";
import { useSearchParams } from "react-router-dom";
import OverviewTab from "./tabs/overview";
import InvoicesTab from "./tabs/invoices";
import ChargesTab from "./tabs/charges";
import PaymentsTab from "./tabs/paymentsTab";
import SettingsTab from "./tabs/settingsTab";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FinanceFormData,
  financeSchema,
  paymentFormSchema,
  PaymentFormType,
} from "@/pages/schemas/finance";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FinanceFormField from "./form/generate-invoice";
import {
  useConfirmPayment,
  useGenerateInvoice,
  useInvoice,
} from "@/hooks/finance/useFinance";
import { handleFormApiError } from "@/lib/handle-form-error";
import toast from "react-hot-toast";
import { Spinner } from "@/components/shared/spinner";
import { InvoiceDetailsSheet } from "./components/single-invoice";
import { Payment } from "@/types/finance/payments";
import PaymentFormField from "./form/confirm-payment";

const TAB_KEYS = [
  "overview",
  "invoices",
  "charges",
  "payments",
  "settings",
] as const;
type TabKey = (typeof TAB_KEYS)[number];

const resolver = zodResolver(
  financeSchema,
) as unknown as Resolver<FinanceFormData>;
const paymentResolver = zodResolver(
  paymentFormSchema,
) as unknown as Resolver<PaymentFormType>;

const Finance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [invoiceId, setSelectedInvoiceId] = React.useState<string | undefined>(
    undefined,
  );
  const [payment, setSelectedPayment] = React.useState<Payment | null>(null);
  const { mutateAsync: generateInvoice, isPending: isCreating } =
    useGenerateInvoice();
  const { mutateAsync: confirmPayment, isPending: isConfirming } =
    useConfirmPayment(payment?.invoiceId ?? "");
  const { data: invoiceDetails, isLoading: invoiceDetailsLoading } = useInvoice(
    invoiceId,
    Boolean(invoiceId),
  ); // disable auto-fetch
  React.useEffect(() => {
    if (!payment) return;

    paymentMethods.reset({
      amount: payment.amount,
      paymentMethod: payment.method ?? "",
      datePaid: payment.datePaid ?? "",
      paymentReference: "",
    });
  }, [payment]);
  const openDetailSheet = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setOpen(true);
  };
  const openConfirmPaymentModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };
  const methods = useForm<FinanceFormData>({
    resolver,
    defaultValues: {
      clientId: "",
      periodStart: "",
      periodEnd: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  const paymentMethods = useForm<PaymentFormType>({
    resolver: paymentResolver,
    defaultValues: {
      paymentProof: undefined,
      amount: 0,
      paymentMethod: "",
      datePaid: "",
      paymentReference: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });
  const raw = searchParams.get("tab") ?? "cases";
  const currentTab: TabKey = (TAB_KEYS as readonly string[]).includes(raw)
    ? (raw as TabKey)
    : "overview";

  const onTabChange = (next: string) => {
    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      sp.set("tab", next);
      return sp;
    });
  };

  React.useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams(
        (prev) => {
          const sp = new URLSearchParams(prev);
          sp.set("tab", "overview");
          return sp;
        },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams]);

  const onValidSubmit = async (vals: FinanceFormData) => {
    const payload = {
      ...vals,
    };

    try {
      await generateInvoice(payload);
      toast?.success?.("Invoice generated successfully");
      setConfirmOpen(false);
      methods.reset();
    } catch (err) {
      handleFormApiError<FinanceFormData>(
        err,
        methods.setError,
        "Failed to generate invoice",
      );
    }
  };

  const onPaymentSubmit = async (vals: PaymentFormType) => {
    try {
      const formData = new FormData();

      formData.append("paymentProof", vals.paymentProof);
      formData.append("paymentMethod", vals.paymentMethod);
      formData.append("datePaid", vals.datePaid);
      formData.append("amount", String(vals.amount));

      if (vals.paymentReference) {
        formData.append("paymentReference", vals.paymentReference);
      }

      await confirmPayment(formData);
      toast?.success?.("Payment Confirmed");

      setModalOpen(false);
      paymentMethods.reset();
    } catch (err) {
      handleFormApiError<PaymentFormType>(
        err,
        paymentMethods.setError,
        "Failed to submit request",
      );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold">Finance</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage billing, invoices, and payments
          </p>
        </div>
        <Button
          onClick={() => setConfirmOpen(true)}
          variant="default"
          className="gap-2"
        >
          <Add className="h-4 w-4" />
          Generate Invoice
        </Button>
      </div>

      <Tabs value={currentTab} onValueChange={onTabChange} className="mt-8">
        <TabsList className="justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="invoices"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Invoices
          </TabsTrigger>
          <TabsTrigger
            value="charges"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Charges
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Payments
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <InvoicesTab openDetailSheet={openDetailSheet} />
        </TabsContent>
        <TabsContent value="charges" className="mt-4">
          <ChargesTab />
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <PaymentsTab
            openDetailSheet={openDetailSheet}
            openConfirmPaymentModal={openConfirmPaymentModal}
          />
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <SettingsTab />
        </TabsContent>
      </Tabs>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-lg">
          <form
            onSubmit={methods.handleSubmit(onValidSubmit)}
            className="space-y-4"
          >
            <DialogHeader className="text-left">
              <DialogTitle>Generate invoice</DialogTitle>
              <DialogDescription>
                Select a client and date range to generate an invoice from
                unbilled charges.
              </DialogDescription>
            </DialogHeader>

            <FormProvider {...methods}>
              <FinanceFormField />
            </FormProvider>

            <DialogFooter className="w-full mt-10">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmOpen(false);
                  methods.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? <Spinner /> : "Generate Invoice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <form
            onSubmit={paymentMethods.handleSubmit(onPaymentSubmit)}
            className="space-y-4"
          >
            <DialogHeader className="text-left">
              <DialogTitle>Record Payment</DialogTitle>

              {payment && (
                <DialogDescription>
                  Record payment for {payment.invoiceNumber} -{" "}
                  {payment.client.firstname} {payment.client.lastname}
                </DialogDescription>
              )}
            </DialogHeader>

            <FormProvider {...paymentMethods}>
              <PaymentFormField />
            </FormProvider>

            <DialogFooter className="w-full mt-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setModalOpen(false);
                  paymentMethods.reset();
                }}
              >
                Cancel
              </Button>

              <Button type="submit">
                {isConfirming ? <Spinner /> : "Confirm Payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <InvoiceDetailsSheet
        open={open}
        onOpenChange={setOpen}
        item={invoiceDetails}
        isLoading={invoiceDetailsLoading}
      />
    </div>
  );
};

export default Finance;
