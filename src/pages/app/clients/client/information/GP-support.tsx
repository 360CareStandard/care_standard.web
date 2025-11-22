// pages/gp/GPsupport.tsx
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
import { StethIcon } from "../icons/steth";
import { GPsupportAccordion } from "../components/Gpsupport-accordion";

import gpSupportSchema, { type GpSupportForm } from "../../schemas/gp-support";
import {
  useClientGpSupport,
  useCreateGpSupport,
  useUpdateGpSupport,
} from "@/hooks/client/useClientGpSupport"; // adjust path/names to your actual hooks
import { Spinner } from "@/components/shared/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUpdatedAt } from "@/helpers/last-updated";
import { GPSupportDetails } from "../../components/gp-support";
import { ClientGPAndSupport } from "@/types/client/gp-support";

const initialFormValues: Partial<GpSupportForm> = {
  gpDetails: {
    gpName: "",
    practiceName: "",
    phone: "",
    email: "",
    practiceAddress: "",
  },
  otherHealthcareProfessionals: [],
  // metadata: {},
};

type Props = {
  clientId: string;
};

const GPsupport = ({ clientId }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // hooks — make sure your hooks accept the payload shapes used below
  const createGpSupport = useCreateGpSupport(clientId);
  const updateGpSupport = useUpdateGpSupport(clientId);

  const { data: clientGpSupport, isLoading } = useClientGpSupport(
    clientId,
    Boolean(clientId)
  );

  const methods = useForm<GpSupportForm>({
    resolver: zodResolver(gpSupportSchema) as unknown as Resolver<
      GpSupportForm,
      any
    >,
    mode: "onChange",
    defaultValues: initialFormValues as GpSupportForm,
  });

  // React.useEffect(() => {
  //   const sub = methods.watch((v) => {
  //     // remove or reduce logging in production
  //     console.log("GP support form (live):", v);
  //   });
  //   return () => sub.unsubscribe();
  // }, [methods]);

  function mapApiToFormValues(api?: any): Partial<GpSupportForm> {
    if (!api) return initialFormValues;
    return {
      gpDetails: {
        gpName: api.gpDetails?.gpName ?? "",
        practiceName: api.gpDetails?.practiceName ?? "",
        phone: api.gpDetails?.phone ?? "",
        email: api.gpDetails?.email ?? "",
        practiceAddress: api.gpDetails?.practiceAddress ?? "",
      },
      otherHealthcareProfessionals: Array.isArray(
        api.otherHealthcareProfessionals
      )
        ? api.otherHealthcareProfessionals.map((p: any) => ({
            role: p.role ?? "",
            phone: p.phone ?? "",
            email: p.email ?? "",
            organisation: p.organisation ?? "",
            notes: p.notes ?? "",
          }))
        : [],
      // metadata: api.metadata ?? {},
      status: api.status ?? "active",
    } as Partial<GpSupportForm>;
  }

  const openForAdd = () => {
    methods.reset(initialFormValues as any);
    setEditingId(null);
    setOpen(true);
  };

  const openForEdit = (apiRecord: ClientGPAndSupport) => {
    const mapped = mapApiToFormValues(apiRecord);
    methods.reset(mapped as ClientGPAndSupport);
    setEditingId(apiRecord?.id ?? null);
    setOpen(true);
  };

  async function onSubmit(values: GpSupportForm) {
    try {
      if (editingId) {
        // call update; adjust payload shape to your hook/api needs
        await updateGpSupport.mutateAsync({ body: values });
        toast.success("GP & support updated");
      } else {
        await createGpSupport.mutateAsync(values);
        toast.success("GP & support saved");
      }

      setOpen(false);
      setEditingId(null);
      methods.reset(initialFormValues as any);
    } catch (err: any) {
      console.error("Save failed", err);
      toast.error(err?.message ?? "Save failed, try again");
    }
  }

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <>
      <Card>
        <CardContent
          className={`grid grid-cols-1 ${
            clientGpSupport ? "gap-8" : "sm:grid-cols-2 gap-16"
          } `}
        >
          {!isLoading && clientGpSupport ? (
            <div className="flex justify-between items-center gap-4">
              <div className=" space-y-1">
                <h2 className="font-bold text-xl">GP & Support</h2>
                <p className="text-xs text-muted-foreground">
                  {formatUpdatedAt(clientGpSupport.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  {/* {clientGpSupport?.status.charAt(0).toUpperCase() +
                              clientGpSupport.status.slice(1)} */}
                </span>
                <Button
                  onClick={() => openForEdit(clientGpSupport)}
                  variant="outline"
                  className="gap-2"
                >
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.16699 1.66602H7.50033C3.33366 1.66602 1.66699 3.33268 1.66699 7.49935V12.4993C1.66699 16.666 3.33366 18.3327 7.50033 18.3327H12.5003C16.667 18.3327 18.3337 16.666 18.3337 12.4993V10.8327"
                      stroke="#61779C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.3666 2.51639L6.7999 9.08306C6.5499 9.33306 6.2999 9.82472 6.2499 10.1831L5.89157 12.6914C5.75823 13.5997 6.3999 14.2331 7.30823 14.1081L9.81657 13.7497C10.1666 13.6997 10.6582 13.4497 10.9166 13.1997L17.4832 6.63306C18.6166 5.49972 19.1499 4.18306 17.4832 2.51639C15.8166 0.849722 14.4999 1.38306 13.3666 2.51639Z"
                      stroke="#61779C"
                      strokeWidth="1.5"
                      strokeMiterlimit={10}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.4248 3.45898C12.9831 5.45065 14.5415 7.00898 16.5415 7.57565"
                      stroke="#61779C"
                      strokeWidth="1.5"
                      strokeMiterlimit={10}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Update GP Support
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-xl"> GP & Support</h2>
              <p className="text-sm text-muted-foreground">
                Record client’s main healthcare professionals and external
                support contacts
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={openForAdd}
                  variant="outline"
                  className="gap-2"
                  disabled={isLoading}
                >
                  <PlusIcon />
                  Add GP & Support
                </Button>
              </div>
            </div>
          )}

          {/* Replace the empty state with existing record view when you wire get-details */}
          {isLoading ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ) : clientGpSupport ? (
            <GPSupportDetails data={clientGpSupport} />
          ) : (
            <EmptyStateCard
              icon={<StethIcon />}
              title="No GP or healthcare contacts have been added yet"
              description="Record GP, clinicians, and other healthcare professionals supporting this client"
              btnText="Add GP & Support"
              button
              onClick={openForAdd}
            />
          )}
        </CardContent>
      </Card>

      <SheetForm
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setEditingId(null);
            methods.reset(initialFormValues as any);
          }
        }}
        title={editingId ? "Edit GP & Support" : "Add GP & Support"}
        description="Record GP and healthcare professional information for this client."
        headerClassName="bg-[#E4E7EC] py-2.5"
        submitLabel={
          methods.formState.isSubmitting ? (
            <Spinner size="sm" />
          ) : editingId ? (
            "Save Changes"
          ) : (
            "Save  Info"
          )
        }
        submitDisabled={methods.formState.isSubmitting}
        onSubmit={handleSheetSubmit}
      >
        <FormProvider {...methods}>
          <GPsupportAccordion />
        </FormProvider>
      </SheetForm>
    </>
  );
};

export default GPsupport;
