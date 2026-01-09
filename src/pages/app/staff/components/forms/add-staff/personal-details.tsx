import { useFormContext } from "react-hook-form";
import { TextField } from "@/components/shared/text-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { RHFDatePicker } from "@/components/shared/rhf-date-picker";
import { ProfileImageField } from "./profile-image-field";
import { StaffFormData } from "../../../schemas/add-staff";

interface Props {
  attemptedNext: boolean;
}

const PersonalDetails = ({ attemptedNext }: Props) => {
  const { register, control, formState, watch, setValue } =
    useFormContext<StaffFormData>();
  const { errors } = formState;
  const first = watch("firstname");
  const last = watch("lastname");
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
        name="tittle"
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
      {/* <TextField
        label="Middle name"
        error={errors.middlename?.message}
        {...register("middlename")}
        placeholder="Enter legal middle name"
      /> */}
      <TextField
        label="Last name"
        error={errors.lastname?.message}
        {...register("lastname")}
        placeholder="Enter legal last name"
      />
      <TextField
        label="Preffered name"
        error={errors.preferredName?.message}
        {...register("preferredName")}
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
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
          { value: "Other", label: "Other" },
        ]}
        forceShowError={attemptedNext} // <-- new
      />

      <RHFDatePicker
        control={control}
        name="dob"
        label="Date of Birth"
        minDate={new Date(1900, 0, 1)}
        maxDate={new Date()} // block future DOBs
      />
    </div>
  );
};

export default PersonalDetails;
