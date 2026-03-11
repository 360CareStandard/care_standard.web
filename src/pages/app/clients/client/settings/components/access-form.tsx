import { useFormContext } from "react-hook-form";
import { TextField } from "@/components/shared/text-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { AccessSettingsForm } from "../../../schemas/access-settings";
import { Loader2, X } from "lucide-react";
import { FamilyAccessItem } from "@/types/client/family-access";
import { Edit } from "iconsax-react";

type AccessFormFieldProps = {
  familyAccessList?: FamilyAccessItem[];
  onDeleteFamilyAccess?: (id: string) => void;
  onEditFamilyAccess?: (item: FamilyAccessItem) => void;
  isDeletingId?: string;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

function FamilyAccessList({
  items,
  onDelete,
  onEdit,
  isDeletingId,
}: {
  items: FamilyAccessItem[];
  onDelete?: (id: string) => void;
  onEdit?: (item: FamilyAccessItem) => void;
  isDeletingId?: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium">People with access</h3>
      </div>

      <div className="h-44 overflow-y-auto rounded-xl shadow inset-1 py-3  px-2">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No family access added yet
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const isDeleting = isDeletingId === item.id;

              return (
                <div
                  key={item.id}
                  className="relative rounded-lg border p-3 transition hover:bg-muted/30"
                >
                  <button
                    type="button"
                    onClick={() => onEdit?.(item)}
                    className="flex w-full items-start gap-3 text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-primary">
                      {getInitials(item.fullName)}
                    </div>

                    <div className="min-w-0 flex-1 pr-10">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold">
                          {item.fullName}
                        </p>
                        <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>

                      <p className="truncate text-xs text-muted-foreground">
                        {item.email}
                      </p>

                      <p className="text-xs capitalize text-muted-foreground">
                        {item.relationshipToClient} •{" "}
                        {item.accessLevel.replace("_", " ")}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete?.(item.id)}
                    disabled={isDeleting}
                    className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    aria-label={`Delete ${item.fullName}`}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccessFormField({
  familyAccessList = [],
  onDeleteFamilyAccess,
  onEditFamilyAccess,
  isDeletingId,
}: AccessFormFieldProps) {
  const { register, control, formState } = useFormContext<AccessSettingsForm>();
  const { errors } = formState;

  return (
    <div className="space-y-4">
      <FamilyAccessList
        items={familyAccessList}
        onDelete={onDeleteFamilyAccess}
        onEdit={onEditFamilyAccess}
        isDeletingId={isDeletingId}
      />

      <div className="grid grid-cols-1 gap-2">
        <div>
          <h3 className="text-sm font-medium">Invite new person</h3>
        </div>
        <TextField
          label="Name"
          placeholder="Enter full name"
          required
          {...register("fullName")}
          error={errors.fullName?.message}
        />

        <TextField
          label="Phone"
          placeholder="Enter phone number"
          inputMode="tel"
          {...register("phone")}
          error={errors.phone?.message}
        />

        <TextField
          label="Email"
          required
          placeholder="Enter email address"
          inputMode="email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <RHFSelectField
          control={control}
          name="relationshipToClient"
          label="Relationship"
          placeholder="Select relationship to client..."
          options={[
            { value: "daughter", label: "Daughter" },
            { value: "son", label: "Son" },
            { value: "spouse", label: "Spouse" },
            { value: "partner", label: "Partner" },
            { value: "sibling", label: "Sibling" },
            { value: "friend", label: "Friend" },
            { value: "other", label: "Other" },
          ]}
        />

        <RHFSelectField
          control={control}
          name="accessLevel"
          label="Access Level"
          options={[{ value: "read_only", label: "Read-only" }]}
        />
      </div>
    </div>
  );
}
