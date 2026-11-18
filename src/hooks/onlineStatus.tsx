import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { WifiOff, RefreshCw, X } from "lucide-react";

const OnlineStatus: FC = () => {
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (online) setOpen(false);
    else setOpen(true);
  }, [online]);

  const retry = () => setOnline(navigator.onLine);

  if (!open) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-5 z-[100] flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-rose-100 bg-white/95 px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl animate-[slideDown_200ms_ease-out]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50">
          <WifiOff className="h-4 w-4 text-rose-400" />
        </span>

        <p className="whitespace-nowrap text-sm font-medium text-zinc-700">
          You’re offline
          <span className="ml-1.5 font-normal text-zinc-400">
            · Waiting for connection
          </span>
        </p>

        <button
          onClick={retry}
          aria-label="Retry connection"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition hover:bg-rose-100 active:scale-95"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() => setOpen(false)}
          aria-label="Dismiss offline message"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <style>
        {`@keyframes slideDown {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }`}
      </style>
    </div>,
    document.body,
  );
};

export default OnlineStatus;
