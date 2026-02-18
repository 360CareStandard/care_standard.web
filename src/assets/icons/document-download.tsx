import { forwardRef, SVGProps } from "react";

type DocumentDownloadProps = SVGProps<SVGSVGElement> & { size?: number };

const DocumentDownload = forwardRef<SVGSVGElement, DocumentDownloadProps>(
  ({ size = 20, className, ...props }, ref) => (
    <svg
      ref={ref}
      className={className}
      {...props}
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 9.16602V14.166L9.16667 12.4993"
        stroke="#475367"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.50004 14.1667L5.83337 12.5"
        stroke="#475367"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 8.33268V12.4993C18.3333 16.666 16.6666 18.3327 12.5 18.3327H7.49996C3.33329 18.3327 1.66663 16.666 1.66663 12.4993V7.49935C1.66663 3.33268 3.33329 1.66602 7.49996 1.66602H11.6666"
        stroke="#475367"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 8.33268H15C12.5 8.33268 11.6666 7.49935 11.6666 4.99935V1.66602L18.3333 8.33268Z"
        stroke="#475367"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
);

export default DocumentDownload;
