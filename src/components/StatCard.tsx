import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({ title, value, subtitle, icon: Icon, trend = "neutral" }: StatCardProps) {
  const trendColors = {
    up: "text-chart-5",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="shadow-card hover:shadow-hover transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className={`text-xs ${trendColors[trend]} mt-1`}>
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
