import { z } from "zod";

const ukMobileRegex = /^(?:\+447\d{9}|07\d{9})$/;

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Please enter a phone number")
  .transform((value) =>
    value.replace(/[\s()-]/g, ""),
  )
  .refine(
    (value) => ukMobileRegex.test(value),
    {
      message:
        "Please enter a valid UK mobile number, e.g. +447911123456 or 07911123456",
    },
  );

export const clientSchema = z.object({
  clientPicture: z.any().optional(),

  title: z.string().optional(),

  firstname: z
    .string()
    .trim()
    .min(1, "Please enter a first name"),

  middlename: z.string().nullable().optional(),

  lastname: z
    .string()
    .trim()
    .min(1, "Please enter a last name"),

  preferredname: z.string().nullable().optional(),

  pronouns: z.string().nullable().optional(),

  dob: z
    .string()
    .min(1, "Please enter a date of birth")
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Invalid date",
    )
    .refine(
      (value) => new Date(value) <= new Date(),
      "DOB can't be in the future",
    ),

  gender: z.string().optional(),

  nationality: z.string().optional(),

  addressLine1: z
    .string()
    .trim()
    .min(1, "Please enter address line 1"),

  addressLine2: z.string().nullable().optional(),

  city: z
    .string()
    .trim()
    .min(1, "Please enter a city"),

  county: z.string().nullable().optional(),

  state: z.string().nullable().optional(),

  zip: z
    .string()
    .trim()
    .min(1, "Please enter a postal code"),

  country: z.string().optional(),

  accessDetails: z.string().nullable().optional(),

  latitude: z.number().nullable().optional(),

  longitude: z.number().nullable().optional(),

  secureCheckInZone: z
    .number()
    .nullable()
    .optional(),

  phone: phoneSchema,

  phoneType: z
    .string()
    .trim()
    .min(1, "Please enter a phone type"),

  secondaryPhone: z
    .string()
    .trim()
    .transform((value) =>
      value.replace(/[\s()-]/g, ""),
    )
    .refine(
      (value) =>
        value === "" ||
        ukMobileRegex.test(value),
      {
        message:
          "Please enter a valid UK mobile number",
      },
    )
  ,

  secondaryPhoneType: z
    .string()
    .nullable()
    .optional(),

  email: z
    .string()
    .trim()
    .min(1, "Please enter an email address")
    .email("Please enter a valid email address"),

  wellbeingDetails: z
    .string()
    .trim()
    .min(1, "Please enter a wellbeing overview")
    .max(400, "Maximum 400 characters"),

  riskLevel: z
    .string()
    .trim()
    .min(1, "Select a risk level"),

  status: z
    .string()
    .trim()
    .min(1, "Please select a status"),

  // metadata: z
  //   .record(z.string(), z.unknown())
  //   .optional(),
});

export type ClientFormData =
  z.infer<typeof clientSchema>;