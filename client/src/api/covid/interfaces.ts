export interface CovidRecord {
  id: number;
  state: string;
  season: string;
  year_month: string;
  year: number | null;
  month: number | null;
  date: string | null;
  month_name: string | null;
  formatted_date: string;
  age_category: string;
  sex: string;
  race: string;
  monthly_rate: number | null;
  rate_type: string;
}

export interface CovidPagination {
  page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface CovidApiResponse {
  data: CovidRecord[];
  pagination: CovidPagination;
  filters?: Record<string, string | number | boolean | null>;
}

export interface StateSummary {
  state: string;
  total_records: number;
  date_range: {
    start: string | null;
    end: string | null;
  };
  statistics: {
    avg_rate: number;
    max_rate: number;
    min_rate: number;
    total_months: number;
  };
  seasons: string[];
  age_categories: string[];
}

export interface TrendData {
  year_month: string;
  date: string | null;
  formatted_date: string;
  avg_rate: number;
  max_rate: number;
  min_rate: number;
  count: number;
}

export interface FilterOptions {
  states: string[];
  seasons: string[];
  age_categories: string[];
  sex: string[];
  race: string[];
  date_range: {
    start: string | null;
    end: string | null;
  };
}

export interface CovidSearchParams {
  page?: number;
  per_page?: number;
  sort_by?:
    | "date"
    | "state"
    | "rate"
    | "season"
    | "age_category"
    | "sex"
    | "race";
  sort_order?: "asc" | "desc";
  state?: string;
  season?: string;
  age_category?: string;
  sex?: string;
  race?: string;
  min_rate?: number;
  max_rate?: number;
  start_date?: string;
  end_date?: string;
}

export interface TrendFilters {
  state?: string;
  season?: string;
  age_category?: string;
  sex?: string;
  race?: string;
  min_rate?: number;
  max_rate?: number;
  start_date?: string;
  end_date?: string;
}
