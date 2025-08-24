import type { CovidRecord } from "../api/covid/interfaces";
import { calculateSummaryStats } from "./covidCalculations";

// US State codes mapping
export const US_STATE_CODES: Record<string, string> = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
  "District of Columbia": "DC",
};

// Reverse mapping for state codes to full names
export const STATE_CODE_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(US_STATE_CODES).map(([name, code]) => [code, name])
);

export interface StateHeatMapData {
  state: string;
  stateCode: string;
  avgRate: number;
  totalRecords: number;
  hasData: boolean;
}

/**
 * Calculate state-level hospitalization rate data for heat map
 */
export const calculateStateHeatMapData = (
  records: CovidRecord[]
): StateHeatMapData[] => {
  // Group records by state
  const stateGroups = records.reduce((groups, record) => {
    const state = record.state;
    if (state) {
      if (!groups[state]) {
        groups[state] = [];
      }
      groups[state].push(record);
    }
    return groups;
  }, {} as Record<string, CovidRecord[]>);

  // Calculate data for each state that has records
  const stateDataWithRecords = Object.entries(stateGroups).map(
    ([state, stateRecords]) => {
      const stats = calculateSummaryStats(stateRecords);
      const stateCode = US_STATE_CODES[state] || state;

      return {
        state,
        stateCode,
        avgRate: stats.avgRate,
        totalRecords: stats.totalRecords,
        hasData: true,
      };
    }
  );

  // Add states without data
  const statesWithData = new Set(stateDataWithRecords.map((s) => s.state));
  const statesWithoutData = Object.keys(US_STATE_CODES)
    .filter((state) => !statesWithData.has(state))
    .map((state) => ({
      state,
      stateCode: US_STATE_CODES[state],
      avgRate: 0,
      totalRecords: 0,
      hasData: false,
    }));

  return [...stateDataWithRecords, ...statesWithoutData];
};

/**
 * Get color for heat map based on hospitalization rate using PJMF colors
 */
export const getHeatMapColor = (avgRate: number, hasData: boolean): string => {
  if (!hasData) {
    return "#e6e7e8"; // Light gray for no data
  }

  // Define rate ranges based on data distribution
  if (avgRate >= 100) {
    return "#de8b39"; // McGovern Rust (high)
  } else if (avgRate >= 50) {
    return "#ffc719"; // McGovern Gold (medium-high)
  } else if (avgRate >= 25) {
    return "#c2ce51"; // McGovern Lime (medium)
  } else if (avgRate >= 10) {
    return "#7fafc3"; // McGovern Medium Teal (low-medium)
  } else if (avgRate > 0) {
    return "#cbdce1"; // Light Teal (low)
  } else {
    return "#e6e7e8"; // Light gray (no rate data)
  }
};

/**
 * Get rate range label for legend
 */
export const getRateRangeLabel = (
  avgRate: number,
  hasData: boolean
): string => {
  if (!hasData) {
    return "No Data";
  }

  if (avgRate >= 100) {
    return "≥ 100 (Very High)";
  } else if (avgRate >= 50) {
    return "50-99 (High)";
  } else if (avgRate >= 25) {
    return "25-49 (Medium)";
  } else if (avgRate >= 10) {
    return "10-24 (Low)";
  } else if (avgRate > 0) {
    return "1-9 (Very Low)";
  } else {
    return "No Rate Data";
  }
};

/**
 * Generate legend data for the heat map
 */
export const getHeatMapLegend = () => [
  { label: "≥ 100 (Very High)", color: "#de8b39" },
  { label: "50-99 (High)", color: "#ffc719" },
  { label: "25-49 (Medium)", color: "#c2ce51" },
  { label: "10-24 (Low)", color: "#7fafc3" },
  { label: "1-9 (Very Low)", color: "#cbdce1" },
  { label: "No Data", color: "#e6e7e8" },
];

/**
 * Format state data for display in tooltip
 */
export const formatStateTooltip = (stateData: StateHeatMapData): string => {
  if (!stateData.hasData) {
    return `${stateData.state}: No Data Available`;
  }

  return `${stateData.state}: ${stateData.avgRate.toFixed(1)} avg rate (${
    stateData.totalRecords
  } records)`;
};
