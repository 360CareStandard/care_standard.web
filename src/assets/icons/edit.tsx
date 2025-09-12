import { forwardRef, SVGProps } from "react";

type EditProps = SVGProps<SVGSVGElement> & { size?: number };

const Edit = forwardRef<SVGSVGElement, EditProps>(
  ({ size = 20, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke="#61779C"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        // vectorEffect keeps stroke width visually similar when the SVG is scaled
        vectorEffect="non-scaling-stroke"
        d="M9.167 1.667H7.5c-4.167 0-5.833 1.666-5.833 5.833v5c0 4.167 1.666 5.833 5.833 5.833h5c4.167 0 5.833-1.666 5.833-5.833v-1.667"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        d="M13.367 2.517 6.8 9.083c-.25.25-.5.742-.55 1.1l-.358 2.509c-.134.908.508 1.541 1.416 1.416l2.509-.358c.35-.05.841-.3 1.1-.55l6.566-6.567c1.134-1.133 1.667-2.45 0-4.116-1.666-1.667-2.983-1.134-4.116 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        d="M12.425 3.458a5.954 5.954 0 0 0 4.117 4.117"
      />
    </svg>
  )
);

export default Edit;
