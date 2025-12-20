import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloseCircle, Danger } from "iconsax-react";

type Props = {
  missing: string[];
  onResolve: () => void;
};

export function MissingHealthInfoCard({ missing, onResolve }: Props) {
  return (
    <Card className="border-amber-200 bg-amber-50 max-w-2xl mx-auto mt-24">
      <CardContent className="px-6 py-2 space-y-6">
        {/* Header */}
        <div className="flex gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
            <Danger className="h-5 w-5 text-amber-600" />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              Missing health information
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              We need a few essential health details before adding medication.
              This ensures safe and compliant MAR records for the client.
            </p>
          </div>
        </div>

        {/* Missing sections */}
        <div className="rounded-lg border border-amber-200 bg-white p-4 space-y-3">
          <p className="text-sm ">Please complete the following sections:</p>

          <ul className="space-y-2">
            {missing.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm">
                <CloseCircle className="h-5 w-5 text-orange-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Why */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <strong>Why is this needed?</strong> Medication administration
          requires complete health context including known allergies,
          prescribing GP information, and emergency contacts to ensure safe care
          delivery and CQC compliance.
        </div>

        {/* CTA */}
        <Button className="w-full" onClick={onResolve}>
          Go to missing sections
        </Button>
      </CardContent>
    </Card>
  );
}
