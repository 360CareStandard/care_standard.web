// app-path.ts
export const APP_BASE = "/app";
export const appPath = (p: string) => {
  const seg = p.startsWith("/") ? p : `/${p}`;
  return `${APP_BASE}${seg}`;
};
