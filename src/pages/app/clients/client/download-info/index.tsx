import { Download } from "lucide-react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCreateClientExport } from "@/hooks/client/useClientExport";
import { ClientExportForm, ClientExportSchema } from "../../schemas/export";
import { Spinner } from "@/components/shared/spinner";
import toast from "react-hot-toast";
import { handleFormApiError } from "@/lib/handle-form-error";

const defaultValues: ClientExportForm = {
  format: "pdf",
  includeBasicProfile: true,
  includeVisitHistory: true,
  includeCarePlan: true,
  includeHealthAndMedications: false,
  includeNotesAndMedia: false,
  includeCareLog: false,
};

const DownloadInfo = () => {
  const { clientId } = useParams<{ clientId: string }>();

  const createClientExport = useCreateClientExport(clientId as string);

  const methods = useForm<ClientExportForm>({
    resolver: zodResolver(ClientExportSchema) as unknown as Resolver<
      ClientExportForm,
      any
    >,
    mode: "onChange",
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data: ClientExportForm) => {
    try {
      await createClientExport.mutateAsync(data);
      toast.success("Client details exported successfully");
    } catch (err) {
      handleFormApiError<ClientExportForm>(
        err,
        methods.setError,
        "Failed to export client details",
      );
    }
  };

  const includeOptions: Array<{
    key: keyof Omit<ClientExportForm, "format">;
    label: string;
    disabled?: boolean;
  }> = [
    { key: "includeBasicProfile", label: "Basic profile" },
    { key: "includeVisitHistory", label: "Visit history" },
    { key: "includeCarePlan", label: "Care plan" },
    {
      key: "includeHealthAndMedications",
      label: "Health & medications",
    },
    {
      key: "includeNotesAndMedia",
      label: "Notes & media",
    },
    {
      key: "includeCareLog",
      label: "Care Log",
    },
  ];

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[520px] mx-auto gap-0 rounded-xl border-0 p-0 shadow-xl bg-white"
      >
        <div className="px-6 pb-4 pt-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xl font-semibold text-[#101828]">
                Download Client Details
              </div>
              <p className="mt-1 text-sm text-[#667085]">
                Choose what to include in your export
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-medium text-[#344054]">
                Export format
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setValue("format", "pdf")}
                  className={cn(
                    "inline-flex h-10 items-center justify-center rounded-md border text-sm font-medium transition",
                    values.format === "pdf"
                      ? "border-[#027A48] bg-[#027A48] text-white"
                      : "border-[#D0D5DD] bg-white text-[#344054] hover:bg-muted",
                  )}
                >
                  PDF
                </button>

                <button
                  type="button"
                  onClick={() => setValue("format", "csv")}
                  className={cn(
                    "inline-flex h-10 items-center justify-center rounded-md border text-sm font-medium transition",
                    values.format === "csv"
                      ? "border-[#027A48] bg-[#027A48] text-white"
                      : "border-[#D0D5DD] bg-white text-[#344054] hover:bg-muted",
                  )}
                >
                  CSV
                </button>
              </div>
            </div>

            <Separator />

            <div>
              <p className="mb-3 text-sm font-medium text-[#344054]">
                Include in export
              </p>

              <div className="space-y-3">
                {includeOptions.map((item) => {
                  const checked = values[item.key] as boolean;

                  return (
                    <div key={item.key} className="flex items-center gap-2.5">
                      <Checkbox
                        id={item.key}
                        checked={checked}
                        disabled={item.disabled}
                        onCheckedChange={(value) =>
                          setValue(item.key, Boolean(value))
                        }
                        className="data-[state=checked]:border-[#027A48] data-[state=checked]:bg-[#027A48]"
                      />
                      <Label
                        htmlFor={item.key}
                        className={cn(
                          "cursor-pointer text-sm font-normal",
                          item.disabled ? "text-[#98A2B3]" : "text-[#344054]",
                        )}
                      >
                        {item.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-[#F2D58B] bg-[#FFF8E7] px-4 py-3">
              <p className="text-sm text-[#B54708]">
                <span className="font-semibold">Important:</span> Please store
                exported data securely and in compliance with data protection
                regulations.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-0 p-0">
            <Button
              type="submit"
              disabled={isSubmitting || createClientExport.isPending}
              className="h-10 bg-[#027A48] px-4 hover:bg-[#05603A]"
            >
              <Download className="mr-2 h-4 w-4" />
              {isSubmitting || createClientExport.isPending ? (
                <Spinner size="sm" />
              ) : (
                "Download"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DownloadInfo;
