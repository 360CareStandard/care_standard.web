// pages/components/care-plan-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { CarePlan } from "@/types/client/care-plan";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfoRow } from "../../components/info-row";

type Props = {
  plan: CarePlan;
  onView?: (plan: CarePlan) => void;
  onEdit?: (plan: CarePlan) => void;
  onArchive?: (plan: CarePlan) => void;
};

// Map backend slug -> label
const ASSESSMENT_LABELS: Record<string, string> = {
  "personal-care": "Personal Care",
  "daily-living": "Daily Living",
  "mobility-falls": "Mobility & Falls",
  "nutrition-hydration": "Nutrition & Hydration",
  "mental-health": "Mental Health",
  "social-engagement": "Social Engagement",
};

const OUTCOME_LABELS: Record<string, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  achieved: "Achieved",
};

const SEVERITY_CLASS: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

export function CarePlanCard({ plan, onView, onEdit, onArchive }: Props) {
  const assessmentLabel =
    ASSESSMENT_LABELS[plan.assessmentType] ?? plan.assessmentType;

  const outcomeLabel = OUTCOME_LABELS[plan.outcomeStatus] ?? plan.outcomeStatus;

  const firstRisk = plan.risks?.[0];

  const statusBadge = (() => {
    if (plan.status === "archived") {
      return (
        <span className="rounded-full bg-slate-100 text-slate-700 text-xs px-2 py-0.5">
          Archived
        </span>
      );
    }
    if (plan.status === "inactive") {
      return (
        <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5">
          Inactive
        </span>
      );
    }
    return (
      <span className="rounded-full bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5">
        Active
      </span>
    );
  })();

  return (
    <Card className=" w-[933px] ">
      <CardContent className="space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base">{assessmentLabel}</h3>
              {statusBadge}
            </div>
            <p className="text-xs text-muted-foreground">
              Updated:{" "}
              {new Date(plan.updatedAt ?? plan.createdAt).toLocaleDateString()}
              {plan.createdBy && (
                <>
                  {" "}
                  by <span className="font-medium">{plan.createdBy}</span>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {plan.reviewDueDate && (
              <div className="text-right flex gap-2 items-center">
                <p className="text-xs text-muted-foreground  tracking-wide">
                  Review On
                </p>
                <p className="text-xs font-medium">
                  {new Date(plan.reviewDueDate).toLocaleDateString()}
                </p>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className=" h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="text-xs">
                <DropdownMenuItem onClick={() => onView?.(plan)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(plan)}>
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onArchive?.(plan)}>
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <hr className="w-full h-full " />

        {/* 2-column info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-xs">
          {/* left column */}
          <div className="space-y-4">
            <InfoRow label="Needs">{plan.needs || "—"}</InfoRow>
            <InfoRow label="Outcomes">{outcomeLabel}</InfoRow>
            <InfoRow label="Tasks">
              {" "}
              {plan.tasks?.length
                ? plan.tasks.map((t) => t.name).join(", ")
                : "—"}
            </InfoRow>
          </div>

          {/* right column */}
          <div className="space-y-4">
            <InfoRow label="Goal">{plan.goal || "—"}</InfoRow>
            <InfoRow label="Responsible Person">
              {" "}
              {plan.responsiblePersonId || "Not assigned"}
            </InfoRow>
          </div>
          <div>
            <InfoRow
              label={` Risks and Mitigations   ${
                plan.risks?.length ? ` (${plan.risks.length})` : ""
              }`}
            >
              {" "}
            </InfoRow>

            {firstRisk ? (
              <div className="space-y-2">
                <div className=" flex items-center gap-2">
                  <span className="text-sm line-clamp-1">
                    {firstRisk.description}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      SEVERITY_CLASS[firstRisk.severity]
                    )}
                  >
                    {firstRisk.severity}
                  </span>
                </div>
                <span className="text-xs ">{firstRisk.mitigation}</span>
              </div>
            ) : (
              <p className="text-sm">—</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
