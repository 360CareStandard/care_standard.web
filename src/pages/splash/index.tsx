// // pages/splash.tsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const MIN_SHOW_MS = 800;
// const MAX_WAIT_MS = 2000;

// export default function Splash() {
//   const navigate = useNavigate();
//   const [fadeOut, setFadeOut] = useState(false);

//   useEffect(() => {
//     const seen = sessionStorage.getItem("cs360_seen_splash") === "1";
//     if (seen) {
//       navigate("/login", { replace: true });
//       return;
//     }

//     const start = performance.now();
//     const fontsReady: Promise<unknown> =
//       (document as any).fonts?.ready ?? Promise.resolve();

//     const logoReady = new Promise((resolve) => {
//       const img = new Image();
//       img.onload = img.onerror = () => resolve(true);
//       img.src = "/logo/logo-care-standard.svg";
//     });

//     const maxTimer = new Promise((r) => setTimeout(r, MAX_WAIT_MS));

//     Promise.race([
//       Promise.allSettled([fontsReady, logoReady]).then(
//         () =>
//           new Promise((r) => {
//             const elapsed = performance.now() - start;
//             const wait = Math.max(0, MIN_SHOW_MS - elapsed);
//             setTimeout(r, wait);
//           })
//       ),
//       maxTimer,
//     ]).then(() => {
//       sessionStorage.setItem("cs360_seen_splash", "1");
//       setFadeOut(true);
//       setTimeout(() => navigate("/login", { replace: true }), 200);
//     });
//   }, [navigate]);

//   return (
//     <section
//       aria-label="Loading Care Standard"
//       className={`transition-opacity duration-200 ${
//         fadeOut ? "opacity-0" : "opacity-100"
//       }`}
//     >
//       <div className="flex flex-col items-center text-white gap-6">
//         <img
//           src="/logo/logo-care-standard.svg"
//           alt="Care Standard 360+"
//           className="h-16 w-auto drop-shadow-md motion-safe:animate-logo-pop"
//           draggable={false}
//         />
//         <div
//           role="status"
//           aria-live="polite"
//           className="flex items-center gap-3 text-sm opacity-90"
//         >
//           <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
//           Loading…
//         </div>
//       </div>
//     </section>
//   );
// }

export {};
