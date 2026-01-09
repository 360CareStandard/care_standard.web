import { useFormContext, useWatch } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { MedicationForm } from "../../../../schemas/medication";

export function MedicationDatesSection() {
  const { register, setValue, control } = useFormContext<MedicationForm>();

  const noEndDate = useWatch({ control, name: "noEndDate" });

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">When dose should start</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F7F9FC] p-2 rounded-lg">
        <div>
          <label className="form-label">Start Date *</label>
          <input
            type="date"
            {...register("startDate")}
            className="bg-white   w-full rounded-md border  h-9 px-3 py-1 text-sm shadow-xs"
          />
        </div>

        <div>
          <label className="form-label">End Date</label>
          <input
            type="date"
            disabled={noEndDate}
            {...register("endDate")}
            className="bg-white   w-full rounded-md border  h-9 px-3 py-1 text-sm shadow-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={noEndDate}
          onCheckedChange={(checked) => {
            setValue("noEndDate", Boolean(checked));
            if (checked) setValue("endDate", null);
          }}
        />
        <span className="text-sm">No end date</span>
      </div>
    </div>
  );
}
