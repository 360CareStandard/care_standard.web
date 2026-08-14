// pages/home/HomeEnvironment.tsx
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
import { HomeHastagIcon } from "../icons/home-hashtag";
import { HomeSetupAccordion } from "../components/accordion/home-accordion";

import homeEnvironmentSchema, {
  type HomeEnvironmentForm,
} from "../../schemas/home-environment";
import {
  useCreateHomeEnvironment,
  useHomeEnvironment,
  useUpdateHomeEnvironment,
} from "@/hooks/client/useHomeEnvironment";
import { Spinner } from "@/components/shared/spinner";
import { formatUpdatedAt } from "@/helpers/last-updated";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeEnvironmentDetails } from "./components/details/home-environment";
import { Edit } from "iconsax-react";
import { ClientHomeEnvironment } from "@/types/client/home-environment";
import { handleFormApiError } from "@/lib/handle-form-error";

const initialFormValues: Partial<HomeEnvironmentForm> = {
  livingSituation: {
    livesAlone: false,
    householdMembers: [],
    propertyType: "Flat",
    supportType: "Own House", // use API value
  },
  accessAndSecurity: {
    accessMethod: "",
    keySafeCode: "",
    buzzerCode: "",
    specialAccessNotes: "",
  },
  environmentAndEquipment: {
    equipmentPresent: [],
    pets: "",
    knownHazards: [],
    // petsPresent: false,
    // new fields added to match schema
    // assistiveTechnology: [],
    // hazardNotes: "",
  },
  metadata: {},
  status: "active",
};

type Props = { clientId: string };

export default function HomeEnvironment({ clientId }: Props) {
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  // hooks — make sure your hooks accept the payload shapes used below
  const createHomeEnvironment = useCreateHomeEnvironment(clientId);
  const updateHomeEnvironment = useUpdateHomeEnvironment(clientId);

  const { data: clientHomeEnvironment, isLoading } = useHomeEnvironment(
    clientId,
    Boolean(clientId),
  );

  const methods = useForm<HomeEnvironmentForm>({
    resolver: zodResolver(homeEnvironmentSchema) as unknown as Resolver<
      HomeEnvironmentForm,
      any
    >,
    mode: "onChange",
    defaultValues: initialFormValues as HomeEnvironmentForm,
  });

  // React.useEffect(() => {
  //   const sub = methods.watch((v) => {
  //     console.log("HOME FORM (live):", v);
  //   });
  //   return () => sub.unsubscribe();
  // }, [methods]);

  function mapApiToFormValues(
    api?: ClientHomeEnvironment,
  ): Partial<HomeEnvironmentForm> {
    if (!api) return initialFormValues;
    return {
      livingSituation: {
        livesAlone: Boolean(api.livingSituation?.livesAlone),
        householdMembers: Array.isArray(api.livingSituation?.householdMembers)
          ? api.livingSituation.householdMembers.map((m: any) => ({
              name: m.name ?? "",
              relationship: m.relationship ?? "",
            }))
          : [],
        propertyType: api.livingSituation?.propertyType ?? "Flat",
        supportType: api.livingSituation?.supportType ?? "Own House",
      },
      accessAndSecurity: {
        accessMethod: api.accessAndSecurity?.accessMethod ?? "",
        keySafeCode: api.accessAndSecurity?.keySafeCode ?? "",
        buzzerCode: api.accessAndSecurity?.buzzerCode ?? "",
        specialAccessNotes: api.accessAndSecurity?.specialAccessNotes ?? "",
      },
      environmentAndEquipment: {
        equipmentPresent: Array.isArray(
          api.environmentAndEquipment?.equipmentPresent,
        )
          ? api.environmentAndEquipment.equipmentPresent
          : [],
        // petsPresent: Boolean(api.environmentAndEquipment?.pets), // new
        pets: api.environmentAndEquipment?.pets ?? "",
        knownHazards: Array.isArray(api.environmentAndEquipment?.knownHazards)
          ? api.environmentAndEquipment.knownHazards
          : [],
        // assistiveTechnology: Array.isArray(
        //   api.environmentAndEquipment?.assistiveTechnology
        // )
        //   ? api.environmentAndEquipment.assistiveTechnology
        //   : [],
        // hazardNotes: api.environmentAndEquipment?.hazardNotes ?? "",
      },
      metadata: api.metadata ?? {},
      status: api.status ?? "active",
    };
  }

  const openForAdd = () => {
    methods.reset(initialFormValues as any);
    setEditingId(null);
    setOpen(true);
  };

  const openForEdit = (apiRecord: any) => {
    const mapped = mapApiToFormValues(apiRecord);
    methods.reset(mapped as any);
    setEditingId(apiRecord?.id ?? null);
    setOpen(true);
  };

  // onSubmit should call your create/update hooks — replace with your hooks as needed
  const onSubmit = async (values: HomeEnvironmentForm) => {
    const payload = values;
    try {
      if (editingId) {
        await updateHomeEnvironment.mutateAsync({ body: payload });
        toast.success("Home environment updated");
      } else {
        await createHomeEnvironment.mutateAsync(payload);
        toast.success("Home environment created");
      }
      setOpen(false);
      setEditingId(null);
      methods.reset(initialFormValues as any);
    } catch (err) {
      handleFormApiError<HomeEnvironmentForm>(
        err,
        methods.setError,
        editingId
          ? "Failed to update home environment"
          : "Failed to create home environment",
      );
    }
  };

  const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void methods.handleSubmit(onSubmit)();
  };

  // const handleSheetSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
  //   e.preventDefault();

  //   methods.handleSubmit(
  //     (values) => {
  //       console.log("VALID:", values);
  //       onSubmit(values);
  //     },
  //     (errors) => {
  //       console.log("INVALID:", errors);
  //     },
  //   )(e);
  // };

  return (
    <>
      <Card>
        <CardContent
          className={`grid grid-cols-1 ${
            clientHomeEnvironment ? "gap-8" : "sm:grid-cols-2 gap-16"
          } `}
        >
          {!isLoading && clientHomeEnvironment ? (
            <div className="flex justify-between items-center gap-4">
              <div className=" space-y-1">
                <h2 className="font-bold text-xl">Home & Environment</h2>
                <p className="text-xs text-muted-foreground">
                  {formatUpdatedAt(clientHomeEnvironment.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                            {clientHomeEnvironment?.status.charAt(0).toUpperCase() +
                              clientHomeEnvironment.status.slice(1)}
                          </span> */}
                <Button
                  onClick={() => openForEdit(clientHomeEnvironment)}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit size={20} />
                  Update Home Info
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-xl"> Home & Environment</h2>
              <p className="text-sm text-muted-foreground">
                Record access, equipment and environment details for this
                client.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={openForAdd}
                  variant="outline"
                  className="gap-2"
                  disabled={isLoading}
                >
                  <PlusIcon />
                  Add Home Info
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ) : clientHomeEnvironment ? (
            <HomeEnvironmentDetails data={clientHomeEnvironment} />
          ) : (
            <EmptyStateCard
              icon={<HomeHastagIcon />}
              title="No home info have been added yet"
              description="Record access, equipment and environment details for this client."
              btnText="Add Home Info"
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
        title={editingId ? "Edit Home & Environment" : "Add Home & Environment"}
        description="Record access, equipment and environment details for this client"
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
          <HomeSetupAccordion />
        </FormProvider>
      </SheetForm>
    </>
  );
}
