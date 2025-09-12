import { forwardRef } from "react";

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  title?: string; // optional for a11y if used as a standalone graphic
};

const TrashIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 20, className, title, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={size}
      height={size}
      stroke="#61779C"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
      focusable="false"
      className={className}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d="M17.5 5.608h-.067C13.025 5.167 8.625 5 4.267 5.442l-1.7.166a.63.63 0 0 1-.134-1.25l1.7-.166c4.434-.45 8.925-.275 13.425.166a.626.626 0 0 1 .559.684.617.617 0 0 1-.617.566Z" />
      <path d="M7.083 4.767c-.033 0-.066 0-.108-.009a.627.627 0 0 1-.508-.716L6.65 2.95c.133-.8.317-1.908 2.258-1.908h2.184c1.95 0 2.133 1.15 2.258 1.916l.183 1.084a.619.619 0 0 1-.508.716.619.619 0 0 1-.717-.508l-.183-1.083c-.117-.725-.142-.867-1.025-.867H8.917c-.884 0-.9.117-1.025.858L7.7 4.242a.625.625 0 0 1-.617.525ZM12.675 18.958h-5.35c-2.908 0-3.025-1.608-3.117-2.908l-.541-8.392a.63.63 0 0 1 .583-.666.631.631 0 0 1 .667.583l.541 8.392c.092 1.266.125 1.741 1.867 1.741h5.35c1.75 0 1.783-.475 1.867-1.741l.541-8.392a.637.637 0 0 1 .667-.583.626.626 0 0 1 .583.666l-.541 8.392c-.092 1.3-.209 2.908-3.117 2.908Z" />
      <path d="M11.383 14.375H8.608a.63.63 0 0 1-.625-.625.63.63 0 0 1 .625-.625h2.775a.63.63 0 0 1 .625.625.63.63 0 0 1-.625.625ZM12.083 11.042H7.917a.63.63 0 0 1-.625-.625.63.63 0 0 1 .625-.625h4.166a.63.63 0 0 1 .625.625.63.63 0 0 1-.625.625Z" />
    </svg>
  )
);

TrashIcon.displayName = "TrashIcon";
export default TrashIcon;
