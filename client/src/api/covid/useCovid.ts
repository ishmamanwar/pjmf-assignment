import { useState, useCallback } from "react";
import axios from "axios";
import {
  getUniqueStates,
  getUniqueSeasons,
  getDateRange,
  getAverageRate,
} from "../../helpers";
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

        // Add all possible filter parameters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value.toString());
          }
        });

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

  // Utility functions for data manipulation (using helpers)
  const getDataUniqueStates = useCallback((): string[] => {
    return getUniqueStates(data);
  }, [data]);

  const getDataUniqueSeasons = useCallback((): string[] => {
    return getUniqueSeasons(data);
  }, [data]);

  const getDataDateRange = useCallback((): {
    start: string | null;
    end: string | null;
  } => {
    return getDateRange(data);
  }, [data]);

  const getDataAverageRate = useCallback(
    (records: CovidRecord[] = data): number => {
      return getAverageRate(records);
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
    getUniqueStates: getDataUniqueStates,
    getUniqueSeasons: getDataUniqueSeasons,
    getDateRange: getDataDateRange,
    getAverageRate: getDataAverageRate,
  };
};
