
import { z } from "zod";


const phoneRegex = /^\+?[0-9()\-\s.]{7,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AccessSettingsSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, "Full name is required")
        .min(2, "Full name is too short")
        .max(120, "Full name is too long"),

    relationshipToClient: z.string().trim().min(1, "Required"),

    phone: z
        .string()
        .trim()
        .min(1, "Phone number is required")
        .regex(phoneRegex, { message: "Enter a valid phone number" })
    ,

    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .regex(emailRegex, { message: "Enter a valid email address" }),

    accessLevel: z.string().trim().min(1, "Please select access level"),
});

// Output matches what resolver returns
export type AccessSettingsForm = z.infer<typeof AccessSettingsSchema>;
