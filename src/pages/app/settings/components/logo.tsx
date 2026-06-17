import { Spinner } from "@/components/shared/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AgencyLogoFormData } from "@/pages/schemas/agency";
import { Trash } from "iconsax-react";
import { UploadCloud } from "lucide-react";
import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
  logourl: string;
  isLoading: boolean;
  isUpdating: boolean;
  maxSizeMB?: number;
  onFormSubmit: React.FormEventHandler<HTMLFormElement>;
  removeServerLogo: boolean;
  setRemoveServerLogo: React.Dispatch<React.SetStateAction<boolean>>;
};
const AgencyLogoForm = ({
  isUpdating,
  isLoading,
  maxSizeMB = 5,
  onFormSubmit,
  logourl,
  removeServerLogo,
  setRemoveServerLogo,
}: Props) => {
  const { watch, setValue } = useFormContext<AgencyLogoFormData>();
  const file = watch("logo");

  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  //   const { handleSubmit } = useFormContext();

  React.useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [file]);

  const openPicker = () => fileRef.current?.click();
  const onRemove = () => {
    setValue("logo", undefined as any, { shouldDirty: true });
    setPreview(null);
    setRemoveServerLogo(true);
  };
  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/png", "image/jpeg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG and JPG images are allowed");
      e.target.value = ""; // reset input
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Please choose an image under ${maxSizeMB}MB.`);
      e.currentTarget.value = "";
      return;
    }

    setValue("logo", file, { shouldDirty: true });
  };
  const hasServerLogo = !!logourl && !removeServerLogo;
  const displayImage = preview || (hasServerLogo ? logourl : "");
  return (
    <form onSubmit={onFormSubmit}>
      <Card>
        <CardContent className="flex justify-between items-center ">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl">Agency Logo</h2>
            <p className="text-sm max-w-md text-muted-foreground">
              View and update your agency logo. Your logo will be visible on
              client documents.
            </p>
            <div className="flex flex-wrap gap-2">
              {!logourl ? (
                <Button type="submit" variant="default" className="gap-2">
                  {isLoading ? <Spinner /> : "Submit Logo"}
                </Button>
              ) : (
                <div className=" flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={openPicker}
                  >
                    Change
                  </Button>

                  {(preview || removeServerLogo) && (
                    <Button type="submit" variant="default">
                      {isUpdating || isLoading ? <Spinner /> : "Save"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <Avatar className="h-44 w-72 ring-2 ring-white shadow !rounded-lg">
              <AvatarImage src={displayImage} className="object-cover" />
              <AvatarFallback className="text-base !rounded-lg">
                Agency Logo
              </AvatarFallback>
            </Avatar>
            {preview && (
              <p className="text-xs text-yellow-600 mt-2 text-center">
                You have unsaved changes
              </p>
            )}

            {(preview || hasServerLogo) && (
              <Button
                className="absolute top-1 right-1"
                type="button"
                size="icon"
                variant="destructive"
                onClick={onRemove}
              >
                <Trash className="h-4 w-4 text-white" />
              </Button>
            )}

            <Button
              type="button"
              variant="secondary"
              className="absolute top-2 left-2"
              onClick={openPicker}
            >
              <UploadCloud />
              Change
            </Button>
          </div>

          {/* {isLoading ? (
              <Skeleton className="h-36 w-36 rounded-full" />
            ) : (
              <Avatar className="h-36 w-36">
                <AvatarImage
                  alt={personal.user?.firstname}
                  src={personal.profilePicture ?? ""}
                  className="object-cover"
                />
                <AvatarFallback className="text-5xl font-semibold">
                  {getInitials(personal)}
                </AvatarFallback>
              </Avatar>
            )} */}
        </CardContent>
        <input
          ref={fileRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          className="hidden"
          onChange={onPick}
        />
      </Card>
    </form>
  );
};

export default AgencyLogoForm;
