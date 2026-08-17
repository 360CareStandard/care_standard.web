import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { WifiOff, RefreshCw, X } from "lucide-react";

const OnlineStatus: FC = () => {
  const [online, setOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [open, setOpen] = useState<boolean>(false);

  // avoid initial flash on mount
  useEffect(() => {
    const init = () => setOnline(navigator.onLine);
    init();
  }, []);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // show when offline, hide when back online
  useEffect(() => {
    setOpen(!online);
  }, [online]);

  const retry = () => setOnline(navigator.onLine);

  if (!open) return null;

  const toast = (
    <div
      aria-live="polite"
      role="status"
      className="fixed inset-x-0 top-4 z-[100] flex justify-center pointer-events-none"
    >
      <div
        className={[
          "pointer-events-auto",
          "flex items-start gap-3",
          "rounded-lg border border-red-200/60 bg-red-600 backdrop-blur",
          "shadow-lg px-4 py-3",
          "w-[92%] max-w-md",
          "transition-all duration-200 ease-out",
          "animate-[slideDown_200ms_ease-out]",
          "dark:border-red-900/40 dark:bg-zinc-900/90",
        ].join(" ")}
      >
        <div className="mt-0.5">
          <WifiOff className="h-5 w-5 text-white" aria-hidden="true" />
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-white dark:text-zinc-100">
            You’re offline
          </p>
          <p className="text-xs text-white">
            Check your connection. We’ll resume once you’re back online.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={retry}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium
                         border-zinc-300 text-white
                        "
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-white
                         dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Dismiss offline message"
            >
              <X className="h-3.5 w-3.5" />
              Dismiss
            </button>
          </div>
        </div>
      </div>

      {/* tiny keyframes without adding a css file */}
      <style>
        {`@keyframes slideDown{from{transform:translateY(-8px);opacity:.0 }to{transform:translateY(0);opacity:1}}`}
      </style>
    </div>
  );

  return createPortal(toast, document.body);
};

export default OnlineStatus;
