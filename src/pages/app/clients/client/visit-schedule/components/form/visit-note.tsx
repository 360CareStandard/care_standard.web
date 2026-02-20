import { useFormContext } from "react-hook-form";
import { TextareaField } from "@/components/shared/textarea-field";
import { VisitScheduleNoteForm } from "@/pages/app/clients/schemas/visit-schedule";

export const VisitNoteField = () => {
    const { formState, register, watch, } =
        useFormContext<VisitScheduleNoteForm>();

    const { errors } = formState;



    return (
        <div className="space-y-4">
            <TextareaField
                label="Observations"
                placeholder="Enter your observations, tasks completed, or incident details..."
                maxLength={500}
                className="h-32 resize-none"
                autoResize
                {...register("note")}
                value={watch("note") ?? ""}
                error={errors.note?.message}
            />
        </div>
    );
};
