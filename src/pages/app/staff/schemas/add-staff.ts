// features/clients/schemas/add-client.ts
import * as z from "zod";

// features/clients/schemas/add-client-api.ts

const ukMobileRegex = /^(?:\+44?7\d{9}|07\d{9})$/;

export const staffSchema = z
  .object({
    staffPicture: z.any().optional(),

    firstname: z.string().trim().min(1, "Please enter a first name"),
    lastname: z.string().trim().min(1, "Please enter a last name"),
    preferredName: z.string().optional().nullable(),
    tittle: z.string().trim().min(1, "Please enter a title"),
    pronouns: z.string().optional().nullable(),

    staffRole: z.string().trim().min(1, "Please enter a staff role"),
    // dob as string ISO
    dob: z
      .string()
      .refine((s) => !!s, "Please enter a date of birth")
      .refine((s) => !Number.isNaN(Date.parse(s)), "Invalid date")
      .refine((s) => new Date(s) <= new Date(), "DOB can’t be in the future"),

    gender: z.string().trim().min(1, "Please select a gender"),

    primaryPhoneNumber: z.preprocess(
      (val) => {
        if (typeof val !== "string") return val;
        // remove spaces, dashes, parentheses
        return val.replace(/[\s()-]/g, "");
      },
      z
        .string()
        .trim()
        .min(1, "Please enter a phone number")
        .refine((s) => ukMobileRegex.test(s), {
          message:
            "phone must be a valid UK number, e.g. +447911123456 or 07911123456",
        })
    ),
    primaryPhoneNumberType: z
      .string()
      .trim()
      .min(1, "Please enter a phone type"),
    secondaryPhoneNumber: z.preprocess(
      (val) => {
        if (typeof val !== "string") return val;
        return val.replace(/[\s()-]/g, "");
      },
      z
        .string()
        .optional()
        .nullable()
        .refine(
          (s) => {
            if (!s || s === "") return true; // allow empty
            return ukMobileRegex.test(s);
          },
          { message: "secondaryPhone must be a valid UK mobile number" }
        )
    ),
    secondaryPhoneNumberType: z.string().optional().nullable(),

    email: z
      .email("Please enter a valid email address")
      .trim()
      .min(1, "Please enter an email address"),
    highlights: z.string().optional(),
    status: z.string().trim().min(1, "Please select a status"),
    adminAccessLevel: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.staffRole === "Admin" && data.adminAccessLevel === undefined) {
      ctx.addIssue({
        path: ["adminAccessLevel"],
        message: "Please select admin access level",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type StaffFormData = z.infer<typeof staffSchema>;
