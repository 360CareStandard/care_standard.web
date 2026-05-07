// components/legal/DocumentsEvidenceFields.tsx
import * as React from "react";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { AgencyDocumentFormData } from "@/pages/schemas/agency";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/shared/spinner";
import { DocumentItem, FileStatus } from "@/types/agency/setting";
import { Trash } from "iconsax-react";
// import { CircularProgress } from "@/components/ui/circular-progress";

function bytesToMB(b: number) {
  return `${Math.round((b / (1024 * 1024)) * 10) / 10}MB`;
}
// function fmtDate(d: Date) {
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   const hh = d.getHours();
//   const mm = `${d.getMinutes()}`.padStart(2, "0");
//   const ampm = hh >= 12 ? "pm" : "am";
//   const h12 = hh % 12 || 12;
//   return `${d.getDate()} ${
//     months[d.getMonth()]
//   }, ${d.getFullYear()} | ${h12}:${mm}${ampm}`;
// }

/**
 * Helper to guess filename from a URL
 */
function nameFromUrl(url: string) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    return decodeURIComponent(parts[parts.length - 1] || url);
  } catch {
    // fallback
    const parts = url.split("/");
    return decodeURIComponent(parts[parts.length - 1] || url);
  }
}

/**
 * Try to detect mime from file or url extension
 */
function mimeFromName(name?: string, fileType?: string) {
  if (fileType) return fileType;
  if (!name) return undefined;
  const n = name.toLowerCase();
  if (n.endsWith(".pdf")) return "application/pdf";
  if (n.match(/\.(png|jpg|jpeg|gif|svg)$/))
    return "image/" + (n.split(".").pop() || "");
  return undefined;
}

