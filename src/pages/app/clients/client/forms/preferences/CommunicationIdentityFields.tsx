// components/preferences/CommunicationIdentityFields.tsx
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function CommunicationIdentityFields() {
  const [language, setLanguage] = React.useState("");
  const [needsInterpreter, setNeedsInterpreter] = React.useState(false);
  const [aids, setAids] = React.useState("");
  const [respectNotes, setRespectNotes] = React.useState("");

  return (
    <div className="space-y-6">
      {/* Preferred Language */}
      <div className="space-y-1.5">
        <Label className="font-medium">Preferred Language</Label>
        <Input
          placeholder="e.g., English, Welsh, Urdu"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className=""
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
        <Switch
          checked={needsInterpreter}
          onCheckedChange={setNeedsInterpreter}
        />
      </div>

      {/* Communication Aids */}
      <div className="space-y-1.5">
        <Label className="font-medium">Communication Aids</Label>
        <Textarea
          placeholder="Hearing aids, visual cards, communication devices…."
          value={aids}
          onChange={(e) => setAids(e.target.value)}
          className="min-h-[84px] resize-y "
        />
      </div>

      {/* Notes for Respectful Interaction */}
      <div className="space-y-1.5">
        <Label className="font-medium">Notes for Respectful Interaction</Label>
        <Textarea
          placeholder="Communication style, sensitive topics, interaction preferences…"
          value={respectNotes}
          onChange={(e) => setRespectNotes(e.target.value)}
          className="min-h-[84px] resize-y "
        />
      </div>
    </div>
  );
}
