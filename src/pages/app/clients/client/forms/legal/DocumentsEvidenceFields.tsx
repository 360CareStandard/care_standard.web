// components/legal/DocumentsEvidenceFields.tsx
import * as React from "react";
import {
  UploadCloud,
  Eye,
  Trash2,
  X,
  RotateCcw,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CircularProgress } from "@/components/ui/circular-progress";

type FileStatus = "uploading" | "done" | "error";
type Item = {
  id: string;
  name: string;
  sizeBytes: number;
  mime?: string;
  createdAt: Date;
  status: FileStatus;
  progress: number; // 0..100
  error?: string;
  previewUrl?: string;
};

function bytesToMB(b: number) {
  return `${(b / (1024 * 1024)).toFixed(0)}MB`;
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

export function DocumentsEvidenceFields() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [isOver, setIsOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // --- Demo seed to match your screenshot (runs once)
  React.useEffect(() => {
    const seed: Item[] = [
      {
        id: crypto.randomUUID(),
        name: "Name of document.pdf",
        sizeBytes: 13 * 1024 * 1024,
        mime: "application/pdf",
        createdAt: new Date("2025-09-11T12:24:00"),
        status: "error",
        progress: 0,
        error: "Error message",
      },
      {
        id: crypto.randomUUID(),
        name: "Name of document.pdf",
        sizeBytes: 13 * 1024 * 1024,
        mime: "application/pdf",
        createdAt: new Date("2025-09-11T12:24:00"),
        status: "uploading",
        progress: 25,
      },
      {
        id: crypto.randomUUID(),
        name: "Name of document.png",
        sizeBytes: 13 * 1024 * 1024,
        mime: "image/png",
        createdAt: new Date("2025-09-11T12:24:00"),
        status: "done",
        progress: 100,
      },
      {
        id: crypto.randomUUID(),
        name: "Name of document.png",
        sizeBytes: 13 * 1024 * 1024,
        mime: "image/png",
        createdAt: new Date("2025-09-11T12:24:00"),
        status: "done",
        progress: 100,
      },
    ];
    setItems(seed);
  }, []);

  // Simulate upload for a specific item
  const simulateUpload = React.useCallback((id: string) => {
    setItems((s) =>
      s.map((it) =>
        it.id === id
          ? { ...it, status: "uploading", progress: 0, error: undefined }
          : it
      )
    );
    const tick = () => {
      setItems((prev) =>
        prev.map((it) => {
          if (it.id !== id || it.status !== "uploading") return it;
          const next = Math.min(
            100,
            it.progress + Math.floor(8 + Math.random() * 15)
          );
          // Random demo failure around 20% chance between 35–90%
          const shouldFail = next > 35 && Math.random() < 0.08;
          if (shouldFail) {
            return {
              ...it,
              status: "error",
              error: "Network interruption in demo",
              progress: 0,
            };
          }
          if (next >= 100) return { ...it, progress: 100, status: "done" };
          return { ...it, progress: next };
        })
      );
    };
    // Create a short-lived interval to simulate progress
    const iv = setInterval(tick, 350);
    // Stop interval when item reaches done or error
    const stopWhenSettled = setInterval(() => {
      const it = itemsRef.current.find((x) => x.id === id);
      if (!it || it.status !== "uploading") {
        clearInterval(iv);
        clearInterval(stopWhenSettled);
      }
    }, 200);
  }, []);

  // Keep a ref of items so our interval can read latest state
  const itemsRef = React.useRef<Item[]>(items);
  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const onChooseFiles = (files: FileList | null) => {
    if (!files || !files.length) return;
    const toAdd: Item[] = Array.from(files).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      sizeBytes: f.size,
      mime: f.type,
      createdAt: new Date(),
      status: "uploading",
      progress: 0,
      previewUrl: f.type?.startsWith("image/")
        ? URL.createObjectURL(f)
        : undefined,
    }));
    setItems((s) => [...toAdd, ...s]);
    toAdd.forEach((it) => simulateUpload(it.id));
    if (inputRef.current) inputRef.current.value = ""; // reset
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    onChooseFiles(e.dataTransfer.files);
  };

  const removeItem = (id: string) =>
    setItems((s) => s.filter((it) => it.id !== id));
  const cancelUploading = (id: string) => removeItem(id);
  const retryItem = (id: string) => simulateUpload(id);
  const previewItem = (it: Item) => {
    if (it.previewUrl) {
      window.open(it.previewUrl, "_blank", "noopener,noreferrer");
      return;
    }
    // crude preview for demo: open a blank page with the filename
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (w)
      w.document.write(
        `<pre style="font:14px/1.4 system-ui;padding:20px">Preview not available.\n\n${it.name}</pre>`
      );
  };

  const renderIcon = (it: Item) => {
    if (it.status === "error")
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (it.mime?.includes("pdf") || it.name.toLowerCase().endsWith(".pdf"))
      return <FileText className="h-5 w-5 text-muted-foreground" />;
    if (
      it.mime?.startsWith("image/") ||
      /\.(png|jpg|jpeg|gif|svg)$/i.test(it.name)
    )
      return <ImageIcon className="h-5 w-5 text-muted-foreground" />;
    return <FileText className="h-5 w-5 text-muted-foreground" />;
  };

  const border = isOver ? "border-primary/50 bg-primary/5" : "border-dashed";

  return (
    <div className="space-y-6">
      {/* Drop zone */}
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
        className={`rounded-2xl ${border} border p-8 text-center`}
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
          SVG, PNG, JPG or GIF (max. 800×400px)
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
          className="px-4 bg-[#262323] hover:bg-[#262323] "
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

      {/* List header */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-semibold">Uploaded Files</Label>
        <span className="text-xs  bg-[#262323] w-5 h-5 text-white flex justify-center items-center rounded-full">
          {items.length}
        </span>
      </div>

      {/* Files list */}
      <div className="space-y-4 ">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-start justify-between py-2  bg-background "
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{renderIcon(it)}</div>
              <div>
                <div className="text-sm font-medium leading-5">{it.name}</div>

                {it.status === "error" ? (
                  <div className="mt-1 text-xs text-red-600">
                    {it.error ?? "Upload failed"}
                  </div>
                ) : (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {fmtDate(it.createdAt)} • {bytesToMB(it.sizeBytes)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center ">
              {it.status === "error" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => retryItem(it.id)}
                  className="gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              )}

              {it.status === "uploading" && (
                <div className="flex items-center gap-2">
                  <CircularProgress
                    value={it.progress}
                    size={40}
                    strokeWidth={5}
                    aria-label={`Uploading ${it.name}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => cancelUploading(it.id)}
                    aria-label="Cancel upload"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {it.status === "done" && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => previewItem(it)}
                    aria-label="Preview"
                  >
                    <Eye size={35} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(it.id)}
                    aria-label="Delete"
                  >
                    <Trash2 size={35} />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-xs text-muted-foreground">
            No files uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}
