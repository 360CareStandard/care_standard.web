import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { TextField } from "@/components/shared/text-field";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { CreateAgencyFormData } from "@/pages/schemas/add-agency";
import { Controller, useFormContext } from "react-hook-form";

const countryOptions = [
  { value: "UK", label: "United Kingdom" },
  //   { value: "Nigeria", label: "Nigeria" },
  { value: "USA", label: "United States" },
  { value: "Canada", label: "Canada" },
];

interface AgencyFormProps {
  isSubmitting?: boolean;
}

const AgencyForm = ({ isSubmitting = false }: AgencyFormProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateAgencyFormData>();

  return (
    <div className="space-y-6">
      {/* Agency Information */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Agency Information</h3>

          <p className="text-sm text-muted-foreground">
            Provide the basic information about the agency.
          </p>
        </div>

        <TextField
          label="Legal Name *"
          type="text"
          placeholder="Enter legal name"
          {...register("agency.legalName")}
          error={errors.agency?.legalName?.message}
          disabled={isSubmitting}
        />

        <TextField
          label="Trading Name *"
          type="text"
          placeholder="Enter trading name"
          {...register("agency.tradingName")}
          error={errors.agency?.tradingName?.message}
          disabled={isSubmitting}
        />

        <RHFSelectField
          control={control}
          name="agency.country"
          label="Country *"
          placeholder="Select country"
          options={countryOptions}
          disabled={isSubmitting}
        />
      </div>

      {/* Owner Information */}
      <div className="space-y-4 border-t pt-5">
        <div>
          <h3 className="text-sm font-semibold">Agency Owner</h3>

          <p className="text-sm text-muted-foreground">
            Enter the details of the person who will own and manage this agency.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="First Name *"
            type="text"
            placeholder="Enter first name"
            {...register("owner.firstname")}
            error={errors.owner?.firstname?.message}
            disabled={isSubmitting}
          />

          <TextField
            label="Last Name *"
            type="text"
            placeholder="Enter last name"
            {...register("owner.lastname")}
            error={errors.owner?.lastname?.message}
            disabled={isSubmitting}
          />
        </div>

        <TextField
          label="Email Address *"
          type="email"
          placeholder="owner@example.com"
          {...register("owner.email")}
          error={errors.owner?.email?.message}
          disabled={isSubmitting}
        />

        <TextField
          label="Phone Number *"
          type="tel"
          placeholder="+44 7911 123456"
          {...register("owner.phone")}
          error={errors.owner?.phone?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Email Notification */}
      <div className="border-t pt-5">
        <Controller
          control={control}
          name="sendEmails"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>

              <div className="space-y-1 leading-none">
                <FormLabel>Send welcome email</FormLabel>

                <FormDescription>
                  Send the agency owner an email with their account information
                  after the agency is created.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AgencyForm;
