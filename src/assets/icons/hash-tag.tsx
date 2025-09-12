import { SVGProps } from "react";
const Hashtag = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={1.5}
      d="m8.333 2.5-1.666 15M13.333 2.5l-1.666 15M2.917 7.5h15M2.083 12.5h15"
    />
  </svg>
);
export default Hashtag;
