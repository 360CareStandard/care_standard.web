import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicationForm } from "../../../../schemas/medication";
import { MedicationScheduleSection } from "./medication-schedule";
import { MedicationDatesSection } from "./medical-dates";

export function MedicationDetailsSection() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<MedicationForm>();

  return (
    <div className="space-y-4">
      {/* Medication Name */}
      <div>
        <label className="form-label">Medication Name</label>
        <Input
          className="w-full"
          placeholder="e.g. Metformin"
          {...register("medicationName")}
        />
        {errors.medicationName && (
          <p className="form-error">{errors.medicationName.message}</p>
        )}
      </div>

      {/* Dosage + Route */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Dosage</label>
          <Input
            className="w-full"
            placeholder="e.g. 500mg"
            {...register("dosage")}
          />
          {errors.dosage && (
            <p className="form-error">{errors.dosage.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Route</label>
          <Select
            value={watch("route")}
            onValueChange={(value) =>
              setValue("route", value as any, { shouldValidate: true })
            }
          >
            <SelectTrigger className="bg-white w-full py-4">
              <SelectValue placeholder="Select route" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oral">Oral</SelectItem>
              <SelectItem value="topical">Topical</SelectItem>
              <SelectItem value="injection">Injection</SelectItem>
              <SelectItem value="inhaled">Inhalation</SelectItem>
              <SelectItem value="rectal">Rectal</SelectItem>
              {/* <SelectItem value="ear">Ear</SelectItem>
              <SelectItem value="nasal">Nasal</SelectItem> */}
            </SelectContent>
          </Select>
          {errors.route && <p className="form-error">{errors.route.message}</p>}
        </div>
      </div>

      {/* Frequency + Dose Instruction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Frequency</label>
          <Select
            value={watch("frequency")}
            onValueChange={(value) =>
              setValue("frequency", value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="bg-white w-full py-4">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Once daily">Once daily</SelectItem>
              <SelectItem value="Twice daily">Twice daily</SelectItem>
              <SelectItem value="Three times daily">
                Three times daily
              </SelectItem>
              <SelectItem value="Four times daily">Four times daily</SelectItem>
              <SelectItem value="As required">As required (PRN)</SelectItem>
            </SelectContent>
          </Select>
          {errors.frequency && (
            <p className="form-error">{errors.frequency.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Dose</label>
          <Input
            placeholder="e.g. one or two tablets"
            {...register("doseInstruction")}
          />
        </div>
      </div>
      <MedicationScheduleSection />
      <MedicationDatesSection />
    </div>
  );
}
