import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Camera,
  Trash2,
  CalendarDays,
  ShieldCheck,
  User,
  Edit,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../components/info-row";

interface Props {
  personal: {
    title: string;
    firstName: string;
    lastName: string;
    preferredName: string;
    pronouns: string;
    dateOfBirth: string;
    status: string;
    name: string;
    avatarUrl: string;
    avatarFallback: string;
  };
}
const PersonalDetails = ({ personal }: Props) => {
  return (
    <>
      <div className=" space-y-5">
        {/* Profile Photo card */}
        <Card>
          <CardContent className="grid grid-cols-1 items-center sm:grid-cols-2 gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-xl">Profile Photo</h2>
              <p className=" text-sm text-muted-foreground">
                This image will be displayed on client’s profile
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2">
                  <Camera size={17.65} />
                  Update
                </Button>
                <Button variant="outline" className="gap-2">
                  <Trash2 size={17.65} />
                  Remove
                </Button>
              </div>
            </div>

            <Avatar className="h-36 w-36">
              <AvatarImage alt={personal.name} src={personal.avatarUrl} />
              <AvatarFallback>{personal.avatarFallback}</AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid grid-cols-1  sm:grid-cols-2 gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-xl"> Personal Information</h2>
              <p className=" text-sm text-muted-foreground">
                Basic information about this client
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="gap-2">
                  <Edit size={17.65} />
                  Edit
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <InfoRow label="Title" icon={<User size={17.65} />}>
                  {personal.title}
                </InfoRow>

                <InfoRow icon={<User size={17.65} />} label="First Name">
                  {personal.firstName}
                </InfoRow>

                <InfoRow icon={<User size={17.65} />} label="Last Name">
                  {personal.lastName}
                </InfoRow>

                <InfoRow icon={<User size={17.65} />} label="Preferred Name">
                  {personal.preferredName || "—"}
                </InfoRow>

                <InfoRow icon={<User size={17.65} />} label="Pronouns">
                  {personal.pronouns || "—"}
                </InfoRow>

                <InfoRow
                  label="Date of Birth"
                  icon={<CalendarDays size={17.65} />}
                >
                  {personal.dateOfBirth || "—"}
                </InfoRow>

                <InfoRow label="Status" icon={<ShieldCheck size={17.65} />}>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      personal.status === "Active" && " text-primary",
                      personal.status === "Paused" && " text-destructive",
                      personal.status === "Inactive" && " text-neutral-700"
                    )}
                  >
                    {personal.status ?? "—"}
                  </span>
                </InfoRow>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PersonalDetails;
