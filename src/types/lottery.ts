export interface DrawData {
  date: string;
  numbers: number[];
}

export interface FrequencyData {
  number: number;
  count: number;
}

export interface DistributionData {
  even: number;
  odd: number;
}

export interface ParityPatternData {
  pattern: string;
  evenCount: number;
  oddCount: number;
  drawCount: number;
  percentage: number;
}

export interface LowHighData {
  low: number;
  high: number;
}

export interface ConsecutiveData {
  twoConsecutive: number;
  threeConsecutive: number;
  fourOrMore: number;
}

export interface HotColdData {
  number: number;
  frequency: number;
  type: "hot" | "cold" | "neutral";
}

export interface AnalysisResults {
  frequency: FrequencyData[];
  evenOdd: DistributionData;
  parityPatterns: ParityPatternData[];
  lowHigh: LowHighData;
  sumHistogram: { sum: number; count: number }[];
  consecutive: ConsecutiveData;
  hotCold: {
    last20: HotColdData[];
    last50: HotColdData[];
    last100: HotColdData[];
  };
  totalDraws: number;
}
