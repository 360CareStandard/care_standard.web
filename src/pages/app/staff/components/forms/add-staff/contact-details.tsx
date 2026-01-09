// contact-details.tsx

import { RHFPhone } from "@/components/shared/rhf-phone";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { TextField } from "@/components/shared/text-field";
import { StaffFormData } from "../../../schemas/add-staff";
import { FieldErrors, useFormContext } from "react-hook-form";

interface Props {
  attemptedNext: boolean;

  errors: FieldErrors<StaffFormData>;
}
const phoneArr = [
  { value: "mobile", label: "Mobile" },
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
];

const ContactDetails = ({ attemptedNext, errors }: Props) => {
  const { register, control } = useFormContext<StaffFormData>();
  return (
    <section className="space-y-5 mt-4">
      <div className="grid gap-4">
        <h4 className="font-normal">Primary phone details</h4>
        <RHFPhone
          control={control}
          name="primaryPhoneNumber"
          label="Primary phone number"
        />

        <RHFSelectField
          control={control}
          name="primaryPhoneNumberType"
          label="Phone number type"
          options={phoneArr}
          forceShowError={attemptedNext} // <-- new
        />
      </div>
      <div className="grid gap-4">
        <h4 className="font-normal">Additional phone details</h4>

        <RHFPhone
          control={control}
          name="secondaryPhoneNumber"
          label="Additional phone number"
        />
        <RHFSelectField
          control={control}
          name="secondaryPhoneNumberType"
          label="Phone number type"
          options={phoneArr}
          forceShowError={attemptedNext} // <-- new
        />
        <TextField
          label="Email address"
          error={errors.email?.message}
          {...register("email")}
          placeholder="Enter email address"
        />
      </div>
    </section>
  );
};

export default ContactDetails;
