import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Staff = () => {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Client Information</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            The complete information about clients
          </p>
        </div>
        <button>Hello</button>
      </div>
      Staff
      <Card className="flex-1 mt-12  mx-auto w-full">
        <CardContent className="flex justify-center items-center flex-col py-8 gap-2 w-full">
          <svg
            width={31}
            height={31}
            viewBox="0 0 31 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.2604 2.56445V6.41211"
              stroke="#191D31"
              strokeWidth="1.92383"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.5209 2.56445V6.41211"
              stroke="#191D31"
              strokeWidth="1.92383"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.48889 11.6582H26.2923"
              stroke="#191D31"
              strokeWidth="1.92383"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23.0859 29.4987C25.9192 29.4987 28.2161 27.2018 28.2161 24.3685C28.2161 21.5352 25.9192 19.2383 23.0859 19.2383C20.2526 19.2383 17.9557 21.5352 17.9557 24.3685C17.9557 27.2018 20.2526 29.4987 23.0859 29.4987Z"
              stroke="#191D31"
              strokeWidth="1.92383"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24.9969 24.4336H21.1749"
              stroke="#191D31"
              strokeWidth="1.92383"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23.0859 22.5605V26.3954"
              stroke="#191D31"
              strokeWidth="1.92383"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M26.9336 10.901V20.9819C25.9973 19.9174 24.625 19.2376 23.0859 19.2376C20.2515 19.2376 17.9557 21.5334 17.9557 24.3678C17.9557 25.3298 18.2251 26.2404 18.6996 27.0099C18.9689 27.4716 19.3152 27.882 19.7128 28.2155H10.2604C5.77148 28.2155 3.84766 25.6504 3.84766 21.8027V10.901C3.84766 7.05339 5.77148 4.48828 10.2604 4.48828H20.5208C25.0098 4.48828 26.9336 7.05339 26.9336 10.901Z"
              stroke="#191D31"
              strokeWidth="1.92383"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.3848 17.569H15.3964"
              stroke="#191D31"
              strokeWidth="2.5651"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.6379 17.569H10.6494"
              stroke="#191D31"
              strokeWidth="2.5651"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.6379 21.4167H10.6494"
              stroke="#191D31"
              strokeWidth="2.5651"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h4 className="font-semibold">No visits scheduled yet</h4>
          <p className="text-muted-foreground text-sm">
            Start by adding a visit to track care schedule and ensure
            continuity.
          </p>
          <div className="mt-1">
            <Button
              // onClick={onClick}

              className="text-xs"
              size={"sm"}
            >
              Add Visit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Staff;