export function AgencyDocumentsUpload({
  isUploading,

  onDelete,
}: {
  isUploading: boolean;
  onDelete: (doc: DocumentItem) => void;
}) {
  const { setValue, getValues, watch } =
    useFormContext<AgencyDocumentFormData>();

  // watch both arrays: server-provided URLs and client-chosen Files
  const existingUrls = watch("existingDocuments") ?? [];
  const formFiles = watch("documents") ?? [];

  const [items, setItems] = React.useState<DocumentItem[]>([]);
  const [isOver, setIsOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Build items list when either existingUrls or formFiles change
  React.useEffect(() => {
    // revoke previous previews that are object URLs and not present in new set
    items.forEach((it) => {
      if (it.previewUrl && it.file) {
        URL.revokeObjectURL(it.previewUrl);
      }
    });
    const existingDocs = watch("existingDocuments") ?? [];
    const urlItems: DocumentItem[] = existingDocs.map((doc) => {
      const name = doc.filename || nameFromUrl(doc.url);
      const mime = doc.type || mimeFromName(name);

      return {
        id: doc.id,
        url: doc.url,
        source: "server", // 👈
        name,
        sizeBytes: doc.size ?? 0,
        mime,
        createdAt: new Date(),
        status: "done",
        previewUrl: mime?.startsWith("image/") ? doc.url : undefined,
      };
    });

    const fileItems: DocumentItem[] = (formFiles || []).map((f) => ({
      id: `${f.name}-${f.size}-${f.lastModified}`,
      source: "local", // 👈
      file: f,
      name: f.name,
      sizeBytes: f.size,
      mime: f.type || mimeFromName(f.name),
      createdAt: new Date(f.lastModified || Date.now()),
      status: "done" as FileStatus,
      previewUrl: f.type?.startsWith("image/")
        ? URL.createObjectURL(f)
        : undefined,
    }));

    setItems([...urlItems, ...fileItems]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingUrls, formFiles]);

  // choose files from file input
  const onChooseFiles = (files: FileList | null) => {
    if (!files || !files.length) return;
    const incoming = Array.from(files);
    const existing = (getValues("documents") as File[] | undefined) ?? [];
    const merged = [...incoming, ...existing];
    setValue("documents", merged, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    onChooseFiles(e.dataTransfer.files);
  };

  // remove item by id — detect whether it's a URL or File and update the proper form field
  const removeItem = (id: string) => {
    const it = items.find((x) => x.id === id);
    if (!it) return;

    if (it.file) {
      const current = getValues("documents") ?? [];
      const next = current.filter(
        (f) => `${f.name}-${f.size}-${f.lastModified}` !== id,
      );
      setValue("documents", next, { shouldDirty: true });
    }

    if (it.url) {
      const current = getValues("existingDocuments") ?? [];
      const next = current.filter((u) => `url-${u}` !== id);
      setValue("existingDocuments", next, { shouldDirty: true });
    }

    if (it.previewUrl && it.file) {
      URL.revokeObjectURL(it.previewUrl);
    }
  };

  const previewItem = (it: DocumentItem) => {
    if (it.previewUrl) {
      window.open(it.previewUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (it.url) {
      window.open(it.url, "_blank", "noopener,noreferrer");
      return;
    }
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (w)
      w.document.write(
        `<pre style="font:14px/1.4 system-ui;padding:20px">Preview not available.\n\n${it.name}</pre>`,
      );
  };

  const renderIcon = (it: DocumentItem) => {
    if (it.status === "error")
      return <AlertTriangle className="h-5 w-5 text-red-500" />;

    const mime = it.mime ?? mimeFromName(it.name);

    if (
      (mime && mime.includes("pdf")) ||
      it.name.toLowerCase().endsWith(".pdf")
    )
      return <FileText className="h-5 w-5 text-muted-foreground" />;

    if (
      (mime && mime.startsWith("image/")) ||
      /\.(png|jpg|jpeg|gif|svg)$/i.test(it.name)
    )
      return <ImageIcon className="h-5 w-5 text-muted-foreground" />;

    return <FileText className="h-5 w-5 text-muted-foreground" />;
  };

  const border = isOver
    ? "border-primary/50 bg-primary/5"
    : "border-dashed border-primary";

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl">
              Upload documents for signature
            </h2>
            <p className="text-sm max-w-md text-muted-foreground">
              Upload agency standard PDF documents to make them available to all
              your clients for signature.
            </p>
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
              className={`rounded-2xl ${border} border p-8 text-center documents-uploader`}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5">
                <UploadCloud className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm ">
                <span className="font-semibold">
                  {" "}
                  Drag and drop all required files here{" "}
                </span>
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                PDF file. Max size 12MB
              </p>

              <div className="relative mx-auto my-4 w-32">
                <div className="h-px bg-border" />
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-background px-2 text-[10px] text-muted-foreground">
                  OR
                </span>
              </div>

              <Button
                type="button"
                className="px-4 "
                onClick={() => inputRef.current?.click()}
              >
                Choose Files (PDF)
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple
                className="hidden"
                onChange={(e) => onChooseFiles(e.target.files)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-base font-medium">Documents</Label>
            <span className="text-xs bg-primary/10 px-2 py-0.5 text-primary flex justify-center items-center rounded-full">
              {items.length} document{items.length > 1 && "s"} uploaded
            </span>
          </div>

          <div className="space-y-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-start justify-between py-2 bg-background"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{renderIcon(it)}</div>
                  <div>
                    <div className="text-sm font-medium leading-5">
                      {it.name}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {/* {fmtDate(it.createdAt)} • */}
                      {it.source === "local" && (
                        <span className="text-xs text-yellow-600">Pending</span>
                      )}
                      {it.source === "server" && (
                        <span className="text-xs text-green-600">Uploaded</span>
                      )}{" "}
                      • {bytesToMB(it.sizeBytes)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  {it.source === "local" && isUploading && (
                    <span className="text-xs text-muted-foreground">
                      <Spinner />
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => previewItem(it)}
                    aria-label="Preview"
                  >
                    <Download size={34} />
                  </Button>
                  {it.source === "local" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(it.id)}
                    >
                      <Trash size={24} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:bg-red-100 ml-2"
                    size="icon"
                    onClick={() => onDelete(it)}
                    aria-label="Delete"
                  >
                    <Trash size={24} />
                  </Button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-xs text-muted-foreground">
                No files staged for upload yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
