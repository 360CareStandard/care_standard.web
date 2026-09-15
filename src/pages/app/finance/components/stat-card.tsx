import { Spinner } from "@/components/shared/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: JSX.Element;
  isLoading: boolean;
  isError?: boolean;
};

const StatCard = ({
  title,
  value,
  description,
  icon,
  isLoading,
  isError,
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="text-2xl font-bold text-destructive">-</div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
