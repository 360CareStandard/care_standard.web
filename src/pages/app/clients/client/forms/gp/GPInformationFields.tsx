// components/gp/GPInformationFields.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GpSupportForm } from "../../../schemas/gp-support";
import { useFormContext } from "react-hook-form";

export function GPInformationFields() {
  const { register, formState } = useFormContext<GpSupportForm>();

  return (
    <div className="space-y-4">
      {/* row: gp + practice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>GP Name</Label>
          <Input
            placeholder="e.g., Dr. Smith"
            {...register("gpDetails.gpName")}
          />
          {formState.errors?.gpDetails?.gpName && (
            <p className="text-xs text-red-600 mt-1">
              {(formState.errors.gpDetails as any).gpName?.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Practice Name</Label>
          <Input
            placeholder="Medical Practice Name"
            {...register("gpDetails.practiceName")}
          />
        </div>
      </div>

      {/* row: phone + email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Phone Number</Label>
          <Input
            inputMode="tel"
            placeholder="+234 801 234 5678"
            {...register("gpDetails.phone")}
          />
          {formState.errors?.gpDetails?.phone && (
            <p className="text-xs text-red-600 mt-1">
              {(formState.errors.gpDetails as any).phone?.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Email <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            type="email"
            inputMode="email"
            placeholder="gp@practice.nhs.uk"
            {...register("gpDetails.email")}
          />
          {formState.errors?.gpDetails?.email && (
            <p className="text-xs text-red-600 mt-1">
              {(formState.errors.gpDetails as any).email?.message}
            </p>
          )}
        </div>
      </div>

      {/* address */}
      <div className="space-y-1.5">
        <Label>Practice Address</Label>
        <Textarea
          placeholder="Practice address..."
          {...register("gpDetails.practiceAddress")}
          className="min-h-[88px] resize-y "
        />
      </div>
    </div>
  );
}
