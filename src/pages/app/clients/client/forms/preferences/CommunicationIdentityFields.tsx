import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PreferencesForm } from "../../../schemas/preferences";

export function CommunicationIdentityFields() {
  const { register, control } = useFormContext<PreferencesForm>(); // replace with PreferencesForm type when available

  return (
    <div className="space-y-6">
      {/* Preferred Language */}
      <div className="space-y-1.5">
        <Label className="font-medium">Preferred Language</Label>
        <Input
          {...register("preferredLanguage")}
          placeholder="e.g., English, Welsh, Urdu"
        />
      </div>

      {/* Interpreter Needed */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Label className="font-medium">Interpreter Needed</Label>
          <p className="text-xs text-muted-foreground">
            Professional interpreter required
          </p>
        </div>

        <Controller
          name="interpreterNeeded"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      {/* Communication Aids */}
      <div className="space-y-1.5">
        <Label className="font-medium">Communication Aids</Label>
        <Textarea
          {...register("communicationAids")}
          placeholder="Hearing aids, visual cards, communication devices…."
          className="min-h-[84px] resize-y"
        />
      </div>

      {/* Notes for Respectful Interaction */}
      <div className="space-y-1.5">
        <Label className="font-medium">Notes for Respectful Interaction</Label>
        <Textarea
          {...register("interactionNotes")}
          placeholder="Communication style, sensitive topics, interaction preferences…"
          className="min-h-[84px] resize-y"
        />
      </div>
    </div>
  );
}
