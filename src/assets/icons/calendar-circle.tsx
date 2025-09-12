import { SVGProps } from "react";
const CalendarCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      stroke="#191D31"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M10 18.333a8.333 8.333 0 1 0 0-16.667 8.333 8.333 0 0 0 0 16.667ZM8.242 4.858v1.667M11.758 4.858v1.667M6.275 8.45h7.45"
    />
    <path
      stroke="#191D31"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M11.25 14.725h-2.5c-2.083 0-3.333-1.5-3.333-3.333v-2.5c0-1.833 1.25-3.333 3.333-3.333h2.5c2.083 0 3.333 1.5 3.333 3.333v2.5c0 1.833-1.25 3.333-3.333 3.333Z"
    />
  </svg>
);
export default CalendarCircle;
