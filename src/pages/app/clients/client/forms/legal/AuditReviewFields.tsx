// components/legal/AuditReviewFields.tsx
import * as React from "react";
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

const PEOPLE = [
  "Alice Brown (Manager)",
  "John Smith (Senior Carer)",
  "Sarah Jones (Care Coordinator)",
];

const NOTES_MAX = 300;

export function AuditReviewFields() {
  const [reviewDate, setReviewDate] = React.useState("");
  const [responsible, setResponsible] = React.useState<string | undefined>();
  const [notes, setNotes] = React.useState("");

  const isOverdue = React.useMemo(() => {
    if (!reviewDate) return false;
    const today = new Date();
    const d = new Date(reviewDate);
    // zero-out time for a simple date-only compare
    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return d < today;
  }, [reviewDate]);

  return (
    <div className="space-y-6">
      {/* Row: date + responsible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Label>Review Due Date</Label>
            {reviewDate && (
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
          <Input
            type="date"
            value={reviewDate}
            onChange={(e) => setReviewDate(e.target.value)}
            placeholder="mm/dd/yyyy"
          />
          {/* <p className="text-[11px] text-muted-foreground">
            Set the next review date for legal information.
          </p> */}
        </div>

        <div className="space-y-1">
          <Label>Responsible Person</Label>
          <Select value={responsible} onValueChange={setResponsible}>
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
          {/* <p className="text-[11px] text-muted-foreground">
            Assigned owner who will oversee the review.
          </p> */}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label className="font-medium">Notes / Summary</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, NOTES_MAX))}
          placeholder="Quick legal summary for frontline staff..."
          className="min-h-[96px] resize-y"
        />
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            Keep this concise; it’s shown to frontline staff.
          </p>
          <span className="text-[11px] text-muted-foreground">
            {notes.length}/{NOTES_MAX}
          </span>
        </div>
      </div>
    </div>
  );
}
