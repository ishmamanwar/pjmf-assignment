import type { TrendData } from "../api/covid/interfaces";

/**
 * Transform COVID records for line chart visualization
 */
export const transformForLineChart = (trends: TrendData[]) => {
  return trends
    .filter((trend) => trend.date) // Filter out null dates
    .map((trend) => ({
      x: new Date(trend.date!).getTime(), // Non-null assertion since we filtered
      y: trend.avg_rate,
      formatted_date: trend.formatted_date,
    }));
};

/**
 * Transform COVID trends for bar chart (latest N months)
 */
export const transformForBarChart = (
  trends: TrendData[],
  monthsCount: number = 12
) => {
  return trends.slice(-monthsCount).map((trend) => ({
    month: trend.formatted_date,
    avg_rate: trend.avg_rate,
    max_rate: trend.max_rate,
    min_rate: trend.min_rate,
  }));
};

/**
 * Format date for display
 */
export const formatDisplayDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

/**
 * Format rate for display
 */
export const formatRate = (
  rate: number | null,
  decimals: number = 1
): string => {
  if (rate === null || rate === undefined) return "N/A";
  return rate.toFixed(decimals);
};

/**
 * Generate chart colors based on PJMF tokens
 */
export const getPJMFChartColors = () => ({
  primary: "#007d99", // McGovern Teal
  secondary: "#ffc719", // McGovern Gold
  tertiary: "#de8b39", // McGovern Rust
  quaternary: "#c2ce51", // McGovern Lime
  accent1: "#438c8b", // McGovern Peacock
  accent2: "#7fafc3", // McGovern Medium Teal
  accent3: "#79a27a", // McGovern Pine
  light: "#cbdce1", // Light Teal
  gray: "#696e71", // McGovern Gray
});

/**
 * Create consistent chart styling for MUI Charts
 */
export const getChartStyling = () => ({
  ".MuiChartsAxis-label": {
    fill: "#696e71",
    fontFamily: "var(--pjmf-font-proxima-nova)",
  },
  ".MuiChartsAxis-tick": {
    fill: "#696e71",
    fontFamily: "var(--pjmf-font-proxima-nova)",
  },
  ".MuiChartsLegend-label": {
    fill: "#696e71",
    fontFamily: "var(--pjmf-font-proxima-nova)",
  },
});

/**
 * Sort records by a specific field
 */
export const sortRecords = <T extends Record<string, any>>(
  records: T[],
  field: keyof T,
  order: "asc" | "desc" = "asc"
): T[] => {
  return [...records].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    // Handle null/undefined values
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    // Handle different data types
    if (typeof aVal === "string" && typeof bVal === "string") {
      const comparison = aVal.localeCompare(bVal);
      return order === "asc" ? comparison : -comparison;
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      const comparison = aVal - bVal;
      return order === "asc" ? comparison : -comparison;
    }

    // Default string comparison
    const comparison = String(aVal).localeCompare(String(bVal));
    return order === "asc" ? comparison : -comparison;
  });
};
