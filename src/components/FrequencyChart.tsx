import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { FrequencyData } from "@/types/lottery";

interface FrequencyChartProps {
  data: FrequencyData[];
}

export function FrequencyChart({ data }: FrequencyChartProps) {
  const sortedData = [...data].sort((a, b) => a.number - b.number);
  const maxCount = Math.max(...data.map(d => d.count));

  const getColor = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return "hsl(var(--chart-5))";
    if (ratio > 0.6) return "hsl(var(--chart-1))";
    if (ratio > 0.4) return "hsl(var(--chart-2))";
    return "hsl(var(--chart-3))";
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Number Frequency (1-44)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="number" 
              tick={{ fontSize: 10 }}
              interval={3}
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.count)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
