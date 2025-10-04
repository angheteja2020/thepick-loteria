import { useState } from "react";
import { Download, BarChart3, TrendingUp, Hash, Percent } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { StatCard } from "@/components/StatCard";
import { FrequencyChart } from "@/components/FrequencyChart";
import { DistributionChart } from "@/components/DistributionChart";
import { ParityPatternChart } from "@/components/ParityPatternChart";
import { SumHistogram } from "@/components/SumHistogram";
import { ConsecutiveAnalysis } from "@/components/ConsecutiveAnalysis";
import { HotColdGrid } from "@/components/HotColdGrid";
import { Button } from "@/components/ui/button";
import { parseCSV, analyzeDrawData, exportToCSV, exportToJSON } from "@/utils/lotteryAnalysis";
import type { AnalysisResults } from "@/types/lottery";
import { toast } from "sonner";

const Index = () => {
  const [results, setResults] = useState<AnalysisResults | null>(null);

  const handleFileUpload = (content: string) => {
    try {
      const draws = parseCSV(content);
      
      if (draws.length === 0) {
        toast.error("No valid draw data found in CSV");
        return;
      }

      const analysis = analyzeDrawData(draws);
      setResults(analysis);
      toast.success(`Analyzed ${draws.length} draws successfully`);
    } catch (error) {
      console.error(error);
      toast.error("Error parsing CSV file");
    }
  };

  const handleExport = (format: "csv" | "json") => {
    if (!results) return;

    const content = format === "csv" ? exportToCSV(results) : exportToJSON(results);
    const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lottery-analysis.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-primary">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">
                Arizona Pick Analytics
              </h1>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Historical Data Analysis for The Pick (6/44)
              </p>
            </div>
            {results && (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleExport("csv")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleExport("json")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!results ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Draws"
                value={results.totalDraws}
                icon={BarChart3}
                subtitle="Historical records"
              />
              <StatCard
                title="Even Numbers"
                value={`${((results.evenOdd.even / (results.evenOdd.even + results.evenOdd.odd)) * 100).toFixed(1)}%`}
                icon={Percent}
                subtitle={`${results.evenOdd.even} occurrences`}
              />
              <StatCard
                title="Low Numbers"
                value={`${((results.lowHigh.low / (results.lowHigh.low + results.lowHigh.high)) * 100).toFixed(1)}%`}
                icon={TrendingUp}
                subtitle="Numbers 1-22"
              />
              <StatCard
                title="Most Common"
                value={results.frequency[0].number}
                icon={Hash}
                subtitle={`Appeared ${results.frequency[0].count} times`}
              />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <FrequencyChart data={results.frequency} />
              </div>
              
              <DistributionChart
                title="Even/Odd Total Distribution"
                data={[
                  { name: "Even", value: results.evenOdd.even },
                  { name: "Odd", value: results.evenOdd.odd },
                ]}
              />
              
              <DistributionChart
                title="Low/High Distribution"
                data={[
                  { name: "Low (1-22)", value: results.lowHigh.low },
                  { name: "High (23-44)", value: results.lowHigh.high },
                ]}
              />

              <div className="lg:col-span-2">
                <ParityPatternChart data={results.parityPatterns} />
              </div>

              <div className="lg:col-span-2">
                <SumHistogram data={results.sumHistogram} />
              </div>

              <ConsecutiveAnalysis
                data={results.consecutive}
                totalDraws={results.totalDraws}
              />

              <div className="lg:col-span-2">
                <HotColdGrid
                  last20={results.hotCold.last20}
                  last50={results.hotCold.last50}
                  last100={results.hotCold.last100}
                />
              </div>
            </div>

            {/* Upload New File */}
            <div className="flex justify-center pt-8">
              <Button
                variant="outline"
                onClick={() => setResults(null)}
              >
                Upload New File
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
