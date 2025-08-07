export interface DashboardCardProps {
  title: string;
  subtitle: string;
  body: string;
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const DashboardCard = ({
  title,
  subtitle,
  body,
}: DashboardCardProps) => {
  return (
    <>
      <Card className="text-lg">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{body}</p>
        </CardContent>
      </Card>
    </>
  );
};
