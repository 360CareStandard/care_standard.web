import { z } from "zod";

export const StaffPermissionSchema = z.object({
  staffRole: z.string().trim().min(1, "Please select a role"),
  adminAccessLevel: z.boolean().default(false),
  platformAccess: z.boolean().default(false),
  mobileAppAccess: z.boolean().default(false),
  status: z.string().trim().min(1, "Please select a status"),
});

// Output matches what resolver returns
export type StaffPermissionForm = z.infer<typeof StaffPermissionSchema>;
