// components/shared/profile-image-field.tsx
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash, Edit } from "lucide-react";
import type { UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { ClientFormData } from "../schemas/add-client";

type Props = {
  setValue: UseFormSetValue<ClientFormData>;
  initials: string;
  label?: string;
  maxSizeMB?: number;
};

export function ProfileImageField({
  setValue,
  initials,
  label = "Profile Image",
  maxSizeMB = 5,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = React.useState<string | null>(null);
  const openPicker = () => fileRef.current?.click();
  const onRemove = () => {
    setValue("profileImage", "");
    setPreview(null);
  };

  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Please choose an image under ${maxSizeMB}MB.`);
      e.currentTarget.value = "";
      return;
    }

    setValue("profileImage", file, { shouldDirty: true });

    // create preview only
    const preview = URL.createObjectURL(file);
    setPreview(preview);
  };

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 items-center">
          <Avatar className="h-16 w-16 ring-2 ring-white shadow">
            <AvatarImage src={preview || ""} className="object-cover" />
            <AvatarFallback className="text-base">{initials}</AvatarFallback>
          </Avatar>

          <div className="gap-1 flex flex-col">
            <Label className="text-sm font-medium">{label}</Label>
            <p className="text-xs text-muted-foreground">
              JPG, PNG • Max {maxSizeMB}MB
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={openPicker}>
            <Edit className="mr-2 h-4 w-4" /> Upload
          </Button>
          {preview && (
            <Button type="button" variant="outline" onClick={onRemove}>
              <Trash className="mr-2 h-4 w-4" /> Remove
            </Button>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPick}
      />
    </div>
  );
}
