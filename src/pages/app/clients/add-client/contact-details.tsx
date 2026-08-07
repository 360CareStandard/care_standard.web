// contact-details.tsx
import { useFormContext } from "react-hook-form";
import type { ClientFormData } from "../schemas/add-client";
import { RHFPhone } from "@/components/shared/rhf-phone";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { TextField } from "@/components/shared/text-field";

interface Props {
  attemptedNext: boolean;
}
const phoneArr = [
  { value: "mobile", label: "Mobile" },
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
];

const ContactDetails = ({ attemptedNext }: Props) => {
  const { register, control, formState } = useFormContext<ClientFormData>();
  const { errors } = formState;
  return (
    <section className="space-y-5 mt-4">
      <div className="grid gap-4">
        <h4 className="font-normal">Primary phone details</h4>
        <RHFPhone control={control} name="phone" label="Primary phone number" />

        <RHFSelectField
          control={control}
          name="phoneType"
          label="Phone number type"
          options={phoneArr}
          forceShowError={attemptedNext} // <-- new
        />
      </div>
      <div className="grid gap-4">
        <h4 className="font-normal">Secondary phone details</h4>

        <RHFPhone
          control={control}
          name="secondaryPhone"
          label="Secondary phone number"
        />
        <RHFSelectField
          control={control}
          name="secondaryPhoneType"
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
