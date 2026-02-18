import { forwardRef, SVGProps } from "react";

type PeopleProps = SVGProps<SVGSVGElement> & { size?: number };

const People = forwardRef<SVGSVGElement, PeopleProps>(
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
        d="M15 5.96602C14.95 5.95769 14.8917 5.95769 14.8417 5.96602C13.6917 5.92435 12.775 4.98268 12.775 3.81602C12.775 2.62435 13.7334 1.66602 14.925 1.66602C16.1167 1.66602 17.075 2.63268 17.075 3.81602C17.0667 4.98268 16.15 5.92435 15 5.96602Z"
        stroke="#475367"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1417 12.0328C15.2834 12.2245 16.5417 12.0245 17.425 11.4328C18.6 10.6495 18.6 9.36615 17.425 8.58282C16.5334 7.99115 15.2584 7.79115 14.1167 7.99115"
        stroke="#475367"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.9749 5.96602C5.0249 5.95769 5.08324 5.95769 5.13324 5.96602C6.28324 5.92435 7.1999 4.98268 7.1999 3.81602C7.1999 2.62435 6.24157 1.66602 5.0499 1.66602C3.85824 1.66602 2.8999 2.63268 2.8999 3.81602C2.90824 4.98268 3.8249 5.92435 4.9749 5.96602Z"
        stroke="#475367"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83328 12.0328C4.69162 12.2245 3.43328 12.0245 2.54995 11.4328C1.37495 10.6495 1.37495 9.36615 2.54995 8.58282C3.44162 7.99115 4.71662 7.79115 5.85828 7.99115"
        stroke="#475367"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.1926C9.95002 12.1842 9.89169 12.1842 9.84169 12.1926C8.69169 12.1509 7.77502 11.2092 7.77502 10.0426C7.77502 8.85091 8.73336 7.89258 9.92502 7.89258C11.1167 7.89258 12.075 8.85925 12.075 10.0426C12.0667 11.2092 11.15 12.1592 10 12.1926Z"
        stroke="#475367"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.57498 14.8168C6.39998 15.6001 6.39998 16.8835 7.57498 17.6668C8.90831 18.5585 11.0916 18.5585 12.425 17.6668C13.6 16.8835 13.6 15.6001 12.425 14.8168C11.1 13.9335 8.90831 13.9335 7.57498 14.8168Z"
        stroke="#475367"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
);

export default People;
