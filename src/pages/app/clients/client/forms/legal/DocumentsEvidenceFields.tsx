// components/legal/DocumentsEvidenceFields.tsx
import * as React from "react";
import {
  UploadCloud,
  Eye,
  Trash2,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import type { LegalForm } from "../../../schemas/legal-setup";
// import { CircularProgress } from "@/components/ui/circular-progress";

type FileStatus = "done" | "error";
type Item = {
  id: string;
  // either file OR url is present
  file?: File;
  url?: string;
  name: string;
  sizeBytes: number;
  mime?: string;
  createdAt: Date;
  status: FileStatus;
  previewUrl?: string;
};

function bytesToMB(b: number) {
  return `${Math.round((b / (1024 * 1024)) * 10) / 10}MB`;
}
function fmtDate(d: Date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const hh = d.getHours();
  const mm = `${d.getMinutes()}`.padStart(2, "0");
  const ampm = hh >= 12 ? "pm" : "am";
  const h12 = hh % 12 || 12;
  return `${d.getDate()} ${
    months[d.getMonth()]
  }, ${d.getFullYear()} | ${h12}:${mm}${ampm}`;
}

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

export function DocumentsEvidenceFields() {
  const { setValue, getValues, watch } = useFormContext<LegalForm>();

  // watch both arrays: server-provided URLs and client-chosen Files
  const existingUrls = (watch("legalDocuments") as string[] | undefined) ?? [];
  const formFiles = (watch("legalDocumentsFiles") as File[] | undefined) ?? [];

  const [items, setItems] = React.useState<Item[]>([]);
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

    const urlItems: Item[] = (existingUrls || []).map((u) => {
      const name = nameFromUrl(u);
      const mime = mimeFromName(name);
      return {
        id: `url-${u}`,
        url: u,
        name,
        sizeBytes: 0,
        mime,
        createdAt: new Date(),
        status: "done" as FileStatus,
        previewUrl: mime?.startsWith("image/") ? u : undefined,
      };
    });

    const fileItems: Item[] = (formFiles || []).map((f) => ({
      id: `${f.name}-${f.size}-${f.lastModified}`,
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
  }, [existingUrls?.length, formFiles?.length]);

  // choose files from file input
  const onChooseFiles = (files: FileList | null) => {
    if (!files || !files.length) return;
    const incoming = Array.from(files);
    const existing =
      (getValues("legalDocumentsFiles") as File[] | undefined) ?? [];
    const merged = [...incoming, ...existing];
    setValue("legalDocumentsFiles", merged, { shouldDirty: true });
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

    if (it.url) {
      // remove URL from legalDocuments
      const current =
        (getValues("legalDocuments") as string[] | undefined) ?? [];
      const next = current.filter((u) => u !== it.url);
      setValue("legalDocuments", next, { shouldDirty: true });
    } else if (it.file) {
      const current =
        (getValues("legalDocumentsFiles") as File[] | undefined) ?? [];
      const next = current.filter(
        (f) => `${f.name}-${f.size}-${f.lastModified}` !== id
      );
      setValue("legalDocumentsFiles", next, { shouldDirty: true });
    }

    // revoke preview if object URL
    if (it.previewUrl && it.file) {
      URL.revokeObjectURL(it.previewUrl);
    }
  };

  const previewItem = (it: Item) => {
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
        `<pre style="font:14px/1.4 system-ui;padding:20px">Preview not available.\n\n${it.name}</pre>`
      );
  };

  const renderIcon = (it: Item) => {
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

  const border = isOver ? "border-primary/50 bg-primary/5" : "border-dashed";

  return (
    <div className="space-y-6">
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
        <p className="mt-3 text-xs ">
          <span className="font-semibold"> Upload Legal Documents </span>
          <span className=" text-muted-foreground">
            or drag and drop all required files here
          </span>
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          SVG, PNG, JPG, PDF or GIF (max. 25MB per file)
        </p>

        <div className="relative mx-auto my-4 w-32">
          <div className="h-px bg-border" />
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-background px-2 text-[10px] text-muted-foreground">
            OR
          </span>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="px-4 bg-[#262323] hover:bg-[#262323]"
          onClick={() => inputRef.current?.click()}
        >
          Choose Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => onChooseFiles(e.target.files)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-sm font-semibold">Uploaded Files</Label>
        <span className="text-xs bg-[#262323] w-5 h-5 text-white flex justify-center items-center rounded-full">
          {items.length}
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
                <div className="text-sm font-medium leading-5">{it.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {fmtDate(it.createdAt)} • {bytesToMB(it.sizeBytes)}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => previewItem(it)}
                aria-label="Preview"
              >
                <Eye size={24} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(it.id)}
                aria-label="Delete"
              >
                <Trash2 size={24} />
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
    </div>
  );
}
