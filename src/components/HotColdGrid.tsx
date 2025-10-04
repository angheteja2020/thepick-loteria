import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { HotColdData } from "@/types/lottery";

interface HotColdGridProps {
  last20: HotColdData[];
  last50: HotColdData[];
  last100: HotColdData[];
}

function HotColdNumbers({ data }: { data: HotColdData[] }) {
  const sortedData = [...data].sort((a, b) => a.number - b.number);

  const getColor = (type: "hot" | "cold" | "neutral") => {
    switch (type) {
      case "hot":
        return "bg-chart-5 text-white";
      case "cold":
        return "bg-chart-1 text-white";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <div className="grid grid-cols-11 gap-2">
      {sortedData.map((item) => (
        <div
          key={item.number}
          className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs font-medium transition-all hover:scale-105 ${getColor(
            item.type
          )}`}
          title={`Number ${item.number}: ${item.frequency} times`}
        >
          <div className="font-bold">{item.number}</div>
          <div className="text-[10px] opacity-80">{item.frequency}</div>
        </div>
      ))}
    </div>
  );
}

export function HotColdGrid({ last20, last50, last100 }: HotColdGridProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Hot & Cold Numbers</CardTitle>
        <div className="flex gap-4 text-xs mt-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-chart-5"></div>
            <span>Hot (above avg)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-chart-1"></div>
            <span>Cold (below avg)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted"></div>
            <span>Neutral</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="last20">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="last20">Last 20</TabsTrigger>
            <TabsTrigger value="last50">Last 50</TabsTrigger>
            <TabsTrigger value="last100">Last 100</TabsTrigger>
          </TabsList>
          <TabsContent value="last20" className="mt-4">
            <HotColdNumbers data={last20} />
          </TabsContent>
          <TabsContent value="last50" className="mt-4">
            <HotColdNumbers data={last50} />
          </TabsContent>
          <TabsContent value="last100" className="mt-4">
            <HotColdNumbers data={last100} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
