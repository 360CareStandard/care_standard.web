// layouts/container-layout.tsx
import { Outlet } from "react-router-dom";
import clsx from "clsx";

type Props = { className?: string };

export default function ContainerLayout({ className }: Props) {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-[1400px] px-2 sm:px-6 py-6",
        className
      )}
    >
      <Outlet />
    </div>
  );
}
