import { Link } from "react-router-dom";
import "./Home.css";

export const Home = () => {
  return (
    <div className="home-content">
      <div className="welcome-section">
        <h1>Welcome to PJMF COVID-19 Data Dashboard</h1>
        <p className="welcome-description">
          This dashboard provides comprehensive access to monthly COVID-19
          hospitalization data from the COVID-NET surveillance system. Explore
          trends, analyze state-specific data, and gain insights from
          laboratory-confirmed COVID-19 hospitalizations across the United
          States.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Comprehensive Data</h3>
            <p>
              Access monthly hospitalization rates with detailed demographic
              breakdowns including age, sex, and race categories.
            </p>
          </div>

          <div className="feature-card">
            <h3>State-Specific Analysis</h3>
            <p>
              View trends and statistics for individual states to understand
              regional patterns in COVID-19 hospitalizations.
            </p>
          </div>

          <div className="feature-card">
            <h3>Advanced Filtering</h3>
            <p>
              Filter data by time periods, demographics, and hospitalization
              rates to focus on specific population segments.
            </p>
          </div>

          <div className="feature-card">
            <h3>Interactive Visualizations</h3>
            <p>
              Explore data through sortable tables and trend analysis tools to
              identify patterns over time.
            </p>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/data" className="cta-button">
            Explore COVID-19 Data
          </Link>
        </div>

        <div className="data-source">
          <p>
            <strong>Data Source:</strong> Monthly rates of laboratory-confirmed
            COVID-19 hospitalizations from the COVID-NET surveillance system,
            sourced from{" "}
            <a
              href="https://catalog.data.gov/dataset/monthly-rates-of-laboratory-confirmed-covid-19-hospitalizations-from-the-covid-net-surveil"
              target="_blank"
              rel="noopener noreferrer"
              className="data-link"
            >
              Data.gov
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
