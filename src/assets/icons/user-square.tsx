import { SVGProps } from "react";
const UserSquare = (props: SVGProps<SVGSVGElement>) => (
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
      d="M15.117 18.017c-.734.216-1.6.316-2.617.316h-5c-1.017 0-1.883-.1-2.617-.316.184-2.167 2.409-3.875 5.117-3.875s4.933 1.708 5.117 3.875Z"
    />
    <path
      stroke="#191D31"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.5 1.667h-5c-4.167 0-5.833 1.666-5.833 5.833v5c0 3.15.95 4.875 3.216 5.517.184-2.167 2.409-3.875 5.117-3.875s4.933 1.708 5.117 3.875c2.266-.642 3.216-2.367 3.216-5.517v-5c0-4.167-1.666-5.833-5.833-5.833ZM10 11.808a2.987 2.987 0 0 1-2.983-2.991A2.98 2.98 0 0 1 10 5.833a2.98 2.98 0 0 1 2.983 2.984A2.987 2.987 0 0 1 10 11.808Z"
    />
    <path
      stroke="#191D31"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.983 8.817A2.987 2.987 0 0 1 10 11.809a2.987 2.987 0 0 1-2.983-2.992A2.98 2.98 0 0 1 10 5.833a2.98 2.98 0 0 1 2.983 2.984Z"
    />
  </svg>
);
export default UserSquare;
