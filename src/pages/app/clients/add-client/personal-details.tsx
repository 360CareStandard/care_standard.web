// features/clients/components/personal-details.tsx
import { ClientFormData } from "../schemas/add-client";
import { useFormContext } from "react-hook-form";
import { TextField } from "@/components/shared/text-field";
import { ProfileImageField } from "../components/profile-image-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { RHFDatePicker } from "@/components/shared/rhf-date-picker";

interface Props {
  attemptedNext: boolean;
}

const PersonalDetails = ({ attemptedNext }: Props) => {
  const { register, control, formState, watch, setValue } =
    useFormContext<ClientFormData>();
  const { errors } = formState;
  const first = watch("firstname");
  const last = watch("lastname");
  const initials = `${first?.[0] ?? "J"}${last?.[0] ?? "W"}`;
  return (
    <div className="grid gap-4">
      <ProfileImageField setValue={setValue} initials={initials} />

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
        label="First name"
        error={errors.firstname?.message}
        {...register("firstname")}
        placeholder="Enter legal first name"
      />
      <TextField
        label="Middle name"
        error={errors.middlename?.message}
        {...register("middlename")}
        placeholder="Enter legal middle name"
      />
      <TextField
        label="Last name"
        error={errors.lastname?.message}
        {...register("lastname")}
        placeholder="Enter legal last name"
      />
      <TextField
        label="Preffered name"
        error={errors.preferredname?.message}
        {...register("preferredname")}
        placeholder="Enter preffered name"
      />
      <TextField
        label="Pronouns"
        error={errors.pronouns?.message}
        {...register("pronouns")}
        placeholder="Add Pronouns"
      />
      <RHFSelectField
        control={control}
        name="gender"
        label="Gender Identity"
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ]}
        forceShowError={attemptedNext} // <-- new
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
        <RHFDatePicker
          control={control}
          name="dob"
          label="Date of Birth"
          minDate={new Date(1900, 0, 1)}
          maxDate={new Date()} // block future DOBs
        />
        <RHFSelectField
          control={control}
          name="status"
          label="Status"
          options={[
            { value: "active", label: "Active" },
            { value: "paused", label: "Paused" },
            { value: "inactive", label: "Inactive" },
          ]}
          forceShowError={attemptedNext} // <-- new
        />
      </div>
      {/* <Input type="date" /> */}
    </div>
  );
};

export default PersonalDetails;
