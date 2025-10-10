// components/preferences/CulturalFaithFields.tsx
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CulturalFaithFields() {
  const [religion, setReligion] = React.useState("");
  const [practices, setPractices] = React.useState("");
  const [considerations, setConsiderations] = React.useState("");

  return (
    <div className="space-y-6">
      {/* Religion / Faith */}
      <div className="space-y-1.5">
        <Label className="font-medium">Religion / Faith</Label>
        <Input
          placeholder="e.g., Christianity, Islam, Judaism, None"
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
        />
      </div>

      {/* Faith Practices */}
      <div className="space-y-1.5">
        <Label className="font-medium">Faith Practices</Label>
        <Textarea
          placeholder="Prayer times, dietary rules, festivals, religious observances"
          value={practices}
          onChange={(e) => setPractices(e.target.value)}
          className="min-h-[84px] resize-y "
        />
      </div>

      {/* Cultural Considerations */}
      <div className="space-y-1.5">
        <Label className="font-medium">Cultural Considerations</Label>
        <Textarea
          placeholder="Cultural customs, greetings, traditions, language preferences..."
          value={considerations}
          onChange={(e) => setConsiderations(e.target.value)}
          className="min-h-[84px] resize-y "
        />
      </div>
    </div>
  );
}
