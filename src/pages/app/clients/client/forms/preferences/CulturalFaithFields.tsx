import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PreferencesForm } from "../../../schemas/preferences"; // uncomment & fix path if you have the type

export function CulturalFaithFields() {
  const { register } = useFormContext<PreferencesForm>(); // replace `any` with PreferencesForm if available

  return (
    <div className="space-y-6">
      {/* Religion / Faith */}
      <div className="space-y-1.5">
        <Label className="font-medium">Religion / Faith</Label>
        <Input
          {...register("religionOrFaith")}
          placeholder="e.g., Christianity, Islam, Judaism, None"
        />
      </div>

      {/* Faith Practices */}
      <div className="space-y-1.5">
        <Label className="font-medium">Faith Practices</Label>
        <Textarea
          {...register("faithPractices")}
          placeholder="Prayer times, dietary rules, festivals, religious observances"
          className="min-h-[84px] resize-y"
        />
      </div>

      {/* Cultural Considerations */}
      <div className="space-y-1.5">
        <Label className="font-medium">Cultural Considerations</Label>
        <Textarea
          {...register("culturalConsiderations")}
          placeholder="Cultural customs, greetings, traditions, language preferences..."
          className="min-h-[84px] resize-y"
        />
      </div>
    </div>
  );
}
