import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./calendar.css";

import "leaflet/dist/leaflet.css";

import AppProvider from "./provider/index.tsx";
import AppRoutes from "./routes/index.routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </StrictMode>,
);

requestAnimationFrame(() => {
  const el =
    document.getElementById("boot-bg") || document.getElementById("boot");
  if (!el) return;
  el.style.transition = "opacity 150ms";
  el.style.opacity = "0";
  setTimeout(() => el.remove(), 160);
});
