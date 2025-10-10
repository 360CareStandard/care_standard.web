// components/gp/GPInformationFields.tsx
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function GPInformationFields() {
  const [gpName, setGpName] = React.useState("");
  const [practiceName, setPracticeName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [address, setAddress] = React.useState("");

  return (
    <div className="space-y-4">
      {/* row: gp + practice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>GP Name</Label>
          <Input
            placeholder="e.g., Dr. Smith"
            value={gpName}
            onChange={(e) => setGpName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Practice Name</Label>
          <Input
            placeholder="Medical Practice Name"
            value={practiceName}
            onChange={(e) => setPracticeName(e.target.value)}
          />
        </div>
      </div>

      {/* row: phone + email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Phone Number</Label>
          <Input
            inputMode="tel"
            placeholder="020 7777 8888"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label>
            Email <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            type="email"
            inputMode="email"
            placeholder="gp@practice.nhs.uk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* address */}
      <div className="space-y-1.5">
        <Label>Practice Address</Label>
        <Textarea
          placeholder="Practice address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="min-h-[88px] resize-y "
        />
      </div>
    </div>
  );
}
