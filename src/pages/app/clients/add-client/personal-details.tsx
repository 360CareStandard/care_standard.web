// features/clients/components/personal-details.tsx
import { ClientFormData } from "../schemas/add-client";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { TextField } from "@/components/shared/text-field";
import { ProfileImageField } from "../components/profile-image-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { RHFDatePicker } from "@/components/shared/rhf-date-picker";

interface Props {
  watch: UseFormWatch<ClientFormData>;
  setValue: UseFormSetValue<ClientFormData>;
  register: UseFormRegister<ClientFormData>;
  FieldError: ({ message }: { message?: string }) => JSX.Element | null;
  errors: FieldErrors<ClientFormData>;
  control: Control<ClientFormData>;
  attemptedNext: boolean;
}

const PersonalDetails = ({
  watch,
  setValue,
  register,
  errors,
  control,
  attemptedNext,
}: Props) => {
  const first = watch("firstName");
  const last = watch("lastName");
  const initials = `${first?.[0] ?? "J"}${last?.[0] ?? "W"}`;
  return (
    <div className="grid gap-4">
      <ProfileImageField
        watch={watch}
        setValue={setValue}
        initials={initials}
      />

      <RHFSelectField
        control={control}
        name="title"
        label="Title"
        options={[
          { value: "Mrs", label: "Mrs" },
          { value: "Mr", label: "Mr" },
          { value: "Ms", label: "Ms" },
          { value: "Mx", label: "Mx" },
          { value: "Dr", label: "Dr" },
        ]}
        forceShowError={attemptedNext} // <-- new
      />
      <TextField
        label="First Name"
        error={errors.firstName?.message}
        {...register("firstName")}
        placeholder="Enter legal first name"
      />
      <TextField
        label="Middle Name"
        error={errors.middleName?.message}
        {...register("middleName")}
        placeholder="Enter legal middle name"
      />
      <TextField
        label="Last Name"
        error={errors.lastName?.message}
        {...register("lastName")}
        placeholder="Enter legal last name"
      />
      <TextField
        label="Preffered Name"
        error={errors.preferredName?.message}
        {...register("preferredName")}
        placeholder="Enter legal last name"
      />
      <TextField
        label="Pronouns"
        error={errors.pronouns?.message}
        {...register("pronouns")}
        placeholder="Add Pronouns"
      />
      <RHFDatePicker
        control={control}
        name="dateOfBirth"
        label="Date of Birth"
        minDate={new Date(1900, 0, 1)}
        maxDate={new Date()} // block future DOBs
      />
      {/* <Input type="date" /> */}

      <RHFSelectField
        control={control}
        name="status"
        label="Status"
        options={[
          { value: "Active", label: "Active" },
          { value: "Paused", label: "Paused" },
          { value: "Inactive", label: "Inactive" },
        ]}
        forceShowError={attemptedNext} // <-- new
      />
    </div>
  );
};

export default PersonalDetails;
