# COVID Data Hook Usage Examples

## Basic Usage

```tsx
import { useCovid } from "../api/covid";

function CovidDashboard() {
  const {
    data,
    pagination,
    loading,
    error,
    fetchCovidData,
    fetchStateData,
    getStateSummary,
    getTrends,
  } = useCovid();

  // Fetch initial data
  useEffect(() => {
    fetchCovidData({
      page: 1,
      per_page: 50,
      sort_by: "date",
      sort_order: "desc",
    });
  }, [fetchCovidData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>COVID-19 Hospitalization Data</h1>
      {data.map((record) => (
        <div key={record.id}>
          {record.state} - {record.formatted_date}: {record.monthly_rate}
        </div>
      ))}
    </div>
  );
}
```

## State-specific Data

```tsx
function StateView({ stateName }: { stateName: string }) {
  const { data, loading, error, fetchStateData, getStateSummary } = useCovid();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchStateData(stateName, { page: 1, per_page: 100 });
    getStateSummary(stateName).then(setSummary);
  }, [stateName, fetchStateData, getStateSummary]);

  return (
    <div>
      <h2>{stateName} COVID Data</h2>
      {summary && (
        <div>
          <p>Average Rate: {summary.statistics.avg_rate}</p>
          <p>Total Records: {summary.total_records}</p>
        </div>
      )}
      {/* Render data table */}
    </div>
  );
}
```

## Trends Visualization

```tsx
function TrendsChart({ state }: { state?: string }) {
  const { getTrends, error } = useCovid();
  const [trendsData, setTrendsData] = useState([]);

  useEffect(() => {
    getTrends({ state }).then(setTrendsData);
  }, [state, getTrends]);

  return (
    <div>
      <h3>Trends Over Time</h3>
      {/* Render chart with trendsData */}
    </div>
  );
}
```

## Advanced Search

```tsx
function AdvancedSearch() {
  const { advancedSearch, data, loading } = useCovid();

  const handleSearch = () => {
    advancedSearch({
      state: "California",
      age_category: "All",
      min_rate: 10,
      max_rate: 100,
      start_date: "2021-01-01",
      end_date: "2023-12-31",
      sort_by: "rate",
      sort_order: "desc",
    });
  };

  return (
    <div>
      <button onClick={handleSearch}>Search</button>
      {/* Render results */}
    </div>
  );
}
```

## Filter Options

```tsx
function FilterDropdowns() {
  const { getFilterOptions } = useCovid();
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    getFilterOptions().then(setFilters);
  }, [getFilterOptions]);

  return (
    <div>
      {filters && (
        <>
          <select>
            {filters.states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select>
            {filters.seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}
```
