import { useState, useEffect } from "react";
import { useCovid } from "../../api";
import { AdvancedFilters } from "../../components";
import { formatDisplayDate, formatRate } from "../../helpers";
import type { CovidSearchParams } from "../../api";
import "./Data.css";

export const Data = () => {
  const { data, pagination, loading, error, fetchCovidData, advancedSearch } =
    useCovid();

  const [searchParams, setSearchParams] = useState<CovidSearchParams>({
    page: 1,
    per_page: 50,
    sort_by: "date",
    sort_order: "desc",
  });

  const [appliedFilters, setAppliedFilters] = useState<CovidSearchParams>({});
  const [stateSearch, setStateSearch] = useState<string>("");

  useEffect(() => {
    const finalParams = { ...searchParams, ...appliedFilters };
    if (Object.keys(appliedFilters).length > 0) {
      advancedSearch(finalParams);
    } else {
      fetchCovidData(searchParams);
    }
  }, [searchParams, appliedFilters, fetchCovidData, advancedSearch]);

  // Using helper function for date formatting

  // Using helper function for rate formatting

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleFiltersChange = (filters: CovidSearchParams) => {
    setAppliedFilters(filters);
    setSearchParams((prev) => ({ ...prev, page: 1 })); // Reset to first page when filters change
  };

  const handleStateSearch = (searchValue: string) => {
    setStateSearch(searchValue);
  };

  const handleStateSearchSubmit = (
    e?: React.FormEvent | React.KeyboardEvent
  ) => {
    if (e) {
      e.preventDefault();
    }

    // Apply state filter
    if (stateSearch.trim()) {
      const newFilters = { ...appliedFilters, state: stateSearch.trim() };
      setAppliedFilters(newFilters);
    } else {
      // Remove state filter if search is empty
      const { state, ...filtersWithoutState } = appliedFilters;
      setAppliedFilters(filtersWithoutState);
    }
    setSearchParams((prev) => ({ ...prev, page: 1 }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleStateSearchSubmit(e);
    }
  };

  const clearStateSearch = () => {
    setStateSearch("");
    const { state, ...filtersWithoutState } = appliedFilters;
    setAppliedFilters(filtersWithoutState);
    setSearchParams((prev) => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (sortBy: CovidSearchParams["sort_by"]) => {
    setSearchParams((prev) => ({
      ...prev,
      sort_by: sortBy,
      sort_order:
        prev.sort_by === sortBy && prev.sort_order === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const getSortIcon = (column: CovidSearchParams["sort_by"]) => {
    if (searchParams.sort_by !== column) return "";
    return searchParams.sort_order === "asc" ? " ↑" : " ↓";
  };

  if (loading && data.length === 0) {
    return (
      <div className="data-content">
        <div className="loading-message">
          <h2>Loading COVID-19 data...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-content">
        <div className="error-message">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button
            onClick={() => fetchCovidData(searchParams)}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="data-content">
      <div className="data-layout">
        <aside className="filters-sidebar">
          <AdvancedFilters
            onFiltersChange={handleFiltersChange}
            initialFilters={appliedFilters}
          />
        </aside>

        <main className="data-main">
          <div className="data-header">
            <div className="data-header-left">
              <h1>COVID-19 Hospitalization Data</h1>
              <p className="data-subtitle">
                Monthly rates of laboratory-confirmed COVID-19 hospitalizations
                from the COVID-NET surveillance system.
              </p>
            </div>
            <div className="data-stats">
              <span className="total-records">
                {pagination.total_records.toLocaleString()} total records
              </span>
            </div>
          </div>

          <div className="state-search-container">
            <div className="state-search-wrapper">
              <form
                onSubmit={handleStateSearchSubmit}
                className="state-search-form"
              >
                <div className="state-search-input-container">
                  <input
                    type="text"
                    value={stateSearch}
                    onChange={(e) => handleStateSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search by state... (Press Enter to filter)"
                    className="state-search-input"
                  />
                  {stateSearch && (
                    <button
                      type="button"
                      onClick={clearStateSearch}
                      className="clear-search-button"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="table-container">
            <div className="table-wrapper">
              <table className="covid-table">
                <thead>
                  <tr>
                    <th
                      className="sortable-header"
                      onClick={() => handleSortChange("state")}
                    >
                      State {getSortIcon("state")}
                    </th>
                    <th
                      className="sortable-header"
                      onClick={() => handleSortChange("date")}
                    >
                      Date {getSortIcon("date")}
                    </th>
                    <th
                      className="sortable-header"
                      onClick={() => handleSortChange("season")}
                    >
                      Season {getSortIcon("season")}
                    </th>
                    <th
                      className="sortable-header"
                      onClick={() => handleSortChange("age_category")}
                    >
                      Age Category {getSortIcon("age_category")}
                    </th>
                    <th
                      className="sortable-header"
                      onClick={() => handleSortChange("sex")}
                    >
                      Sex {getSortIcon("sex")}
                    </th>
                    <th
                      className="sortable-header"
                      onClick={() => handleSortChange("race")}
                    >
                      Race {getSortIcon("race")}
                    </th>
                    <th
                      className="sortable-header"
                      onClick={() => handleSortChange("rate")}
                    >
                      Monthly Rate {getSortIcon("rate")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((record) => (
                    <tr key={record.id} className="table-row">
                      <td className="state-cell">{record.state}</td>
                      <td className="date-cell">
                        {formatDisplayDate(record.date)}
                      </td>
                      <td className="season-cell">{record.season}</td>
                      <td className="age-cell">{record.age_category}</td>
                      <td className="sex-cell">{record.sex}</td>
                      <td className="race-cell">{record.race}</td>
                      <td className="rate-cell">
                        {formatRate(record.monthly_rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {loading && (
              <div className="loading-overlay">
                <div className="loading-spinner">Loading...</div>
              </div>
            )}
          </div>

          <div className="pagination-container">
            <div className="pagination-info">
              Showing {(pagination.page - 1) * pagination.per_page + 1} to{" "}
              {Math.min(
                pagination.page * pagination.per_page,
                pagination.total_records
              )}{" "}
              of {pagination.total_records.toLocaleString()} records
            </div>

            <div className="pagination-controls">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.has_prev}
                className="pagination-button"
              >
                Previous
              </button>

              <div className="page-numbers">
                {Array.from(
                  { length: Math.min(5, pagination.total_pages) },
                  (_, i) => {
                    const startPage = Math.max(1, pagination.page - 2);
                    const pageNum = startPage + i;

                    if (pageNum > pagination.total_pages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`page-number ${
                          pagination.page === pageNum ? "active" : ""
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}

                {pagination.total_pages > 5 &&
                  pagination.page < pagination.total_pages - 2 && (
                    <>
                      <span className="page-dots">...</span>
                      <button
                        onClick={() => handlePageChange(pagination.total_pages)}
                        className="page-number"
                      >
                        {pagination.total_pages}
                      </button>
                    </>
                  )}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.has_next}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
