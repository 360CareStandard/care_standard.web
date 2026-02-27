import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/shared/spinner";
import { StaffAvailability } from "@/types/staff/availability";
import { CircleX, Clock3, Repeat2, X } from "lucide-react";
import {
  availabilityDurationLabel,
  formatTimeLabel,
  frequencyLabel,
} from "../../utils/availability-form-helpers";

type DeleteMode = "instance" | "future";

type Props = {
  open: boolean;
  selectedAvailability: StaffAvailability | null;
  deleteMode: DeleteMode;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteModeChange: (mode: DeleteMode) => void;
  onConfirmDelete: () => void;
};

export default function DeleteAvailabilityDialog({
  open,
  selectedAvailability,
  deleteMode,
  isDeleting,
  onOpenChange,
  onDeleteModeChange,
  onConfirmDelete,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[700px] gap-5 p-5">
        <AlertDialogHeader className="gap-1 text-left">
          <div className="flex items-start justify-between">
            <AlertDialogTitle className="font-semibold text-slate-900">
              Delete availability?
            </AlertDialogTitle>
            <AlertDialogCancel
              className="h-auto border-0 p-0 text-slate-700 shadow-none hover:bg-transparent"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </AlertDialogCancel>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Repeat2 className="h-4 w-4" />
              {frequencyLabel(selectedAvailability)}
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-4 w-4" />
              {formatTimeLabel(selectedAvailability?.startTime)} to{" "}
              {formatTimeLabel(selectedAvailability?.endTime)} (
              {availabilityDurationLabel(selectedAvailability)})
            </span>
          </div>
        </AlertDialogHeader>

        <div className="rounded-md border border-[#F6DB98] bg-[#FFFBEB] p-4">
          <p className="mb-2 text-slate-500">Deleting will:</p>
          <div className="space-y-2 text-sm text-slate-700">
            <p className="flex items-center gap-1">
              <CircleX className="h-5 w-5 text-[#F28A15]" />
              Remove person from assigned visits
            </p>
            <p className="flex items-center gap-2">
              <CircleX className="h-5 w-5 text-[#F28A15]" />
              You will need to re-assign alternative carers.
            </p>
          </div>
        </div>

        <RadioGroup
          value={deleteMode}
          onValueChange={(value) =>
            onDeleteModeChange(value as "instance" | "future")
          }
          className="space-y-2"
        >
          <Label
            htmlFor="delete-instance"
            className="flex cursor-pointer items-start gap-3 rounded-md border p-4"
          >
            <RadioGroupItem
              id="delete-instance"
              value="instance"
              className="mt-1 h-6 w-6"
            />
            <div>
              <p className="text-sm font-medium text-slate-700">
                Delete for instance only
              </p>
              <p className="text-xs text-slate-500">
                Removes availability for selected date only. Future availability
                remains unchanged.
              </p>
            </div>
          </Label>

          <Label
            htmlFor="delete-future"
            className="flex cursor-pointer items-start gap-3 rounded-md border p-4"
          >
            <RadioGroupItem
              id="delete-future"
              value="future"
              className="mt-1 h-6 w-6"
            />
            <div>
              <p className="text-sm font-medium text-slate-700">
                Delete for instance and all future availability
              </p>
              <p className="text-xs text-slate-500">
                Removes this availability pattern for all upcoming days as per
                schedule created.
              </p>
            </div>
          </Label>
        </RadioGroup>

        <AlertDialogFooter className="mt-2 flex-row justify-end gap-3">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className="bg-emerald-700 text-white hover:bg-emerald-800"
            onClick={onConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner size="sm" /> : null}
            Delete availability
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
