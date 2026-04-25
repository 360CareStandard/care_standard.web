import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../components/info-row";
import {
  CalendarAltIcon,
  EditIcon,
  StatusIcon,
  UserIcon,
} from "@/assets/icons";
import { Client } from "@/types/client/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  personal: Client | undefined;
  isLoading: boolean;
  openSheet: () => void;
}

const PersonalDetails = ({ personal, openSheet }: Props) => {
  const getInitials = (client: Client | undefined) => {
    if (!client?.firstname && !client?.lastname) return "CL";
    const first = client.firstname?.[0] ?? "";
    const last = client.lastname?.[0] ?? "";
    return (first + last).toUpperCase();
  };

  const isLoading = !personal;

  return (
    <>
      <div className="space-y-5">
        {/* Profile Photo card */}
        <Card className="shadow-none">
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
                  onClick={openSheet}
                >
                  <EditIcon />
                  Update
                </Button>
                {/* <Button
                  variant="outline"
                  className="gap-2"
                  disabled={isLoading}
                >
                  <TrashIcon />
                  Remove
                </Button> */}
              </div>
            </div>

            {isLoading ? (
              <Skeleton className="h-36 w-36 rounded-full" />
            ) : (
              <Avatar className="h-36 w-36">
                <AvatarImage
                  alt={personal.firstname}
                  src={personal.imageUrl ?? ""}
                  className="object-cover"
                />
                <AvatarFallback className="text-5xl font-semibold">
                  {getInitials(personal)}
                </AvatarFallback>
              </Avatar>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
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
                  onClick={openSheet}
                  disabled={isLoading}
                >
                  <EditIcon />
                  Edit
                </Button>
              </div>
            </div>

            <Card className="shadow-none">
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
                      {personal.title}
                    </InfoRow>

                    <InfoRow icon={<UserIcon />} label="First Name">
                      {personal.firstname}
                    </InfoRow>

                    <InfoRow icon={<UserIcon />} label="Last Name">
                      {personal.lastname}
                    </InfoRow>

                    <InfoRow icon={<UserIcon />} label="Preferred Name">
                      {personal.preferredname || "—"}
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

                    <InfoRow label="Status" icon={<StatusIcon />}>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs capitalize",
                          personal.status === "active" && " text-primary",
                          personal.status === "paused" && " text-destructive",
                          personal.status === "inactive" && " text-neutral-700",
                        )}
                      >
                        {personal.status ?? "—"}
                      </span>
                    </InfoRow>
                  </>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PersonalDetails;
