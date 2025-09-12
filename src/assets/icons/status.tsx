import { SVGProps } from "react";
const Status = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <path
      stroke="#98A2B3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.324}
      d="M1.985 11.267a7.36 7.36 0 0 0 5.538 5.016M1.69 8.332a7.358 7.358 0 0 1 14.637 0M10.487 16.29a7.372 7.372 0 0 0 5.538-4.986"
    />
  </svg>
);
export default Status;
