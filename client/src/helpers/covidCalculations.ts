import type { CovidRecord } from "../api/covid/interfaces";

/**
 * Get unique states from COVID records
 */
export const getUniqueStates = (data: CovidRecord[]): string[] => {
  const states = data.map((record) => record.state).filter(Boolean);
  return [...new Set(states)].sort();
};

/**
 * Get unique seasons from COVID records
 */
export const getUniqueSeasons = (data: CovidRecord[]): string[] => {
  const seasons = data.map((record) => record.season).filter(Boolean);
  return [...new Set(seasons)].sort();
};

/**
 * Get date range from COVID records
 */
export const getDateRange = (
  data: CovidRecord[]
): {
  start: string | null;
  end: string | null;
} => {
  const dates = data.map((record) => record.date).filter(Boolean);
  if (dates.length === 0) return { start: null, end: null };

  const sortedDates = dates.sort();
  return {
    start: sortedDates[0],
    end: sortedDates[sortedDates.length - 1],
  };
};

/**
 * Calculate average hospitalization rate from COVID records
 */
export const getAverageRate = (records: CovidRecord[]): number => {
  const rates = records
    .map((record) => record.monthly_rate)
    .filter((rate): rate is number => rate !== null);
  return rates.length > 0
    ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length
    : 0;
};

/**
 * Calculate maximum hospitalization rate from COVID records
 */
export const getMaxRate = (records: CovidRecord[]): number => {
  const rates = records
    .map((record) => record.monthly_rate)
    .filter((rate): rate is number => rate !== null);
  return rates.length > 0 ? Math.max(...rates) : 0;
};

/**
 * Calculate minimum hospitalization rate from COVID records
 */
export const getMinRate = (records: CovidRecord[]): number => {
  const rates = records
    .map((record) => record.monthly_rate)
    .filter((rate): rate is number => rate !== null);
  return rates.length > 0 ? Math.min(...rates) : 0;
};

/**
 * Get unique age categories from COVID records
 */
export const getUniqueAgeCategories = (data: CovidRecord[]): string[] => {
  const ageCategories = data
    .map((record) => record.age_category)
    .filter(Boolean);
  return [...new Set(ageCategories)].sort();
};

/**
 * Get unique sex values from COVID records
 */
export const getUniqueSex = (data: CovidRecord[]): string[] => {
  const sexValues = data.map((record) => record.sex).filter(Boolean);
  return [...new Set(sexValues)].sort();
};

/**
 * Get unique race/ethnicity values from COVID records
 */
export const getUniqueRace = (data: CovidRecord[]): string[] => {
  const raceValues = data.map((record) => record.race).filter(Boolean);
  return [...new Set(raceValues)].sort();
};

/**
 * Filter records by date range
 */
export const filterByDateRange = (
  records: CovidRecord[],
  startDate?: string,
  endDate?: string
): CovidRecord[] => {
  return records.filter((record) => {
    if (!record.date) return false;
    if (startDate && record.date < startDate) return false;
    if (endDate && record.date > endDate) return false;
    return true;
  });
};

/**
 * Filter records by rate range
 */
export const filterByRateRange = (
  records: CovidRecord[],
  minRate?: number,
  maxRate?: number
): CovidRecord[] => {
  return records.filter((record) => {
    if (record.monthly_rate === null) return false;
    if (minRate !== undefined && record.monthly_rate < minRate) return false;
    if (maxRate !== undefined && record.monthly_rate > maxRate) return false;
    return true;
  });
};

/**
 * Group records by a specific field
 */
export const groupRecordsBy = <K extends keyof CovidRecord>(
  records: CovidRecord[],
  field: K
): Record<string, CovidRecord[]> => {
  return records.reduce((groups, record) => {
    const key = String(record[field] || "Unknown");
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(record);
    return groups;
  }, {} as Record<string, CovidRecord[]>);
};

/**
 * Calculate summary statistics for a group of records
 */
export const calculateSummaryStats = (records: CovidRecord[]) => {
  const rates = records
    .map((r) => r.monthly_rate)
    .filter((rate): rate is number => rate !== null);

  if (rates.length === 0) {
    return {
      count: 0,
      avgRate: 0,
      maxRate: 0,
      minRate: 0,
      totalRecords: records.length,
    };
  }

  return {
    count: rates.length,
    avgRate: rates.reduce((sum, rate) => sum + rate, 0) / rates.length,
    maxRate: Math.max(...rates),
    minRate: Math.min(...rates),
    totalRecords: records.length,
  };
};
