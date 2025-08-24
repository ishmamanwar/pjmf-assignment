import { useState, useEffect, useMemo } from "react";
import { USAMap } from "@mirawision/usa-map-react";
import type { USAStateAbbreviation } from "@mirawision/usa-map-react";
import { useCovid } from "../../api";
import { HeatMapFilters } from "../../components/HeatMapFilters";
import {
  calculateStateHeatMapData,
  getHeatMapColor,
  getHeatMapLegend,
  formatStateTooltip,
  STATE_CODE_TO_NAME,
} from "../../helpers/heatMapHelpers";
import type { CovidSearchParams } from "../../api";
import type { StateHeatMapData } from "../../helpers/heatMapHelpers";
import "./HeatMap.css";

export const HeatMap = () => {
  const { getAllRecords, loading, error } = useCovid();
  const [appliedFilters, setAppliedFilters] = useState<CovidSearchParams>({});
  const [stateData, setStateData] = useState<StateHeatMapData[]>([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<StateHeatMapData | null>(
    null
  );

  // Load state data based on filters
  useEffect(() => {
    const loadStateData = async () => {
      setMapLoading(true);
      try {
        // Get ALL records with current filters (no pagination)
        const records = await getAllRecords(appliedFilters);
        const heatMapData = calculateStateHeatMapData(records);
        setStateData(heatMapData);
      } catch (error) {
        console.error("Error loading state data:", error);
      } finally {
        setMapLoading(false);
      }
    };

    loadStateData();
  }, [getAllRecords, appliedFilters]);

  const handleFiltersChange = (filters: CovidSearchParams) => {
    setAppliedFilters(filters);
  };

  const handleStateClick = (stateCode: USAStateAbbreviation) => {
    const stateName = STATE_CODE_TO_NAME[stateCode];
    const stateInfo = stateData.find(
      (s) => s.state === stateName || s.stateCode === stateCode
    );
    setSelectedState(stateInfo || null);
  };

  // Create custom states configuration for the map
  const customStates = useMemo(() => {
    const settings: Record<string, any> = {};

    stateData.forEach((state) => {
      const color = getHeatMapColor(state.avgRate, state.hasData);

      settings[state.stateCode] = {
        fill: color,
        stroke: "#ffffff",
        onClick: () =>
          handleStateClick(state.stateCode as USAStateAbbreviation),
        tooltip: {
          enabled: true,
          render: () => (
            <div className="state-tooltip">{formatStateTooltip(state)}</div>
          ),
        },
      };
    });

    return settings;
  }, [stateData]);

  const legendData = getHeatMapLegend();

  if (loading && stateData.length === 0) {
    return (
      <div className="heatmap-content">
        <div className="loading-message">
          <h2>Loading map data...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="heatmap-content">
        <div className="error-message">
          <h2>Error Loading Map</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="heatmap-content">
      <div className="heatmap-layout">
        <aside className="filters-sidebar">
          <HeatMapFilters
            onFiltersChange={handleFiltersChange}
            initialFilters={appliedFilters}
          />
        </aside>

        <main className="heatmap-main">
          <div className="heatmap-header">
            <div className="heatmap-header-left">
              <h1>COVID-19 Hospitalization Map</h1>
              <p className="heatmap-subtitle">
                Interactive map showing average hospitalization rates by state.
                Use filters to explore specific demographics and time periods.
              </p>
            </div>
            <div className="heatmap-stats">
              <span className="total-states">
                {stateData.filter((s) => s.hasData).length} states with data
              </span>
            </div>
          </div>

          {mapLoading ? (
            <div className="map-loading">
              <div className="loading-spinner">Loading map...</div>
            </div>
          ) : (
            <div className="map-container">
              <div className="map-wrapper">
                <USAMap
                  customStates={customStates}
                  defaultState={{
                    fill: "#e6e7e8",
                    stroke: "#ffffff",
                  }}
                  mapSettings={{
                    width: "100%",
                    height: "auto",
                  }}
                  className="usa-heat-map"
                />
              </div>

              <div className="map-legend">
                <h4>Hospitalization Rate (per 100,000)</h4>
                <div className="legend-items">
                  {legendData.map((item, index) => (
                    <div key={index} className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="legend-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedState && (
            <div className="state-details">
              <h3>Selected State: {selectedState.state}</h3>
              <div className="state-stats">
                {selectedState.hasData ? (
                  <>
                    <div className="stat-item">
                      <span className="stat-label">Average Rate:</span>
                      <span className="stat-value">
                        {selectedState.avgRate.toFixed(1)}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Records:</span>
                      <span className="stat-value">
                        {selectedState.totalRecords.toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="no-data-info">
                    No hospitalization data available for {selectedState.state}{" "}
                    with current filters.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
