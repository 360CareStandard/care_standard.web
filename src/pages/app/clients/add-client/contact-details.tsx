// contact-details.tsx
import type {
  Control,
  UseFormSetValue,
  UseFormWatch,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import type { ClientFormData } from "../schemas/add-client";
import { RHFPhone } from "@/components/shared/rhf-phone";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { TextField } from "@/components/shared/text-field";

interface Props {
  watch: UseFormWatch<ClientFormData>;
  setValue: UseFormSetValue<ClientFormData>;
  control: Control<ClientFormData>;
  FieldError: ({ message }: { message?: string }) => JSX.Element | null;
  attemptedNext: boolean;
  register: UseFormRegister<ClientFormData>;
  errors: FieldErrors<ClientFormData>;
}

const ContactDetails = ({
  control,
  attemptedNext,
  errors,
  register,
}: Props) => {
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
          name="primaryPhoneType"
          label="Phone number type"
          options={[
            { value: "Mobile", label: "Mobile" },
            { value: "Home", label: "Home" },
            { value: "Work", label: "Work" },
            { value: "Temp", label: "Temp" },
            { value: "Old", label: "Old" },
          ]}
          forceShowError={attemptedNext} // <-- new
        />
      </div>
      <div className="grid gap-4">
        <h4 className="font-normal">Additional phone details</h4>

        <RHFPhone
          control={control}
          name="additionalPhoneNumber"
          label="Additional phone number"
        />
        <RHFSelectField
          control={control}
          name="additionalPhoneType"
          label="Phone number type"
          options={[
            { value: "Mobile", label: "Mobile" },
            { value: "Home", label: "Home" },
            { value: "Work", label: "Work" },
            { value: "Temp", label: "Temp" },
            { value: "Old", label: "Old" },
          ]}
          forceShowError={attemptedNext} // <-- new
        />
        <TextField
          label="Email address"
          error={errors.emailAddress?.message}
          {...register("emailAddress")}
          placeholder="Enter email address"
        />
      </div>
    </section>
  );
};

export default ContactDetails;
