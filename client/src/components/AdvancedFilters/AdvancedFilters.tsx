import { useState, useEffect } from "react";
import { useCovid } from "../../api";
import type { CovidSearchParams } from "../../api";
import "./AdvancedFilters.css";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: CovidSearchParams) => void;
  initialFilters?: CovidSearchParams;
}

export const AdvancedFilters = ({
  onFiltersChange,
  initialFilters,
}: AdvancedFiltersProps) => {
  const { getFilterOptions } = useCovid();

  const [filterOptions, setFilterOptions] = useState<{
    states: string[];
    seasons: string[];
    age_categories: string[];
    sex: string[];
    race: string[];
  } | null>(null);

  const [filters, setFilters] = useState<CovidSearchParams>({
    state: initialFilters?.state || "",
    season: initialFilters?.season || "",
    age_category: initialFilters?.age_category || "",
    sex: initialFilters?.sex || "",
    race: initialFilters?.race || "",
    min_rate: initialFilters?.min_rate || undefined,
    max_rate: initialFilters?.max_rate || undefined,
    start_date: initialFilters?.start_date || "",
    end_date: initialFilters?.end_date || "",
  });

  useEffect(() => {
    const loadFilterOptions = async () => {
      const options = await getFilterOptions();
      if (options) {
        setFilterOptions({
          states: options.states,
          seasons: options.seasons,
          age_categories: options.age_categories,
          sex: options.sex || [],
          race: options.race || [],
        });
      }
    };

    loadFilterOptions();
  }, [getFilterOptions]);

  const handleFilterChange = (
    key: keyof CovidSearchParams,
    value: string | number | undefined
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Remove empty values before sending
    const cleanFilters: CovidSearchParams = {};
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== "" && v !== undefined && v !== null) {
        (cleanFilters as any)[k] = v;
      }
    });

    onFiltersChange(cleanFilters);
  };

  const handleReset = () => {
    const resetFilters: CovidSearchParams = {
      state: "",
      season: "",
      age_category: "",
      sex: "",
      race: "",
      min_rate: undefined,
      max_rate: undefined,
      start_date: "",
      end_date: "",
    };

    setFilters(resetFilters);
    onFiltersChange({});
  };

  return (
    <div className="advanced-filters">
      <div className="filters-header">
        <h3>Advanced Filters</h3>
        <button onClick={handleReset} className="reset-button">
          Reset All
        </button>
      </div>

      <div className="filter-section">
        <h4>Location & Time</h4>

        <div className="filter-group">
          <label htmlFor="state-filter">State</label>
          <select
            id="state-filter"
            value={filters.state || ""}
            onChange={(e) => handleFilterChange("state", e.target.value)}
            className="filter-select"
          >
            <option value="">All States</option>
            {filterOptions?.states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="season-filter">Season</label>
          <select
            id="season-filter"
            value={filters.season || ""}
            onChange={(e) => handleFilterChange("season", e.target.value)}
            className="filter-select"
          >
            <option value="">All Seasons</option>
            {filterOptions?.seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>

        <div className="date-range">
          <div className="filter-group">
            <label htmlFor="start-date">Start Date</label>
            <input
              id="start-date"
              type="date"
              value={filters.start_date || ""}
              onChange={(e) => handleFilterChange("start_date", e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="end-date">End Date</label>
            <input
              id="end-date"
              type="date"
              value={filters.end_date || ""}
              onChange={(e) => handleFilterChange("end_date", e.target.value)}
              className="filter-input"
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4>Demographics</h4>

        <div className="filter-group">
          <label htmlFor="age-filter">Age Category</label>
          <select
            id="age-filter"
            value={filters.age_category || ""}
            onChange={(e) => handleFilterChange("age_category", e.target.value)}
            className="filter-select"
          >
            <option value="">All Ages</option>
            {filterOptions?.age_categories
              .filter((age) => age.toLowerCase() !== "all")
              .map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sex-filter">Sex</label>
          <select
            id="sex-filter"
            value={filters.sex || ""}
            onChange={(e) => handleFilterChange("sex", e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            {filterOptions?.sex
              .filter((sexValue) => sexValue.toLowerCase() !== "all")
              .map((sexValue) => (
                <option key={sexValue} value={sexValue}>
                  {sexValue}
                </option>
              ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="race-filter">Race/Ethnicity</label>
          <select
            id="race-filter"
            value={filters.race || ""}
            onChange={(e) => handleFilterChange("race", e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            {filterOptions?.race
              .filter((raceValue) => raceValue.toLowerCase() !== "all")
              .map((raceValue) => (
                <option key={raceValue} value={raceValue}>
                  {raceValue}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="filter-section">
        <h4>Hospitalization Rate</h4>

        <div className="rate-range">
          <div className="filter-group">
            <label htmlFor="min-rate">Minimum Rate</label>
            <input
              id="min-rate"
              type="number"
              step="0.1"
              min="0"
              value={filters.min_rate || ""}
              onChange={(e) =>
                handleFilterChange(
                  "min_rate",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              className="filter-input"
              placeholder="0.0"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="max-rate">Maximum Rate</label>
            <input
              id="max-rate"
              type="number"
              step="0.1"
              min="0"
              value={filters.max_rate || ""}
              onChange={(e) =>
                handleFilterChange(
                  "max_rate",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              className="filter-input"
              placeholder="1000.0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
