import type { DrawData, AnalysisResults, FrequencyData, HotColdData } from "@/types/lottery";

export function analyzeDrawData(draws: DrawData[]): AnalysisResults {
  const frequency = calculateFrequency(draws);
  const evenOdd = calculateEvenOdd(draws);
  const parityPatterns = calculateParityPatterns(draws);
  const lowHigh = calculateLowHigh(draws);
  const sumHistogram = calculateSumHistogram(draws);
  const consecutive = calculateConsecutive(draws);
  const hotCold = calculateHotCold(draws);

  return {
    frequency,
    evenOdd,
    parityPatterns,
    lowHigh,
    sumHistogram,
    consecutive,
    hotCold,
    totalDraws: draws.length,
  };
}

function calculateFrequency(draws: DrawData[]): FrequencyData[] {
  const frequencyMap: Record<number, number> = {};
  
  // Initialize all numbers 1-44
  for (let i = 1; i <= 44; i++) {
    frequencyMap[i] = 0;
  }

  draws.forEach((draw) => {
    draw.numbers.forEach((num) => {
      frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });
  });

  return Object.entries(frequencyMap)
    .map(([number, count]) => ({ number: parseInt(number), count }))
    .sort((a, b) => b.count - a.count);
}

function calculateEvenOdd(draws: DrawData[]) {
  let even = 0;
  let odd = 0;

  draws.forEach((draw) => {
    draw.numbers.forEach((num) => {
      if (num % 2 === 0) even++;
      else odd++;
    });
  });

  return { even, odd };
}

function calculateParityPatterns(draws: DrawData[]) {
  const patternCounts: Record<number, number> = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
  };

  draws.forEach((draw) => {
    const evenCount = draw.numbers.filter(num => num % 2 === 0).length;
    patternCounts[evenCount]++;
  });

  const totalDraws = draws.length;
  
  return Object.entries(patternCounts).map(([evenCount, drawCount]) => {
    const even = parseInt(evenCount);
    const odd = 6 - even;
    return {
      pattern: `${even}E-${odd}O`,
      evenCount: even,
      oddCount: odd,
      drawCount,
      percentage: (drawCount / totalDraws) * 100
    };
  });
}

function calculateLowHigh(draws: DrawData[]) {
  let low = 0;
  let high = 0;

  draws.forEach((draw) => {
    draw.numbers.forEach((num) => {
      if (num <= 22) low++;
      else high++;
    });
  });

  return { low, high };
}

function calculateSumHistogram(draws: DrawData[]) {
  const sumMap: Record<number, number> = {};

  draws.forEach((draw) => {
    const sum = draw.numbers.reduce((acc, num) => acc + num, 0);
    sumMap[sum] = (sumMap[sum] || 0) + 1;
  });

  return Object.entries(sumMap)
    .map(([sum, count]) => ({ sum: parseInt(sum), count }))
    .sort((a, b) => a.sum - b.sum);
}

function calculateConsecutive(draws: DrawData[]) {
  let twoConsecutive = 0;
  let threeConsecutive = 0;
  let fourOrMore = 0;

  draws.forEach((draw) => {
    const sorted = [...draw.numbers].sort((a, b) => a - b);
    let consecutive = 1;
    let maxConsecutive = 1;

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === sorted[i - 1] + 1) {
        consecutive++;
        maxConsecutive = Math.max(maxConsecutive, consecutive);
      } else {
        consecutive = 1;
      }
    }

    if (maxConsecutive >= 4) fourOrMore++;
    else if (maxConsecutive === 3) threeConsecutive++;
    else if (maxConsecutive === 2) twoConsecutive++;
  });

  return { twoConsecutive, threeConsecutive, fourOrMore };
}

function calculateHotCold(draws: DrawData[]) {
  const getLast = (n: number) => draws.slice(-n);
  
  const analyzeRange = (range: DrawData[]): HotColdData[] => {
    const freq = calculateFrequency(range);
    const avg = freq.reduce((sum, f) => sum + f.count, 0) / 44;
    
    return freq.map((f) => ({
      number: f.number,
      frequency: f.count,
      type: f.count > avg * 1.2 ? "hot" : f.count < avg * 0.8 ? "cold" : "neutral",
    }));
  };

  return {
    last20: analyzeRange(getLast(20)),
    last50: analyzeRange(getLast(50)),
    last100: analyzeRange(getLast(100)),
  };
}

export function parseCSV(csvContent: string): DrawData[] {
  const lines = csvContent.trim().split("\n");
  const draws: DrawData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",").map((s) => s.trim());
    if (parts.length >= 7) {
      const date = parts[0];
      const numbers = parts.slice(1, 7).map(Number).filter((n) => !isNaN(n) && n >= 1 && n <= 44);
      
      if (numbers.length === 6) {
        draws.push({ date, numbers });
      }
    }
  }

  return draws;
}

export function exportToCSV(results: AnalysisResults): string {
  let csv = "Arizona Pick (6/44) Analysis Results\n\n";
  
  csv += "Frequency Analysis\n";
  csv += "Number,Count\n";
  results.frequency.forEach(({ number, count }) => {
    csv += `${number},${count}\n`;
  });
  
  csv += "\nEven/Odd Distribution\n";
  csv += `Even,${results.evenOdd.even}\n`;
  csv += `Odd,${results.evenOdd.odd}\n`;
  
  csv += "\nLow/High Distribution\n";
  csv += `Low (1-22),${results.lowHigh.low}\n`;
  csv += `High (23-44),${results.lowHigh.high}\n`;
  
  return csv;
}

export function exportToJSON(results: AnalysisResults): string {
  return JSON.stringify(results, null, 2);
}
