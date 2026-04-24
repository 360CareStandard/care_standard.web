// components/shared/profile-image-field.tsx
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Edit, CloudUpload } from "lucide-react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { SafeguardingFormData } from "@/pages/schemas/safeguarding";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  watch: UseFormWatch<SafeguardingFormData>;
  setValue: UseFormSetValue<SafeguardingFormData>;
  label?: string;
  maxSizeMB?: number;
};

export function EvidenceUploadField({
  watch,
  setValue,
  label = "Evidence Upload",
  maxSizeMB = 5,
}: Props) {
  const file = watch("evidence");

  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = React.useState<string | null>(null);

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
    setValue("evidence", undefined);
    setPreview(null);
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

    setValue("evidence", file, { shouldDirty: true });
  };

  return (
    <div className="grid gap-3 border p-2 rounded-md">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 items-center">
          <Avatar className="h-16 w-16 ring-2 ring-white shadow">
            <AvatarImage src={preview || ""} className="object-cover" />
            <AvatarFallback className="text-base">
              <CloudUpload />
            </AvatarFallback>
          </Avatar>

          <div className="gap-1 flex flex-col">
            <Label className="text-sm font-medium">{label}</Label>
            <p className="text-xs text-muted-foreground">
              JPG, PNG • Max {maxSizeMB}MB
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            className="bg-black hover:bg-black/80"
            onClick={openPicker}
          >
            Upload
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
        accept=".png,.jpg,.jpeg"
        className="hidden"
        onChange={onPick}
      />
    </div>
  );
}
