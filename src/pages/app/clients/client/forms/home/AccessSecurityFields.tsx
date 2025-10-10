// components/home/AccessSecurityFields.tsx
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
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

type AccessMethod = "Key Safe" | "Careline" | "Family Opens Door" | "Other";

const METHODS: AccessMethod[] = [
  "Key Safe",
  "Careline",
  "Family Opens Door",
  "Other",
];

export function AccessSecurityFields() {
  const [method, setMethod] = React.useState<AccessMethod>("Key Safe");
  const [keySafeCode, setKeySafeCode] = React.useState("");
  const [buzzerCode, setBuzzerCode] = React.useState("");
  const [showBuzzer, setShowBuzzer] = React.useState(false); // eye icon in screenshot is on buzzer field
  const [notes, setNotes] = React.useState("");

  return (
    <div className="space-y-6">
      {/* Access Method */}
      <div className="space-y-1.5">
        <Label>Access Method</Label>
        <Select
          value={method}
          onValueChange={(v: AccessMethod) => setMethod(v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            {METHODS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Key Safe Code (only when Key Safe selected) */}
      {method === "Key Safe" && (
        <div className="space-y-1.5">
          <Label>Key Safe Code</Label>
          {/* screenshot shows masked value; keep it simple with password type */}
          <Input
            type="password"
            value={keySafeCode}
            onChange={(e) => setKeySafeCode(e.target.value)}
            autoComplete="off"
          />
        </div>
      )}

      {/* Buzzer / Gate Code (Optional) */}
      <div className="space-y-1.5">
        <Label>
          Buzzer / Gate Code{" "}
          <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <div className="relative">
          <Input
            type={showBuzzer ? "text" : "password"}
            value={buzzerCode}
            onChange={(e) => setBuzzerCode(e.target.value)}
            placeholder=""
            autoComplete="off"
            className="pr-9"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowBuzzer((s) => !s)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2"
            aria-label={showBuzzer ? "Hide code" : "Show code"}
          >
            {showBuzzer ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Special Access Notes */}
      <div className="space-y-1.5">
        <Label>Special Access Notes</Label>
        <Textarea
          placeholder="Any special instructions…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[88px] resize-y"
        />
      </div>
    </div>
  );
}
