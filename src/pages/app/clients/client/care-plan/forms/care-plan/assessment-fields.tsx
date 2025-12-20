// components/assessments/AssessmentFormFields.tsx
import { useFormContext, useFieldArray, Controller } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

import {
  AssessmentForm,
  ASSESSMENT_TYPES,
  RISK_SEVERITIES,
} from "../../../../schemas/care-assesment";
import { ResponsiblePersonSelect } from "./responsiblePersonSelect";

const ASSESSMENT_TYPE_LABELS: Record<
  (typeof ASSESSMENT_TYPES)[number],
  string
> = {
  "personal-care": "Personal Care",
  "daily-living": "Daily Living",
  "mobility-falls": "Mobility & Falls",
  "nutrition-hydration": "Nutrition & Hydration",
  "mental-health": "Mental Health",
  "social-engagement": "Social Engagement",
};

export function AssessmentFormFields() {
  const { control, register } = useFormContext<AssessmentForm>();

  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({
    control,
    name: "tasks",
  });

  const {
    fields: riskFields,
    append: appendRisk,
    remove: removeRisk,
  } = useFieldArray({
    control,
    name: "risks",
  });

  // const assessmentType = watch("assessmentType");

  return (
    <div className="w-full my-2">
      <div className="flex-1 gap-y-4 grid">
        {/* Assessment type (select) */}
        <div className="space-y-1.5 w-full">
          <Label>Assessment Type</Label>
          <Controller
            control={control}
            name="assessmentType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="bg-white w-full py-4">
                  <SelectValue placeholder="Select assessment type" />
                </SelectTrigger>
                <SelectContent>
                  {ASSESSMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {ASSESSMENT_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Needs */}
        <div className="space-y-1.5">
          <Label>Needs</Label>
          <Textarea
            placeholder="Describe the client’s needs…"
            {...register("needs")}
            className="min-h-[80px] resize-y"
          />
        </div>

        {/* Goal */}
        <div className="space-y-1.5">
          <Label>Goal</Label>
          <Textarea
            placeholder="What is the goal of this assessment?"
            {...register("goal")}
            className="min-h-[80px] resize-y"
          />
        </div>

        {/* Expected outcomes */}
        {/* <div className="space-y-1.5">
          <Label>Expected Outcomes</Label>
          <Input
            className="bg-white"
            placeholder="e.g. Client should complete grooming tasks with minimal support within 6 weeks."
            {...register("expectedOutcomes")}
          />
        </div> */}
        {/* Outcome status */}
        {/* <div className="space-y-1.5">
          <Label>Outcome Status</Label>
          <Controller
            control={control}
            name="outcomeStatus"
            render={({ field }) => (
              <Select
                value={field.value ?? "not-started"}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="bg-white w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {OUTCOME_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "not-started"
                        ? "Not Started"
                        : s === "in-progress"
                        ? "In Progress"
                        : "Achieved"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div> */}

        {/* Review date + responsible person */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 ">
            <Label>Review On</Label>
            <div className="relative">
              <Input
                type="date"
                {...register("reviewDueDate")}
                className="pr-8 bg-white"
              />
              {/* <CalendarIcon className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /> */}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Responsible Person</Label>
            <ResponsiblePersonSelect />
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Tasks</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => appendTask({ name: "", description: "" })}
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>

          <div className="space-y-2">
            {taskFields.map((t, idx) => (
              <div
                key={t.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr_auto] gap-2 bg-[#F7F9FC] p-2 rounded-lg"
              >
                <Input
                  className="bg-white"
                  placeholder="Task name"
                  {...register(`tasks.${idx}.name` as const)}
                />
                <Input
                  className="bg-white"
                  placeholder="Description"
                  {...register(`tasks.${idx}.description` as const)}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeTask(idx)}
                    aria-label="Remove task"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {taskFields.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No tasks added yet. Use &quot;Add Task&quot; to create one.
              </p>
            )}
          </div>
        </div>

        {/* Risks & mitigations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Risks and Mitigations</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() =>
                appendRisk({
                  description: "",
                  mitigation: "",
                  severity: "low",
                })
              }
            >
              <Plus className="h-4 w-4" />
              Add Risk
            </Button>
          </div>

          <div className="space-y-2">
            {riskFields.map((r, idx) => (
              <div className="flex  items-center gap-2">
                <div
                  key={r.id}
                  className="grid grid-cols-1 sm:grid-cols-[1.4fr_0.7fr_auto] gap-2 bg-[#F7F9FC] p-2 rounded-lg w-[90%]"
                >
                  <Input
                    className="bg-white"
                    placeholder="Risk description"
                    {...register(`risks.${idx}.description` as const)}
                  />
                  <Controller
                    control={control}
                    name={`risks.${idx}.severity` as const}
                    defaultValue="low"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-white w-full">
                          <SelectValue placeholder="Severity" />
                        </SelectTrigger>
                        <SelectContent>
                          {RISK_SEVERITIES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s[0].toUpperCase() + s.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    placeholder="Mitigation (e.g. care worker to support needs)"
                    {...register(`risks.${idx}.mitigation` as const)}
                    className="sm:col-span-3 bg-white"
                  />
                </div>
                <div className="flex justify-end sm:col-span-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeRisk(idx)}
                    aria-label="Remove risk"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {riskFields.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No risks recorded yet. Use &quot;Add Risk&quot; to add one.
              </p>
            )}
          </div>
        </div>

        {/* Notes summary */}
        <div className="space-y-1.5">
          <Label>Notes Summary</Label>
          <Textarea
            placeholder="Short summary of this assessment..."
            {...register("notesSummary")}
            className="min-h-[80px] resize-y"
          />
        </div>
      </div>
    </div>
  );
}
