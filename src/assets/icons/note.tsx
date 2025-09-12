import { SVGProps } from "react";
const Note = (props: SVGProps<SVGSVGElement>) => (
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
      d="M6.667 1.667v2.5M13.333 1.667v2.5M5.833 10.834H12.5M5.833 14.166H10M13.333 2.917c2.775.15 4.167 1.208 4.167 5.124v5.15c0 3.434-.833 5.15-5 5.15h-5c-4.167 0-5-1.716-5-5.15v-5.15c0-3.916 1.392-4.966 4.167-5.125h6.666Z"
    />
  </svg>
);
export default Note;
