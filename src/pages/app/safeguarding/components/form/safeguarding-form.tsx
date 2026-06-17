import { Label } from "@/components/ui/label";
import { SafeguardStaffSelector } from "../staff-selector";
import { SafeguardClientSelector } from "../client-selector";
import { TextField } from "@/components/shared/text-field";
import { SafeguardingFormData } from "@/pages/schemas/safeguarding";
import { useFormContext } from "react-hook-form";
import { TextareaField } from "@/components/shared/textarea-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { EvidenceUploadField } from "../evidence-upload";

const incidentTypeOptions = [
  { value: "safeguarding-concern", label: "Safeguarding Concern" },
  { value: "incident", label: "Incident" },
  { value: "accident", label: "Accident" },
  { value: "near-miss", label: "Near Miss" },
  { value: "complaint", label: "Complaint" },
  { value: "compliment", label: "Compliment" },
  { value: "other", label: "Other" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const SafeguardingFormField = () => {
  const { register, control, formState, watch, setValue } =
    useFormContext<SafeguardingFormData>();
  const { errors } = formState;

  return (
    <div className="w-full my-2 space-y-4">
      <div className="">
        <Label>Concerned Client</Label>
        <span className="text-xs my-2 text-muted-foreground">
          Search client who the concern is for?
        </span>
        <SafeguardClientSelector />
      </div>
      <div className="">
        <Label>Reported By</Label>
        <span className="text-xs my-2 text-muted-foreground">
          Select staff who reported
        </span>
        <SafeguardStaffSelector />
      </div>
      <TextField
        required
        label="Title"
        placeholder="Brief title for the incident"
        {...register("title")}
        error={errors.title?.message}
      />
      <div className="grid grid-cols-2 gap-4">
        <RHFSelectField
          control={control}
          name="incidentType"
          label="Incident Type"
          placeholder="Select incident type..."
          options={incidentTypeOptions}
        />
        <RHFSelectField
          control={control}
          name="priority"
          label="Priority"
          placeholder="Select priority..."
          options={priorityOptions}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextField
          required
          label="Incident Date and Time"
          placeholder="Select date and time"
          type="datetime-local"
          {...register("incidentDateTime")}
          error={errors.incidentDateTime?.message}
        />
        <TextField
          required
          label="Location"
          placeholder="e.g., Bathroom, Living Room"
          {...register("location")}
          error={errors.location?.message}
        />
      </div>

      <TextareaField
        label="Describe the event"
        placeholder="Provide as much detail as you can. Be objective and avoid opinions."
        required
        {...register("description")}
        error={errors.description?.message}
      />
      <EvidenceUploadField setValue={setValue} watch={watch} />
    </div>
  );
};

export default SafeguardingFormField;
