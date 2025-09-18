import { z } from "zod";

export const RelationshipEnum = z.enum([
  "Spouse",
  "Son",
  "Daughter",
  "Sibling",
  "Parent",
  "Friend",
  "Neighbor",
  "Carer",
  "Other",
]);

const phoneRegex = /^\+?[0-9()\-\s.]{7,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AddContactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(2, "Full name is too short")
    .max(120, "Full name is too long"),

  relationship: RelationshipEnum,

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(phoneRegex, { message: "Enter a valid phone number" }),

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

  primaryContact: z.boolean(),
  emergencyContact: z.boolean(),
  familyAccessApp: z.boolean(),
});

// Output matches what resolver returns
export type AddContactForm = z.infer<typeof AddContactSchema>;
