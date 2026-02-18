import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SheetForm } from "@/components/shared/sheet-form";
import { EmptyStateCard } from "../components/empty-state";
import { SettingIcon } from "../icons/setting";
import { PreferenceAccordion } from "../components/accordion/preference-accordion";
import preferencesSchema, { PreferencesForm } from "../../schemas/preferences";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Spinner } from "@/components/shared/spinner";
import {
  useCreatePreferences,
  usePreferences,
  useUpdatePreferences,
} from "@/hooks/client/usePreferences";
import { formatUpdatedAt } from "@/helpers/last-updated";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientPreferencesDetails } from "./components/details/preference";
import { Edit } from "iconsax-react";

export const initialPreferencesValues: Partial<PreferencesForm> = {
  morningRoutine: "",
  sleepingHabits: "",
  dailyActivities: "",
  preferredVisitTimes: [],
  religionOrFaith: "",
  faithPractices: "",
  culturalConsiderations: "",
  dietaryRestrictions: [],
  foodLikes: "",
  foodDislikes: "",
  favouriteMeals: "",
  preferredLanguage: "",
  interpreterNeeded: false,
  communicationAids: "",
  interactionNotes: "",
  metadata: {},
  status: "active",
};
type Props = {
  clientId: string;
};
const Preferences = ({ clientId }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  //
  const createPreferences = useCreatePreferences(clientId);
  const updatePreferences = useUpdatePreferences(clientId);

  const { data: clientPreference, isLoading } = usePreferences(
    clientId,
    Boolean(clientId)
  );

  // console.log(clientPreference);

  const methods = useForm({
    resolver: zodResolver(preferencesSchema),
    mode: "onChange",
    defaultValues: preferencesSchema.parse({}),
  });

  // map API -> form values (defensive)
  function mapApiToPreferencesForm(api?: any): Partial<PreferencesForm> {
    if (!api) return initialPreferencesValues;
    return {
      morningRoutine: api.morningRoutine ?? "",
      sleepingHabits: api.sleepingHabits ?? "",
      dailyActivities: api.dailyActivities ?? "",
      preferredVisitTimes: Array.isArray(api.preferredVisitTimes)
        ? api.preferredVisitTimes.filter((p: string) =>
            ["Morning", "Afternoon", "Evening"].includes(p)
          )
        : [],
      religionOrFaith: api.religionOrFaith ?? "",
      faithPractices: api.faithPractices ?? "",
      culturalConsiderations: api.culturalConsiderations ?? "",
      dietaryRestrictions: Array.isArray(api.dietaryRestrictions)
        ? api.dietaryRestrictions
        : [],
      foodLikes: api.foodLikes ?? "",
      foodDislikes: api.foodDislikes ?? "",
      favouriteMeals: api.favouriteMeals ?? "",
      preferredLanguage: api.preferredLanguage ?? "",
      interpreterNeeded: Boolean(api.interpreterNeeded),
      communicationAids: api.communicationAids ?? "",
      interactionNotes: api.interactionNotes ?? "",
      metadata: api.metadata ?? {},
      status: api.status ?? "active",
    };
  }

  const openForAdd = () => {
    methods.reset(initialPreferencesValues as any);
    setEditingId(null);
    setOpen(true);
  };

  const openForEdit = (apiRecord: any) => {
    const mapped = mapApiToPreferencesForm(apiRecord);
    methods.reset(mapped as any);
    setEditingId(apiRecord?.id ?? null);
    setOpen(true);
  };

  async function onSubmit(values: PreferencesForm) {
    try {
      if (editingId) {
        // call update; adjust payload shape to your hook/api needs
        await updatePreferences.mutateAsync({ body: values });
        toast.success("Preferences updated");
      } else {
        await createPreferences.mutateAsync(values);
        toast.success("Preferences saved");
      }

      setOpen(false);
      setEditingId(null);
      methods.reset(initialPreferencesValues as any);
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
            clientPreference ? "gap-8" : "sm:grid-cols-2 gap-16"
          } `}
        >
          {!isLoading && clientPreference ? (
            <div className="flex justify-between items-center gap-4">
              <div className=" space-y-1">
                <h2 className="font-bold text-xl">Preferences</h2>
                <p className="text-xs text-muted-foreground">
                  {formatUpdatedAt(clientPreference.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  {clientPreference?.status.charAt(0).toUpperCase() +
                    clientPreference.status.slice(1)}
                </span>
                <Button
                  onClick={() => openForEdit(clientPreference)}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit size={20} />
                  Update Preferences
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-xl"> Preferences</h2>
              <p className="text-sm text-muted-foreground">
                Capture routines, cultural needs, and personal likes to support
                person-centred care.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={openForAdd}
                  variant="outline"
                  className="gap-2"
                  disabled={isLoading}
                >
                  <PlusIcon />
                  Add Preferences
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
          ) : clientPreference ? (
            <ClientPreferencesDetails data={clientPreference} />
          ) : (
            <EmptyStateCard
              icon={<SettingIcon />}
              title="No preferences have been added for this client"
              description="Record access, equipment and environment details for this client’s home."
              btnText="Add Preferences"
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
            methods.reset(initialPreferencesValues as any);
          }
        }}
        title={
          editingId ? "Edit Personal Preferences" : "Add Personal Preferences"
        }
        description="Capture routines, cultural needs, and personal likes information."
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
          <PreferenceAccordion />
        </FormProvider>
      </SheetForm>
    </>
  );
};

export default Preferences;
