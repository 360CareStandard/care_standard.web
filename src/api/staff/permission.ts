// src/api/staff/permission.ts

import { apiGet, apiPatch, apiPost } from "@/utils/api-connect";
import { StaffPermissionForm } from "@/pages/app/staff/schemas/permissions";
import { StaffPermissionResponse } from "@/types/staff/permission";

export const StaffPermissionApi = {
    get: (staffId: string) =>
        apiGet<StaffPermissionResponse>(
            `/staff/permissions/${staffId}`,
        ).then((r) => r.data.staffPermissions),

    update: (staffId: string, body: StaffPermissionForm) =>
        apiPatch<{ status: "success" }>(
            `/staff/permissions/${staffId}`,
            body,
        ),

    post: (staffId: string, body: StaffPermissionForm) =>
        apiPost<{ status: "success" }>(
            `/staff/permissions/${staffId}`,
            body,
        ),
};