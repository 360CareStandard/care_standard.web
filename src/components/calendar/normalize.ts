// calendar/normalizeAvailabilityToFC.ts
import dayjs from "dayjs";
import { AvailabilityRule } from "./types";
import { expandAvailabilityRule } from "./expand-availability";

export function normalizeAvailabilityRulesToFC(
  rules: AvailabilityRule[],
  visibleStart: dayjs.Dayjs,
  visibleEnd: dayjs.Dayjs,
) {
  return rules.flatMap((rule) =>
    expandAvailabilityRule(rule, visibleStart, visibleEnd),
  );
}
