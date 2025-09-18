import { z } from "zod";

export const CheckInMethodEnum = z.enum(["GPS", "NFC", "QR Code"]);

// "" -> undefined, else must be uuid
const EmptyOrUuid = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v && v.trim() !== "" ? v : undefined))
  .pipe(z.string().uuid().optional()); // ensure it's uuid if present

export const SafetySchema = z.object({
  checkInMethod: CheckInMethodEnum,
  lateVisitAlertMins: z
    .number("Enter minutes")
    .int("Whole minutes only")
    .min(1, "Must be at least 1 minute")
    .max(240, "Keep under 4 hours"),
  escalationContactId: EmptyOrUuid, // <- no preprocess/unknown anymore
  loneWorkerAlert: z.boolean().default(false),
});
