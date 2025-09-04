// layouts/app-layout.tsx
import { Outlet } from "react-router-dom";
import { AppHeader } from "./app-header";

export default function AppLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-neutral-50">
      <AppHeader />
      <main className="flex-1 pt-16 min-h-[calc(100dvh-4rem)]">
        <Outlet /> {/* child layouts/pages decide their own padding */}
      </main>
    </div>
  );
}
