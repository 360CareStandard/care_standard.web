import React from "react";
import { Mail, Phone, MapPin, UserRound } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useAgency } from "@/hooks/agency";
import { AgencyDetail } from "@/types/agency";

interface AgencyDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agencyId?: string;
}

export default function AgencyDetails({
  open,
  onOpenChange,
  agencyId,
}: AgencyDetailsProps) {
  const { data, isLoading, isError } = useAgency(agencyId ?? "");

  const agency = data?.agency as AgencyDetail | undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh]  max-w-3xl!  overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          ) : agency ? (
            <div className="flex items-center justify-between pr-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                  {agency ? (
                    <img
                      src={agency.logo ?? ""}
                      alt={agency.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-muted-foreground">
                      {/* {agency?.name.charAt(0).toUpperCase()} */}-
                    </span>
                  )}
                </div>

                <div>
                  <DialogTitle className="text-xl">{agency.name}</DialogTitle>

                  <DialogDescription className="mt-1 flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {agency.country}
                  </DialogDescription>
                </div>
              </div>

              <Badge
                variant={agency.status === "active" ? "default" : "secondary"}
              >
                {agency.status}
              </Badge>
            </div>
          ) : (
            <DialogTitle>Agency Details</DialogTitle>
          )}
        </DialogHeader>

        <div className="max-h-[calc(90vh-100px)] overflow-y-auto px-6 py-6">
          {isLoading && <AgencyDetailsSkeleton />}

          {isError && (
            <div className="flex min-h-[300px] items-center justify-center text-sm text-muted-foreground">
              Failed to load agency details.
            </div>
          )}

          {agency && !isLoading && (
            <div className="space-y-8">
              {/* Agency Information */}
              <section>
                <SectionTitle>Agency Information</SectionTitle>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoItem label="Legal Name" value={agency.legalName} />

                  <InfoItem label="Trading Name" value={agency.tradingName} />

                  <InfoItem label="Country" value={agency.country} />

                  <InfoItem
                    label="Created"
                    value={formatDate(agency.createdAt)}
                  />

                  <InfoItem
                    label="Last Updated"
                    value={formatDate(agency.updatedAt)}
                  />
                </div>
              </section>

              <Separator />

              {/* Owner */}
              <section>
                <SectionTitle>Agency Owner</SectionTitle>

                <div className="rounded-xl border bg-muted/30 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <UserRound className="h-5 w-5 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{agency.owner.name}</h3>

                      <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-5">
                        <span className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {agency.owner.email}
                        </span>

                        <span className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {agency.owner.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Statistics */}
              <section>
                <SectionTitle>Overview</SectionTitle>

                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard
                    label="Members"
                    value={agency.stats.members.total}
                  />

                  <StatCard label="Staff" value={agency.stats.staff.total} />

                  <StatCard
                    label="Clients"
                    value={agency.stats.clients.total}
                  />
                </div>
              </section>

              <Separator />

              {/* Members */}
              <section>
                <SectionTitle>Members ({agency.members.length})</SectionTitle>

                {agency.members.length === 0 ? (
                  <EmptyState text="No members found." />
                ) : (
                  <div className="overflow-hidden rounded-xl border">
                    <div className="divide-y">
                      {agency.members.map((member) => (
                        <div
                          key={member.membershipId}
                          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                              {member.user.firstname.charAt(0).toUpperCase()}
                            </div>

                            <div>
                              <p className="font-medium">{member.user.name}</p>

                              <p className="text-sm text-muted-foreground">
                                {member.user.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex flex-wrap gap-1">
                              {member.roles.map((role) => (
                                <Badge key={role} variant="outline">
                                  {role}
                                </Badge>
                              ))}
                            </div>

                            <Badge
                              variant={
                                member.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {member.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <Separator />

              {/* Settings */}
              <section>
                <SectionTitle>Settings</SectionTitle>

                <div className="rounded-xl border bg-muted/20 p-4">
                  {Object.keys(agency.settings ?? {}).length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No settings configured.
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Object.entries(agency.settings ?? {}).map(
                        ([key, value]) => (
                          <InfoItem
                            key={key}
                            label={formatLabel(key)}
                            value={String(value)}
                          />
                        ),
                      )}
                    </div>
                  )}
                </div>
              </section>

              <Separator />

              {/* Documents */}
              <section>
                <SectionTitle>
                  Documents ({agency.documents.length})
                </SectionTitle>

                {agency.documents.length === 0 ? (
                  <EmptyState text="No documents uploaded." />
                ) : (
                  <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                      Agency documents are available.
                    </p>
                  </div>
                )}
              </section>

              <Separator />

              {/* Status History */}
              <section>
                <SectionTitle>
                  Status History ({agency.statusHistory.length})
                </SectionTitle>

                {agency.statusHistory.length === 0 ? (
                  <EmptyState text="No status history available." />
                ) : (
                  <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                      Status history is available.
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-base font-semibold">{children}</h3>;
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function AgencyDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>

      <Separator />

      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />

        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}
