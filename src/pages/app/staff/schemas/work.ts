import z from "zod";

export const StaffWorkSchema = z.object({
  address: z.string().trim().min(1, "Address is required"),
  map: z.string().trim().optional(),

  latitude: z.number(),
  longitude: z.number(),

  modeOfTransport: z.string().trim().min(1, "Required"),

  rateCard: z
    .union([z.number(), z.nan()])
    .transform((v) => (Number.isNaN(v) ? null : v))
    .nullable()
    .optional(),

  travelRateCard: z
    .union([z.number(), z.nan()])
    .transform((v) => (Number.isNaN(v) ? null : v))
    .nullable()
    .optional(),

  note: z.string().trim().max(1000).optional(),

  isEmail: z.boolean().optional(),
  isText: z.boolean().optional(),
  isPhone: z.boolean().optional(),
  isApp: z.boolean().optional(),
});
export type StaffWorkForm = z.infer<typeof StaffWorkSchema>;
