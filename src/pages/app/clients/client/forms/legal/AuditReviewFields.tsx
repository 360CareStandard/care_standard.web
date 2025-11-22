// components/legal/AuditReviewFields.tsx
import * as React from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LegalForm } from "../../../schemas/legal-setup";

const PEOPLE = [
  "Alice Brown (Manager)",
  "John Smith (Senior Carer)",
  "Sarah Jones (Care Coordinator)",
];

const NOTES_MAX = 300;

export function AuditReviewFields() {
  const { control, register, setValue } = useFormContext<LegalForm>();

  // Watch the nested legalDocuments fields from the form
  const reviewDueDate = useWatch({
    control,
    name: "reviewDueDate",
  }) as string | undefined;

  const responsiblePerson = useWatch({
    control,
    name: "responsiblePerson",
  }) as string | undefined;

  const notesSummary = useWatch({
    control,
    name: "notesSummary",
  }) as string | undefined;

  // Compute overdue flag from the watched date
  const isOverdue = React.useMemo(() => {
    if (!reviewDueDate) return false;
    const today = new Date();
    const d = new Date(reviewDueDate);
    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return d < today;
  }, [reviewDueDate]);

  // Ensure notes length limit is enforced in form state
  React.useEffect(() => {
    if (notesSummary && notesSummary.length > NOTES_MAX) {
      setValue("notesSummary", notesSummary.slice(0, NOTES_MAX), {
        shouldDirty: true,
      });
    }
  }, [notesSummary, setValue]);

  return (
    <div className="space-y-6">
      {/* Row: date + responsible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Label>Review Due Date</Label>
            {reviewDueDate && (
              <span
                className={[
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px]",
                  isOverdue
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700",
                ].join(" ")}
              >
                {isOverdue ? "Overdue" : "Scheduled"}
              </span>
            )}
          </div>

          {/* date input bound to reviewDueDate */}
          <Input
            type="date"
            placeholder="mm/dd/yyyy"
            {...register("reviewDueDate")}
            value={reviewDueDate ?? ""}
            onChange={(e) => {
              setValue("reviewDueDate", e.target.value, {
                shouldDirty: true,
              });
            }}
          />
        </div>

        <div className="space-y-1">
          <Label>Responsible Person</Label>

          {/* select bound to responsiblePerson */}
          <Controller
            control={control}
            name="responsiblePerson"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {PEOPLE.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label className="font-medium">Notes / Summary</Label>
        <Textarea
          placeholder="Quick legal summary for frontline staff..."
          className="min-h-[96px] resize-y"
          {...register("notesSummary")}
          value={notesSummary ?? ""}
          onChange={(e) =>
            setValue("notesSummary", e.target.value.slice(0, NOTES_MAX), {
              shouldDirty: true,
            })
          }
        />
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            Keep this concise; it’s shown to frontline staff.
          </p>
          <span className="text-[11px] text-muted-foreground">
            {(notesSummary ?? "").length}/{NOTES_MAX}
          </span>
        </div>
      </div>
    </div>
  );
}
