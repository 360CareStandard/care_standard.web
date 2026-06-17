import React from "react";
import { FormProvider, useForm, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  Check,
  Info,
  Monitor,
  Shield,
  // Smartphone,
  UserCog,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

import {
  useCreateStaffPermission,
  useStaffPermission,
  useUpdateStaffPermission,
} from "@/hooks/staff/useStaffPermission";

import {
  StaffPermissionSchema,
  StaffPermissionForm,
} from "../schemas/permissions";

type RoleCardProps = {
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
};

function RoleCard({ title, description, selected, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border p-4 text-left transition",
        selected
          ? "border-[#027A48] bg-[#ECFDF3] shadow-sm"
          : "border-border bg-white hover:bg-muted/30",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <div
          className={cn(
            "mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border",
            selected
              ? "border-[#027A48] bg-[#027A48]"
              : "border-muted-foreground/30 bg-transparent",
          )}
        >
          {selected && <Check size={10} color="#fff" />}
        </div>
      </div>
    </button>
  );
}

type AccessRowProps = {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (value: boolean) => void;
};

function AccessRow({
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: AccessRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

type StatusPillProps = {
  label: "Active" | "Inactive" | "Terminated";
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

function StatusPill({ label, active, disabled, onClick }: StatusPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium transition",
        active
          ? "border-[#027A48] bg-[#ECFDF3] text-[#027A48]"
          : "border-border bg-white text-muted-foreground hover:bg-muted/30",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {label}
    </button>
  );
}

const defaultValues: StaffPermissionForm = {
  staffRole: "StaffAdmin",
  adminAccessLevel: true,
  platformAccess: true,
  mobileAppAccess: true,
  status: "Active",
};

const StaffPermission = () => {
  const { staffId = "" } = useParams<{ staffId: string }>();

  const createStaffPermissions = useCreateStaffPermission(staffId);
  const updateStaffPermissions = useUpdateStaffPermission(staffId);
  const { data: staffPermissions, isLoading } = useStaffPermission(staffId);

  const methods = useForm<StaffPermissionForm>({
    resolver: zodResolver(
      StaffPermissionSchema,
    ) as Resolver<StaffPermissionForm>,
    mode: "onChange",
    defaultValues,
  });

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = methods;

  const values = useWatch({ control });

  const [reducePrivilegeOpen, setReducePrivilegeOpen] = React.useState(false);
  const [deactivateOpen, setDeactivateOpen] = React.useState(false);

  React.useEffect(() => {
    if (!staffPermissions) return;

    reset({
      staffRole: staffPermissions.roles[0].name ?? defaultValues.staffRole,
      adminAccessLevel:
        staffPermissions.adminAccessLevel ?? defaultValues.adminAccessLevel,
      platformAccess:
        staffPermissions.platformAccess ?? defaultValues.platformAccess,
      mobileAppAccess:
        staffPermissions.mobileAppAccess ?? defaultValues.mobileAppAccess,
      status: staffPermissions.status ?? defaultValues.status,
    });
  }, [staffPermissions, reset]);

  const applyRoleState = React.useCallback(
    (role: "Carer" | "StaffAdmin") => {
      if (role === "Carer") {
        setValue("staffRole", "Carer", {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue("adminAccessLevel", false, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue("platformAccess", false, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue("mobileAppAccess", true, {
          shouldDirty: true,
          shouldValidate: true,
        });
        return;
      }

      setValue("staffRole", "StaffAdmin", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("adminAccessLevel", true, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("platformAccess", true, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("mobileAppAccess", true, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const handleSelectCarer = () => {
    const current = getValues();

    if (current.staffRole === "StaffAdmin" || current.adminAccessLevel) {
      setReducePrivilegeOpen(true);
      return;
    }

    applyRoleState("Carer");
  };

  const handleSelectAdmin = () => {
    applyRoleState("StaffAdmin");
  };

  const handleConfirmReducePrivileges = () => {
    applyRoleState("Carer");
    setReducePrivilegeOpen(false);
  };

  const handlePlatformAccessChange = (checked: boolean) => {
    if (!values.adminAccessLevel && checked) return;
    setValue("platformAccess", checked, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleMobileAccessChange = (checked: boolean) => {
    setValue("mobileAppAccess", checked, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleStatusChange = (status: "Active" | "Inactive" | "Terminated") => {
    if (status === "Inactive" && values.status !== "Inactive") {
      setDeactivateOpen(true);
      return;
    }

    setValue("status", status, { shouldDirty: true, shouldValidate: true });
  };

  const handleConfirmDeactivate = () => {
    setValue("status", "Inactive", { shouldDirty: true, shouldValidate: true });
    setValue("platformAccess", false, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("mobileAppAccess", false, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setDeactivateOpen(false);
  };

  const onSubmit = async (data: StaffPermissionForm) => {
    try {
      const hasExistingPermissions = !!staffPermissions;

      if (hasExistingPermissions) {
        await updateStaffPermissions.mutateAsync(data);
      } else {
        await createStaffPermissions.mutateAsync(data);
      }

      reset(data);
    } catch (error) {
      console.error("Failed to save staff permissions:", error);
    }
  };

  const isSaving =
    isSubmitting ||
    createStaffPermissions.isPending ||
    updateStaffPermissions.isPending;

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[933px] space-y-5"
        >
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Permissions
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage this staff member&apos;s system access and responsibilities
            </p>
          </div>

          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-start gap-2">
                <span className="rounded-md bg-primary-accent p-2">
                  <UserCog size={18} className="text-primary" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">Role Assignment</h3>
                  <p className="text-sm text-muted-foreground">
                    Select one or more roles that define this staff
                    member&apos;s responsibilities
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <RoleCard
                  title="Carer"
                  description="Frontline care delivery via mobile app"
                  selected={values.staffRole === "Carer"}
                  onClick={handleSelectCarer}
                />

                <RoleCard
                  title="Admin"
                  description="Manages schedules, assignments and oversees care quality"
                  selected={values.staffRole === "StaffAdmin"}
                  onClick={handleSelectAdmin}
                />
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-[#B2DDFF] bg-[#EFF8FF] px-3 py-2.5 text-xs text-[#175CD3]">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Carers have mobile app access only. Web admin access requires
                  Admin role.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-start gap-2">
                <span className="rounded-md bg-primary-accent p-2">
                  <Shield size={18} className="text-primary" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">Platform Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Control which platforms this staff member can access
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <AccessRow
                title="Web Admin Access"
                description="Access to the web-based admin platform for managing clients, schedules, and staff"
                checked={values.platformAccess ?? false}
                disabled={
                  !values.adminAccessLevel || values.status !== "Active"
                }
                onCheckedChange={handlePlatformAccessChange}
              />

              <Separator />

              <AccessRow
                title="Mobile App Access"
                description="Access to the mobile app for visit logging, care notes, and communication"
                checked={values.mobileAppAccess ?? false}
                disabled={values.status !== "Active"}
                onCheckedChange={handleMobileAccessChange}
              />
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-start gap-2">
                <span className="rounded-md bg-primary-accent p-2">
                  <Monitor size={18} className="text-primary" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">Account Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Control whether this staff account is active and can access
                    the system
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Current Status
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill
                    label="Active"
                    active={values.status === "Active"}
                    onClick={() => handleStatusChange("Active")}
                  />
                  <StatusPill
                    label="Inactive"
                    active={values.status === "Inactive"}
                    onClick={() => handleStatusChange("Inactive")}
                  />
                  <StatusPill
                    label="Terminated"
                    active={values.status === "Terminated"}
                    disabled
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {values.status === "Active"
                  ? "This staff member can access all enabled platforms"
                  : "This staff member cannot access the system while inactive"}
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || isSaving || !isDirty}>
              {isSaving ? "Saving..." : "Save Permissions"}
            </Button>
          </div>
        </form>
      </FormProvider>

      <ConfirmDialog
        open={reducePrivilegeOpen}
        onOpenChange={setReducePrivilegeOpen}
        handleConfirm={handleConfirmReducePrivileges}
        title={
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-sm">Reduce Privileges?</span>
          </div>
        }
        desc={
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This change will reduce this staff member&apos;s system
              privileges.
            </p>

            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Some capabilities may be automatically disabled</li>
              <li>Access to certain features will be restricted</li>
              <li>This may affect current responsibilities</li>
            </ul>

            <div className="rounded-lg border border-[#FEC84B] bg-[#FFFAEB] px-3 py-2 text-sm text-[#B54708]">
              Make sure this staff member is aware of the change in their access
              level.
            </div>
          </div>
        }
        cancelBtnText="Cancel"
        confirmText="Confirm Change"
        destructive
      />

      <ConfirmDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        handleConfirm={handleConfirmDeactivate}
        title={
          <div className="flex items-center gap-2">
            {/* <Smartphone className="h-4 w-4 text-orange-500" /> */}
            <span className="text-sm">Deactivate Account?</span>
          </div>
        }
        desc={
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You&apos;re about to deactivate this staff member&apos;s account.
              This will:
            </p>

            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Immediately revoke all login access</li>
              <li>Disable web admin and mobile app access</li>
              <li>Keep all historical data and records intact</li>
              <li>Allow reactivation at any time</li>
            </ul>

            <div className="flex items-start gap-2 rounded-md border border-[#B2DDFF] bg-[#EFF8FF] px-3 py-2 text-sm text-[#175CD3]">
              <Info size={14} color="#111" /> This is temporary. You can
              reactivate this account later if needed.
            </div>
          </div>
        }
        cancelBtnText="Cancel"
        confirmText="Deactivate Account"
        destructive
      />
    </>
  );
};

export default StaffPermission;
