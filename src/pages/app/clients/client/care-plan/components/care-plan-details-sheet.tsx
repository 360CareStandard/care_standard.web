// pages/components/care-plan-details-sheet.tsx

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CarePlan } from "@/types/client/care-plan";
import { cn } from "@/lib/utils";
import { SheetForm } from "@/components/shared/sheet-form";
import { InfoRow } from "../../components/info-row";
import { Edit } from "iconsax-react";
import { Badge } from "@/components/ui/badge";
import { callTypes } from "../../../components/data/data";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: CarePlan | null;
  onEdit?: (plan: CarePlan) => void;
  onArchive?: (plan: CarePlan) => void;
};

const ASSESSMENT_LABELS: Record<string, string> = {
  "personal-care": "Personal Care",
  "daily-living": "Daily Living",
  "mobility-falls": "Mobility & Falls",
  "nutrition-hydration": "Nutrition & Hydration",
  "mental-health": "Mental Health",
  "social-engagement": "Social Engagement",
};

const OUTCOME_LABELS: Record<string, string> = {
  "not-started": "Not achieved",
  "in-progress": "In progress",
  achieved: "Achieved",
};

const SEVERITY_CLASS: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

export function CarePlanDetailsSheet({
  open,
  onOpenChange,
  plan,
  onEdit,
  onArchive,
}: Props) {
  if (!plan) return null;

  const assessmentLabel =
    ASSESSMENT_LABELS[plan.assessmentType] ?? plan.assessmentType;

  const outcomeLabel = OUTCOME_LABELS[plan.outcomeStatus] ?? plan.outcomeStatus;

  const createdDate = new Date(plan.createdAt).toLocaleDateString();

  const reviewDate = plan.reviewDueDate
    ? new Date(plan.reviewDueDate).toLocaleDateString()
    : "—";
  const badgeColor = callTypes.get(plan.status);

  return (
    <SheetForm
      open={open}
      onOpenChange={onOpenChange}
      title="Care Plan Details"
      description=" View client plan details"
      submitLabel=""
      submitDisabled
    >
      {/* body */}
      <div className="flex-1 overflow-y-auto py-5 space-y-6">
        {/* top row: status + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex space-x-2">
            <Badge variant="outline" className={cn("capitalize", badgeColor)}>
              {plan.status ?? "—"}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(plan)}
            >
              <Edit />
              Update
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onArchive?.(plan)}
            >
              Archive
            </Button>
          </div>
        </div>

        {/* title + meta */}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{assessmentLabel}</h2>
          <p className="text-xs text-muted-foreground">
            Created: {createdDate}
            {plan.createdBy && (
              <>
                {" "}
                | By: <span className="font-medium">{plan.createdBy}</span>
              </>
            )}
          </p>
        </div>

        {/* tabs */}
        <Tabs defaultValue="overview">
          <TabsList className=" justify-start rounded-none border-b bg-transparent p-0">
            {["overview", "goals", "tasks", "audit"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {tab === "overview"
                  ? "Overview"
                  : tab[0].toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="mt-4">
            <div className="border rounded-2xl px-5 py-2  bg-white">
              <InfoRow label="Assessment Type">{assessmentLabel}</InfoRow>
              <InfoRow label="Needs">{plan.needs || "—"}</InfoRow>
              <InfoRow label="Review Date">{reviewDate}</InfoRow>
              <InfoRow label="Responsible">
                {plan.responsiblePersonId || "Not assigned"}
              </InfoRow>
            </div>
          </TabsContent>

          {/* GOALS */}
          <TabsContent value="goals" className="mt-4">
            <div className="border rounded-2xl px-5 py-2 bg-white">
              <InfoRow label="Goal">{plan.goal || "—"}</InfoRow>
              <InfoRow label="Outcomes">{outcomeLabel}</InfoRow>
              <InfoRow
                label={`Risks and mitigations ${
                  plan.risks?.length ? ` (${plan.risks.length})` : ""
                }`}
              >
                {" "}
                {plan.risks?.length ? (
                  <div className="mt-2 space-y-3">
                    {plan.risks.map((r, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="text-sm">{r.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.mitigation}
                        </p>
                        <span
                          className={cn(
                            "inline-flex text-[11px] px-2 py-0.5 rounded-full font-medium mt-1",
                            SEVERITY_CLASS[r.severity]
                          )}
                        >
                          {r.severity.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm">No risks recorded.</p>
                )}
              </InfoRow>
            </div>
          </TabsContent>

          {/* TASKS */}
          <TabsContent value="tasks" className="mt-4">
            <div className="space-y-3">
              {plan.tasks?.length ? (
                plan.tasks.map((t, idx) => (
                  <div
                    key={idx}
                    className="border rounded-2xl px-5 py-2 bg-white "
                  >
                    <p className="text-xs font-semibold">Task {idx + 1}</p>
                    <InfoRow label=" Task name">{t.name || "—"}</InfoRow>
                    <InfoRow label=" Description">
                      {t.description || "—"}
                    </InfoRow>
                  </div>
                ))
              ) : (
                <div className="border rounded-2xl px-5 py-4 bg-white">
                  <p className="text-sm">No tasks have been added.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* AUDIT */}
          <TabsContent value="audit" className="mt-4">
            <div className="border rounded-2xl px-5 py-2 bg-white ">
              <InfoRow label="Created">
                {" "}
                {new Date(plan.createdAt).toLocaleString()}
                {plan.createdBy && ` by ${plan.createdBy}`}
              </InfoRow>
              <InfoRow label="Last Updated">
                {" "}
                {new Date(plan.updatedAt).toLocaleString()}
                {plan.updatedBy && ` by ${plan.updatedBy}`}
              </InfoRow>
              <InfoRow label="Status">
                {" "}
                <p className="capitalize">{plan.status}</p>
              </InfoRow>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SheetForm>
  );
}
