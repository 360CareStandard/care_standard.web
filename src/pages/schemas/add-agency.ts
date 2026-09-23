// import { z } from "zod";

// export const createAgencySchema = z.object({
//   agency: z.object({
//     legalName: z
//       .string()
//       .min(2, "Legal name must be at least 2 characters")
//       .max(150, "Legal name must not exceed 150 characters")
//       .trim(),

//     tradingName: z
//       .string()
//       .min(2, "Trading name must be at least 2 characters")
//       .max(150, "Trading name must not exceed 150 characters")
//       .trim(),

//     country: z
//       .string()
//       .min(2, "Country is required")
//       .max(100, "Country name is too long")
//       .trim(),

//     settings: z
//       .record(z.string(), z.unknown())
//       .default({}),
//   }),

//   owner: z.object({
//     email: z
//       .string()
//       .email("Please enter a valid email address")
//       .trim()
//       .toLowerCase(),

//     firstname: z
//       .string()
//       .min(2, "First name must be at least 2 characters")
//       .max(100, "First name must not exceed 100 characters")
//       .trim(),

//     lastname: z
//       .string()
//       .min(2, "Last name must be at least 2 characters")
//       .max(100, "Last name must not exceed 100 characters")
//       .trim(),

//     phone: z
//       .string()
//       .min(7, "Please enter a valid phone number")
//       .max(30, "Phone number is too long")
//       .trim(),
//   }),

//   sendEmails: z.boolean().default(true),
// });

// export type CreateAgencyFormValues = z.infer<typeof createAgencySchema>;

import { z } from "zod";

export const createAgencySchema = z.object({
    agency: z.object({
        legalName: z
            .string()
            .trim()
            .min(2, "Legal name must be at least 2 characters")
            .max(150, "Legal name must not exceed 150 characters"),

        tradingName: z
            .string()
            .trim()
            .min(2, "Trading name must be at least 2 characters")
            .max(150, "Trading name must not exceed 150 characters"),

        country: z
            .string()
            .trim()
            .min(1, "Please select a country"),

        settings: z.record(z.string(), z.unknown()).default({}),
    }),

    owner: z.object({
        firstname: z
            .string()
            .trim()
            .min(2, "First name must be at least 2 characters")
            .max(100, "First name must not exceed 100 characters"),

        lastname: z
            .string()
            .trim()
            .min(2, "Last name must be at least 2 characters")
            .max(100, "Last name must not exceed 100 characters"),

        email: z
            .string()
            .trim()
            .email("Please enter a valid email address"),

        phone: z
            .string()
            .trim()
            .min(7, "Please enter a valid phone number")
            .max(30, "Phone number is too long"),
    }),

    sendEmails: z.boolean(),
});

export type CreateAgencyFormInput = z.input<
    typeof createAgencySchema
>;

export type CreateAgencyFormData = z.output<
    typeof createAgencySchema
>;