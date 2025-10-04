import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import type { ParityPatternData } from "@/types/lottery";

interface ParityPatternChartProps {
  data: ParityPatternData[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
];

export function ParityPatternChart({ data }: ParityPatternChartProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Even/Odd Pattern Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="pattern" 
              stroke="hsl(var(--foreground))"
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <YAxis 
              stroke="hsl(var(--foreground))"
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              formatter={(value: number, name: string) => {
                if (name === "drawCount") {
                  const item = data.find(d => d.drawCount === value);
                  return [value, `Count (${item?.percentage.toFixed(1)}%)`];
                }
                return [value, name];
              }}
            />
            <Bar dataKey="drawCount" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList 
                dataKey="percentage" 
                position="top" 
                formatter={(label: React.ReactNode) => {
                    const num =
                    typeof label === "number"
                        ? label
                        : parseFloat(String(label ?? 0));
                    return `${num.toFixed(1)}%`;
                }}
                style={{ fill: "hsl(var(--foreground))", fontSize: "12px" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
