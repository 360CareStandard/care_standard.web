import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { TextField } from "@/components/shared/text-field";
import { TextareaField } from "@/components/shared/textarea-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import {
  invoicePreferencesSchema,
  InvoicePreferencesFormType,
} from "@/pages/schemas/finance";
import { Spinner } from "@/components/shared/spinner";
import {
  useCreateInvoicePreferences,
  useInvoicePreference,
} from "@/hooks/finance/useFinance";
import toast from "react-hot-toast";
import { handleFormApiError } from "@/lib/handle-form-error";
import React from "react";

const SettingsTab = () => {
  const { mutateAsync: createInvoicePreference, isPending: isCreating } =
    useCreateInvoicePreferences();
  const { data: invoicePref, isLoading } = useInvoicePreference();
  const form = useForm<InvoicePreferencesFormType>({
    resolver: zodResolver(invoicePreferencesSchema),
    defaultValues: {
      defaultBillingCycle: "weekly",
      invoiceNumberFormat: "INV-YYYY-###",
      defaultInvoiceNotes: "",
      autoSendInvoices: false,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    if (!invoicePref) return;

    form.reset({
      defaultBillingCycle: invoicePref.defaultBillingCycle,
      invoiceNumberFormat: invoicePref.invoiceNumberFormat ?? "",
      defaultInvoiceNotes: invoicePref.defaultInvoiceNotes ?? "",
      autoSendInvoices: invoicePref.autoSendInvoices ?? false,
    });
  }, [invoicePref]);
  const onSubmit = async (values: InvoicePreferencesFormType) => {
    try {
      await createInvoicePreference(values);
      toast?.success?.("Invoice preference submitted successfully");
      form.reset();
    } catch (err) {
      handleFormApiError<InvoicePreferencesFormType>(
        err,
        form.setError,
        "Failed to submit preferences",
      );
    }
  };

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Invoice Preferences</h2>

        <p className="text-sm text-muted-foreground">
          Configure default invoice settings
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <Card className="rounded-lg border shadow-none">
            <CardContent className="space-y-6 pt-6">
              <div className="flex justify-center items-center">
                {isLoading && <Spinner size="lg" />}
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <RHFSelectField
                  control={control}
                  name="defaultBillingCycle"
                  label="Default Billing Cycle"
                  options={[
                    {
                      value: "weekly",
                      label: "Weekly",
                    },
                    {
                      value: "fortnightly",
                      label: "Fortnightly",
                    },
                    {
                      value: "four-weekly",
                      label: "Four weekly",
                    },
                    {
                      value: "monthly",
                      label: "Monthly",
                    },
                  ]}
                />

                <div>
                  <TextField
                    label="Invoice Number Format"
                    placeholder="INV-YYYY-###"
                    {...register("invoiceNumberFormat")}
                    error={errors.invoiceNumberFormat?.message}
                  />

                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Use YYYY for year, ### for sequence
                  </p>
                </div>
              </div>

              <TextareaField
                label="Default Invoice Notes"
                placeholder="Add default notes that will appear on all invoices..."
                maxLength={500}
                autoResize
                {...register("defaultInvoiceNotes")}
                error={errors.defaultInvoiceNotes?.message}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoSendInvoices"
                  {...register("autoSendInvoices")}
                  className="h-4 w-4 rounded border-gray-300 accent-primary"
                />

                <label
                  htmlFor="autoSendInvoices"
                  className="text-sm font-medium"
                >
                  Automatically send invoices
                </label>
              </div>
            </CardContent>

            <CardFooter className="justify-end pt-2">
              <Button type="submit" disabled={isCreating}>
                {isCreating ? <Spinner /> : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </FormProvider>
  );
};

export default SettingsTab;
