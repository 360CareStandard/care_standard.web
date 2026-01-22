import * as React from "react";
import { Eye, Trash2, UploadCloud, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormContext, Path, FieldValues } from "react-hook-form";

type Props<TForm extends FieldValues> = {
  fileField: Path<TForm>;
  urlField: Path<TForm>;
  label: string;
};

export function SingleDocumentUploader<TForm extends FieldValues>({
  fileField,
  urlField,
  label,
}: Props<TForm>) {
  const { watch, setValue } = useFormContext<TForm>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isOver, setIsOver] = React.useState(false);
  const file = watch(fileField) as File | undefined;
  const url = watch(urlField) as string | undefined;

  const previewUrl = React.useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return url;
  }, [file, url]);

  React.useEffect(() => {
    return () => {
      if (file && previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [file, previewUrl]);

  const onChoose = (files: FileList | null) => {
    if (!files?.[0]) return;

    setValue(fileField, files[0] as any, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue(urlField, undefined as any, { shouldDirty: true });
    inputRef.current!.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    onChoose(e.dataTransfer.files);
  };
  const remove = () => {
    setValue(fileField, undefined as any, { shouldDirty: true });
    setValue(urlField, undefined as any, { shouldDirty: true });
  };

  const preview = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    }
  };

  const isImage =
    file?.type?.startsWith("image/") ||
    url?.match(/\.(png|jpg|jpeg|gif|svg)$/i);
  const border = isOver ? "border-primary/50 bg-primary/5" : "border-dashed";

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {!file && !url ? (
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            setIsOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsOver(false);
          }}
          onDrop={onDrop}
          className={`rounded-xl ${border} border border-dashed p-6 text-center`}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5">
            <UploadCloud className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-3 text-sm ">
            <span className="font-semibold text-primary">
              {" "}
              Click to upload{" "}
            </span>
            <span className=" text-muted-foreground">or drag and drop</span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            PNG, JPG, PDF (max. 2MB )
          </p>

          <div className="relative mx-auto my-4 ">
            <div className="h-px bg-border" />
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-background px-2 text-[10px] text-muted-foreground">
              OR
            </span>
          </div>
          <Button
            type="button"
            className="mt-3"
            onClick={() => inputRef.current?.click()}
          >
            Browse File
          </Button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => onChoose(e.target.files)}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            {isImage ? <Image /> : <FileText />}
            <span className="text-sm truncate w-48">
              {file?.name || url?.split("/").pop()}
            </span>
          </div>

          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={preview}>
              <Eye />
            </Button>
            <Button variant="ghost" size="icon" onClick={remove}>
              <Trash2 />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
