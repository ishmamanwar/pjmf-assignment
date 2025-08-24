import { useState, useCallback } from "react";
import axios from "axios";
import type {
  CovidRecord,
  CovidApiResponse,
  StateSummary,
  TrendData,
  FilterOptions,
  CovidSearchParams,
  TrendFilters,
} from "./interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useCovid = () => {
  const [data, setData] = useState<CovidRecord[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 50,
    total_records: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCovidData = useCallback(async (params: CovidSearchParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();

      // Add pagination params
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.per_page)
        searchParams.append("per_page", params.per_page.toString());

      // Add sorting params
      if (params.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params.sort_order)
        searchParams.append("sort_order", params.sort_order);

      const response = await api.get<CovidApiResponse>(
        `/covid?${searchParams.toString()}`
      );
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError("Failed to fetch COVID data");
      console.error("Error fetching COVID data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStateData = useCallback(
    async (state: string, params: CovidSearchParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.per_page)
          searchParams.append("per_page", params.per_page.toString());
        if (params.sort_by) searchParams.append("sort_by", params.sort_by);
        if (params.sort_order)
          searchParams.append("sort_order", params.sort_order);

        const response = await api.get<CovidApiResponse>(
          `/covid/state/${encodeURIComponent(state)}?${searchParams.toString()}`
        );
        setData(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(`Failed to fetch data for ${state}`);
        console.error(`Error fetching state data for ${state}:`, err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getStateSummary = useCallback(
    async (state: string): Promise<StateSummary | null> => {
      try {
        setError(null);
        const response = await api.get<StateSummary>(
          `/covid/state/${encodeURIComponent(state)}/summary`
        );
        return response.data;
      } catch (err) {
        setError(`Failed to fetch summary for ${state}`);
        console.error(`Error fetching state summary for ${state}:`, err);
        return null;
      }
    },
    []
  );

  const getTrends = useCallback(
    async (filters: TrendFilters = {}): Promise<TrendData[]> => {
      try {
        setError(null);

        const searchParams = new URLSearchParams();
        if (filters.state) searchParams.append("state", filters.state);
        if (filters.age_category)
          searchParams.append("age_category", filters.age_category);
        if (filters.sex) searchParams.append("sex", filters.sex);
        if (filters.race) searchParams.append("race", filters.race);

        const response = await api.get<{
          data: TrendData[];
          filters: TrendFilters;
        }>(`/covid/trends?${searchParams.toString()}`);
        return response.data.data;
      } catch (err) {
        setError("Failed to fetch trend data");
        console.error("Error fetching trend data:", err);
        return [];
      }
    },
    []
  );

  const advancedSearch = useCallback(async (params: CovidSearchParams) => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();

      // Add all possible search parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });

      const response = await api.get<CovidApiResponse>(
        `/covid/search?${searchParams.toString()}`
      );
      setData(response.data.data);
      setPagination(response.data.pagination);
      return response.data;
    } catch (err) {
      setError("Failed to perform advanced search");
      console.error("Error performing advanced search:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFilterOptions =
    useCallback(async (): Promise<FilterOptions | null> => {
      try {
        setError(null);
        const response = await api.get<FilterOptions>("/covid/filters");
        return response.data;
      } catch (err) {
        setError("Failed to fetch filter options");
        console.error("Error fetching filter options:", err);
        return null;
      }
    }, []);

  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      await api.get("/covid/health");
      return true;
    } catch (err) {
      console.error("COVID API health check failed:", err);
      return false;
    }
  }, []);

  // Utility functions for data manipulation
  const getUniqueStates = useCallback((): string[] => {
    const states = data.map((record) => record.state).filter(Boolean);
    return [...new Set(states)].sort();
  }, [data]);

  const getUniqueSeasons = useCallback((): string[] => {
    const seasons = data.map((record) => record.season).filter(Boolean);
    return [...new Set(seasons)].sort();
  }, [data]);

  const getDateRange = useCallback((): {
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
  }, [data]);

  const getAverageRate = useCallback(
    (records: CovidRecord[] = data): number => {
      const rates = records
        .map((record) => record.monthly_rate)
        .filter((rate): rate is number => rate !== null);
      return rates.length > 0
        ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length
        : 0;
    },
    [data]
  );

  return {
    // State
    data,
    pagination,
    loading,
    error,

    // Main data fetching
    fetchCovidData,
    fetchStateData,

    // Specific data operations
    getStateSummary,
    getTrends,
    advancedSearch,
    getFilterOptions,
    checkHealth,

    // Utility functions
    getUniqueStates,
    getUniqueSeasons,
    getDateRange,
    getAverageRate,
  };
};
