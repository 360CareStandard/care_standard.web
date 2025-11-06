// features/clients/schemas/add-client.ts
import * as z from "zod";

// features/clients/schemas/add-client-api.ts

const ukMobileRegex = /^(?:\+44?7\d{9}|07\d{9})$/;

export const clientSchema = z.object({
  profileImage: z.string().optional(),

  // personal names (payload uses lowercase-ish keys)
  title: z.string().optional(), // payload has "Mr." etc
  firstname: z.string().trim().min(1, "Please enter a first name"),
  middlename: z.string().optional().nullable(), // payload: "middlename"
  lastname: z.string().trim().min(1, "Please enter a last name"),
  preferredname: z.string().optional().nullable(),
  pronouns: z.string().optional().nullable(),

  // dob as string ISO
  dob: z
    .string()
    .refine((s) => !!s, "Please enter a date of birth")
    .refine((s) => !Number.isNaN(Date.parse(s)), "Invalid date")
    .refine((s) => new Date(s) <= new Date(), "DOB can’t be in the future"),

  gender: z.string().optional(),
  nationality: z.string().optional(),

  // address keys (payload uses addressLine1/2, city, county, state, zip, country)
  addressLine1: z.string().trim().min(1, "Please enter address line 1"),
  addressLine2: z.string().optional().nullable(),
  city: z.string().trim().min(1, "Please enter a city"),
  county: z.string().optional().nullable(), // payload contains county
  state: z.string().optional().nullable(),
  zip: z.string().trim().min(1, "Please enter a postal code"),
  country: z.string().optional(),

  accessDetails: z.string().optional().nullable(),

  // coordinates in payload: "latitude", "longitude" (nullable)
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  secureCheckInZone: z.number().nullable().optional(), // unknown type: nullable number

  // phone fields (payload: phone, phoneType, secondaryPhone, secondaryPhoneType)

  phone: z.preprocess(
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
  phoneType: z.string().trim().min(1, "Please enter a phone type"),
  secondaryPhone: z.preprocess(
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
  secondaryPhoneType: z.string().optional().nullable(),

  email: z
    .string()
    .trim()
    .min(1, "Please enter an email address")
    .email("Please enter a valid email address"),

  // wellbeing / risk
  wellbeingDetails: z
    .string()
    .trim()
    .min(1, "Please enter a wellbeing overview")
    .max(400, "Maximum 400 characters"),
  riskLevel: z.string().trim().min(1, "Select a risk level"),

  status: z.string().trim().min(1, "Please enter a status"),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
