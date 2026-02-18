import * as React from "react";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormContext, Path, FieldValues } from "react-hook-form";

type Props<TForm extends FieldValues> = {
  fileField: Path<TForm>;
  urlField: Path<TForm>;
  label?: string;
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

  // const preview = () => {
  //   if (previewUrl) {
  //     window.open(previewUrl, "_blank", "noopener,noreferrer");
  //   }
  // };

  // const isImage =
  //   file?.type?.startsWith("image/") ||
  //   url?.match(/\.(png|jpg|jpeg|gif|svg)$/i);
  const border = isOver ? "border-primary/50 bg-primary/5" : "border-dashed";

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}

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
          className={`rounded-xl h-[30vh] flex flex-col items-center justify-center ${border} border border-dashed p-6 text-center`}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5">
            <CloudUpload className="h-6 w-6 text-muted-foreground" />
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
            <div className="h-px bg-border w-full" />
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
        <>
          <div
            className={`rounded-xl h-[30vh] flex flex-col items-center justify-center border border-primary/50 bg-primary-50 border-dashed p-6 text-center`}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              <svg
                width={27}
                height={27}
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.125 26.25C20.3737 26.25 26.25 20.3737 26.25 13.125C26.25 5.87626 20.3737 0 13.125 0C5.87626 0 0 5.87626 0 13.125C0 20.3737 5.87626 26.25 13.125 26.25ZM18.485 11.2838C19.0789 10.7398 19.1194 9.81733 18.5755 9.22337C18.0315 8.62942 17.109 8.58891 16.515 9.13289L11.1308 14.0641L9.73496 12.7858C9.14101 12.2418 8.21853 12.2823 7.67455 12.8763C7.13057 13.4702 7.17109 14.3927 7.76504 14.9367L10.1458 17.1171C10.7032 17.6276 11.5583 17.6276 12.1157 17.1171L18.485 11.2838Z"
                  fill="#0F973D"
                />
              </svg>
            </div>
            <p className="mt-3 text-sm ">
              <span className="font-semibold text-primary truncate w-48 ">
                {file?.name || url?.split("/").pop()}
              </span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Uploaded, {new Date().toDateString()}
            </p>

            <Button
              type="button"
              variant="ghost"
              className="mt-3 text-muted-foreground"
              onClick={remove}
            >
              <svg
                width={12}
                height={18}
                viewBox="0 0 12 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.75009 0C3.4037 0 3.09343 0.214274 2.97076 0.53821L2.77944 1.04344C2.36928 1.00246 1.99139 0.961556 1.68548 0.927207C1.45681 0.901532 1.26883 0.879572 1.13825 0.864061L0.987628 0.845983L0.936472 0.839729C0.479729 0.783177 0.0629643 1.10751 0.00640359 1.56425C-0.0501578 2.021 0.274258 2.43712 0.731007 2.49368L0.786666 2.50049L0.941648 2.51909C1.07527 2.53496 1.26683 2.55734 1.49951 2.58347C1.96448 2.63567 2.59556 2.70307 3.25768 2.7635C4.15083 2.84501 5.12985 2.91667 5.83342 2.91667C6.53699 2.91667 7.51601 2.84501 8.40916 2.7635C9.07128 2.70307 9.70236 2.63567 10.1673 2.58347C10.4 2.55734 10.5916 2.53496 10.7252 2.51909L10.8802 2.50049L10.9357 2.4937C11.3925 2.43714 11.717 2.021 11.6604 1.56425C11.6039 1.10751 11.1878 0.783096 10.731 0.839649L10.6792 0.845983L10.5286 0.864061C10.398 0.879572 10.21 0.901532 9.98136 0.927207C9.67545 0.961556 9.29756 1.00246 8.88741 1.04344L8.69608 0.53821C8.57341 0.214274 8.26314 0 7.91675 0H3.75009Z"
                  fill="#98A2B3"
                />
                <path
                  d="M5.00009 8.33333C5.00009 7.8731 4.62699 7.5 4.16675 7.5C3.70652 7.5 3.33342 7.8731 3.33342 8.33333V12.5C3.33342 12.9602 3.70652 13.3333 4.16675 13.3333C4.62699 13.3333 5.00009 12.9602 5.00009 12.5V8.33333Z"
                  fill="#98A2B3"
                />
                <path
                  d="M7.50009 7.5C7.96032 7.5 8.33342 7.8731 8.33342 8.33333V12.5C8.33342 12.9602 7.96032 13.3333 7.50009 13.3333C7.03985 13.3333 6.66675 12.9602 6.66675 12.5V8.33333C6.66675 7.8731 7.03985 7.5 7.50009 7.5Z"
                  fill="#98A2B3"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.5915 5.25047C11.667 4.19316 10.7554 3.34553 9.7195 3.46525C8.65947 3.58775 7.0237 3.75 5.83342 3.75C4.64314 3.75 3.00737 3.58775 1.94734 3.46525C0.911402 3.34553 -0.00014443 4.19316 0.0753775 5.25046L0.789322 15.2457C0.843442 16.0034 1.4078 16.644 2.18229 16.7605C3.01279 16.8853 4.53671 17.0848 5.83438 17.0833C7.11612 17.0819 8.64623 16.8832 9.48039 16.7595C10.2562 16.6444 10.8234 16.0033 10.8777 15.2434L11.5915 5.25047ZM9.91084 5.1209C9.91373 5.12056 9.91594 5.12076 9.91594 5.12076L9.91815 5.12126C9.92 5.1219 9.9229 5.12342 9.92578 5.12615C9.92768 5.12795 9.92909 5.13015 9.92909 5.13015L9.92903 5.13172L9.21603 15.1138C8.39046 15.2358 6.97553 15.4153 5.83246 15.4167C4.67699 15.418 3.27081 15.2382 2.45093 15.1154L1.73781 5.13172L1.73775 5.13015C1.73775 5.13015 1.73916 5.12795 1.74106 5.12615C1.74394 5.12342 1.74684 5.1219 1.7487 5.12126L1.7509 5.12076C1.7509 5.12076 1.75311 5.12056 1.756 5.1209C2.81791 5.24362 4.53796 5.41667 5.83342 5.41667C7.12888 5.41667 8.84893 5.24362 9.91084 5.1209Z"
                  fill="#98A2B3"
                />
              </svg>
              Clear Upload
            </Button>
          </div>
          {/* <div className="flex items-center justify-between rounded-lg border p-3">
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
        </div> */}
        </>
      )}
    </div>
  );
}
