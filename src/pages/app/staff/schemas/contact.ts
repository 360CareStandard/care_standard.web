import { z } from "zod";

export const RelationshipEnum = z.enum([
  "spouse",
  "son",
  "daughter",
  "sibling",
  "parent",
  "friend",
  "neighbor",
  "carer",
  "guardian",
  "other",
]);

const phoneRegex = /^\+?[0-9()\-\s.]{7,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ukMobileRegex = /^(?:\+44?7\d{9}|07\d{9})$/;

export const AddStaffContactSchema = z.object({
  nextOfKinFullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(2, "Full name is too short")
    .max(120, "Full name is too long"),

  relationship: z.string().trim().min(1, "Required"),
  gender: z.string().trim().min(1, "Required"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(phoneRegex, { message: "Enter a valid phone number" })
    .refine((s) => ukMobileRegex.test(s), {
      message:
        "phone must be a valid UK number, e.g. +447911123456 or 07911123456",
    }),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .regex(emailRegex, { message: "Enter a valid email address" }),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(240, "Address is too long"),

  notes: z
    .string()
    .trim()
    .min(1, "Notes are required")
    .max(1000, "Notes are too long"),

  availiableForUrgentSituation: z.boolean().optional(),
  mainPointOfContact: z.boolean().optional(),
});

// Output matches what resolver returns
export type AddStaffContactForm = z.infer<typeof AddStaffContactSchema>;
