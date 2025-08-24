import { useState, useEffect } from "react";
import { useCovid } from "../../api";
import type { CovidSearchParams } from "../../api";
import "./HeatMapFilters.css";

interface HeatMapFiltersProps {
  onFiltersChange: (filters: CovidSearchParams) => void;
  initialFilters?: CovidSearchParams;
}

export const HeatMapFilters = ({
  onFiltersChange,
  initialFilters,
}: HeatMapFiltersProps) => {
  const { getFilterOptions } = useCovid();
  const [filterOptions, setFilterOptions] = useState<{
    seasons: string[];
    age_categories: string[];
    sex: string[];
    race: string[];
  } | null>(null);

  const [filters, setFilters] = useState<CovidSearchParams>({
    season: initialFilters?.season || "",
    age_category: initialFilters?.age_category || "",
    sex: initialFilters?.sex || "",
    race: initialFilters?.race || "",
    start_date: initialFilters?.start_date || "",
    end_date: initialFilters?.end_date || "",
  });

  useEffect(() => {
    const loadFilterOptions = async () => {
      const options = await getFilterOptions();
      if (options) {
        setFilterOptions({
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

    // Clean filters before sending
    const cleanFilters: CovidSearchParams = {};
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== "" && v !== undefined && v !== null) {
        (cleanFilters as any)[k] = v;
      }
    });

    onFiltersChange(cleanFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      season: "",
      age_category: "",
      sex: "",
      race: "",
      start_date: "",
      end_date: "",
    };
    setFilters(resetFilters);
    onFiltersChange({});
  };

  return (
    <div className="heatmap-filters">
      <div className="filters-header">
        <h3>Map Filters</h3>
        <button onClick={handleReset} className="reset-button">
          Reset Filters
        </button>
      </div>

      <div className="filter-section">
        <h4>Time Period</h4>
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
            <label htmlFor="start-date-filter">Start Date</label>
            <input
              type="date"
              id="start-date-filter"
              value={filters.start_date || ""}
              onChange={(e) => handleFilterChange("start_date", e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="end-date-filter">End Date</label>
            <input
              type="date"
              id="end-date-filter"
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
    </div>
  );
};
