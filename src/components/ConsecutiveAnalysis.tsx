import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { ConsecutiveData } from "@/types/lottery";

interface ConsecutiveAnalysisProps {
  data: ConsecutiveData;
  totalDraws: number;
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

export function ConsecutiveAnalysis({ data, totalDraws }: ConsecutiveAnalysisProps) {
  const chartData = [
    { 
      name: "2 Consecutive", 
      count: data.twoConsecutive,
      percentage: ((data.twoConsecutive / totalDraws) * 100).toFixed(1)
    },
    { 
      name: "3 Consecutive", 
      count: data.threeConsecutive,
      percentage: ((data.threeConsecutive / totalDraws) * 100).toFixed(1)
    },
    { 
      name: "4+ Consecutive", 
      count: data.fourOrMore,
      percentage: ((data.fourOrMore / totalDraws) * 100).toFixed(1)
    },
  ];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Consecutive Numbers Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} draws (${props.payload.percentage}%)`,
                "Count"
              ]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
