import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarAltIcon, EditIcon, TrashIcon, UserIcon } from "@/assets/icons";
import { useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Staff } from "@/types/staff";
import { InfoRow } from "../../clients/client/components/info-row";
import AddStaff from "../components/forms/add-staff";

interface Props {
  personal: Staff | undefined;
  isLoading: boolean;
}

const PersonalDetails = ({ personal }: Props) => {
  const [open, setOpen] = useState(false);

  const getInitials = (staff: Staff | undefined) => {
    if (!staff?.user?.firstname && !staff?.user?.lastname) return "CL";
    const first = staff.user.firstname?.[0] ?? "";
    const last = staff.user.lastname?.[0] ?? "";
    return (first + last).toUpperCase();
  };

  const isLoading = !personal;

  return (
    <>
      <div className="space-y-5">
        {/* Profile Photo card */}
        <Card>
          <CardContent className="grid grid-cols-1 items-center sm:grid-cols-2 gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-xl">Profile Photo</h2>
              <p className="text-sm text-muted-foreground">
                This image will be displayed on client’s profile
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={isLoading}
                >
                  <EditIcon />
                  Update
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={isLoading}
                >
                  <TrashIcon />
                  Remove
                </Button>
              </div>
            </div>

            {isLoading ? (
              <Skeleton className="h-36 w-36 rounded-full" />
            ) : (
              <Avatar className="h-36 w-36">
                <AvatarImage alt={personal.user?.firstname} src={""} />
                <AvatarFallback className="text-5xl font-semibold">
                  {getInitials(personal)}
                </AvatarFallback>
              </Avatar>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-xl"> Personal Information</h2>
              <p className="text-sm text-muted-foreground">
                Basic information about this client
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setOpen(true)}
                  disabled={isLoading}
                >
                  <EditIcon />
                  Edit
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="space-y-2 px-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full rounded-md" />
                    ))}
                  </div>
                ) : (
                  <>
                    <InfoRow label="Title" icon={<UserIcon />}>
                      {personal.tittle || "—"}
                    </InfoRow>

                    <InfoRow icon={<UserIcon />} label="First Name">
                      {personal.user?.firstname}
                    </InfoRow>

                    <InfoRow icon={<UserIcon />} label="Last Name">
                      {personal.user?.lastname}
                    </InfoRow>

                    <InfoRow icon={<UserIcon />} label="Preferred Name">
                      {personal.preferredName || "—"}
                    </InfoRow>

                    <InfoRow icon={<UserIcon />} label="Pronouns">
                      {personal.pronouns || "—"}
                    </InfoRow>

                    <InfoRow label="Date of Birth" icon={<CalendarAltIcon />}>
                      {personal.dob ? (
                        <>
                          {format(new Date(personal.dob), "dd MMMM yyyy")}{" "}
                          <span className="text-muted-foreground">
                            (
                            {Math.floor(
                              (Date.now() - new Date(personal.dob).getTime()) /
                                31557600000,
                            )}{" "}
                            years old)
                          </span>
                        </>
                      ) : (
                        "—"
                      )}
                    </InfoRow>
                  </>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      <AddStaff open={open} setOpen={setOpen} />
    </>
  );
};

export default PersonalDetails;
