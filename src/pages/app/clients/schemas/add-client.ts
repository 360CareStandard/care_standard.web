// features/clients/schemas/add-client.ts
import * as z from "zod";

export const clientSchema = z.object({
  profileImage: z.string().optional(),

  title: z.string("Please enter a title").trim().min(1, "Please enter a title"),

  firstName: z
    .string("Please enter a first name")
    .trim()
    .min(1, "Please enter a first name"),

  middleName: z.string().optional(),

  lastName: z
    .string("Please enter a last name")
    .trim()
    .min(1, "Please enter a last name"),

  preferredName: z.string().optional(),
  pronouns: z.string().optional(),

  dateOfBirth: z
    .string("Please enter a date of birth")
    .refine((s) => !!s, "Please enter a date of birth")
    .refine((s) => !Number.isNaN(Date.parse(s)), "Invalid date")
    .refine((s) => new Date(s) <= new Date(), "DOB can’t be in the future"),

  status: z
    .string("Please enter a status")
    .trim()
    .min(1, "Please enter a status"),

  primaryPhoneNumber: z
    .string("Please enter a phone number")
    .trim()
    .min(1, "Please enter a phone number"),

  primaryPhoneType: z
    .string("Please enter a phone type")
    .trim()
    .min(1, "Please enter a phone type"),

  primaryPhoneCountry: z
    .string("Please select a country")
    .trim()
    .min(1, "Please select a country"),

  additionalPhoneNumber: z.string().optional(),
  additionalPhoneType: z.string().optional(),
  additionalPhoneCountry: z.string().optional(),

  emailAddress: z
    .string()
    .trim()
    .min(1, "Please enter an email address")
    .email("Please enter a valid email address"),

  addressLine1: z.string().trim().min(1, "Please enter address line 1"),
  addressLine2: z.string().optional(),
  city: z.string().trim().min(1, "Please enter a city"),
  state: z.string().trim().min(1, "Please enter a county/state"),
  postcode: z.string().trim().min(1, "Please enter a postal code"),
  riskLevel: z.string().trim().min(1, "Select a risk level"),
  wellbeing: z
    .string("Please enter a wellbeing overview")
    .trim()
    .min(1, "Please enter a wellbeing overview")
    .max(400, "Maximum 400 characters"),

  accessDetails: z.string().optional(),
  lat: z.number("Location is required"),
  lng: z.number("Location is required"),
  checkinRadiusM: z.number().min(50).max(2000),
});

export type ClientFormData = z.infer<typeof clientSchema>;
