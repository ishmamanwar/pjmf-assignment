import { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useCovid } from "../../api";
import { AdvancedFilters } from "../../components";
import {
  transformForLineChart,
  transformForBarChart,
  getPJMFChartColors,
  getChartStyling,
} from "../../helpers";
import type { CovidSearchParams, TrendData } from "../../api";
import "./Trends.css";

export const Trends = () => {
  const { getTrends, loading, error } = useCovid();

  const [appliedFilters, setAppliedFilters] = useState<CovidSearchParams>({});
  const [trendsData, setTrendsData] = useState<TrendData[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  // Load initial trends data
  useEffect(() => {
    const loadTrendsData = async () => {
      setChartLoading(true);
      try {
        // Convert CovidSearchParams to TrendFilters format
        const trendFilters = {
          state: appliedFilters.state,
          season: appliedFilters.season,
          age_category: appliedFilters.age_category,
          sex: appliedFilters.sex,
          race: appliedFilters.race,
          min_rate: appliedFilters.min_rate,
          max_rate: appliedFilters.max_rate,
          start_date: appliedFilters.start_date,
          end_date: appliedFilters.end_date,
        };

        const trends = await getTrends(trendFilters);
        setTrendsData(trends);
      } catch (error) {
        console.error("Error loading trends data:", error);
      } finally {
        setChartLoading(false);
      }
    };

    loadTrendsData();
  }, [getTrends, appliedFilters]);

  const handleFiltersChange = (filters: CovidSearchParams) => {
    setAppliedFilters(filters);
  };

  // Transform data using helpers
  const lineChartData = transformForLineChart(trendsData);
  const barChartData = transformForBarChart(trendsData, 12);
  const chartColors = getPJMFChartColors();
  const chartStyling = getChartStyling();

  if (loading && trendsData.length === 0) {
    return (
      <div className="trends-content">
        <div className="loading-message">
          <h2>Loading trends data...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trends-content">
        <div className="error-message">
          <h2>Error Loading Trends</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trends-content">
      <div className="trends-layout">
        <aside className="filters-sidebar">
          <AdvancedFilters
            onFiltersChange={handleFiltersChange}
            initialFilters={appliedFilters}
          />
        </aside>

        <main className="trends-main">
          <div className="trends-header">
            <div className="trends-header-left">
              <h1>COVID-19 Hospitalization Trends</h1>
              <p className="trends-subtitle">
                Analyze hospitalization rate patterns over time and compare
                recent months. Use the filters to explore specific demographics,
                regions, and time periods.
              </p>
            </div>
            <div className="trends-stats">
              <span className="total-periods">
                {trendsData.length} time periods analyzed
              </span>
            </div>
          </div>

          {chartLoading ? (
            <div className="charts-loading">
              <div className="loading-spinner">Loading charts...</div>
            </div>
          ) : (
            <div className="charts-container">
              {/* Time Series Line Chart */}
              <div className="chart-section">
                <h3>Hospitalization Rate Trends Over Time</h3>
                <div className="chart-wrapper">
                  {lineChartData.length > 0 ? (
                    <LineChart
                      width={800}
                      height={400}
                      series={[
                        {
                          data: lineChartData.map((d) => d.y),
                          label: "Average Rate",
                          color: chartColors.primary,
                        },
                      ]}
                      xAxis={[
                        {
                          data: lineChartData.map((d) => d.x),
                          scaleType: "time",
                          valueFormatter: (value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            });
                          },
                        },
                      ]}
                      yAxis={[
                        {
                          label: "Hospitalization Rate",
                        },
                      ]}
                      margin={{ left: 80, right: 30, top: 30, bottom: 80 }}
                      sx={chartStyling}
                    />
                  ) : (
                    <div className="no-data-message">
                      No trend data available for the selected filters.
                    </div>
                  )}
                </div>
              </div>

              {/* Bar Chart for Recent Months */}
              <div className="chart-section">
                <h3>Recent Months Comparison</h3>
                <div className="chart-wrapper">
                  {barChartData.length > 0 ? (
                    <BarChart
                      width={800}
                      height={400}
                      series={[
                        {
                          data: barChartData.map((d) => d.avg_rate),
                          label: "Average Rate",
                          color: chartColors.accent2,
                        },
                        {
                          data: barChartData.map((d) => d.max_rate),
                          label: "Max Rate",
                          color: chartColors.tertiary,
                        },
                        {
                          data: barChartData.map((d) => d.min_rate),
                          label: "Min Rate",
                          color: chartColors.quaternary,
                        },
                      ]}
                      xAxis={[
                        {
                          data: barChartData.map((d) => d.month),
                          scaleType: "band",
                        },
                      ]}
                      yAxis={[
                        {
                          label: "Hospitalization Rate",
                        },
                      ]}
                      margin={{ left: 80, right: 30, top: 30, bottom: 120 }}
                      sx={chartStyling}
                    />
                  ) : (
                    <div className="no-data-message">
                      No recent data available for comparison.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
