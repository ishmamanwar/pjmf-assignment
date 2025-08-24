# PJMF COVID-19 Data Dashboard

A full-stack web application built with React (TypeScript) frontend and Flask (Python) backend for visualizing and analyzing COVID-19 hospitalization data.

## Project Overview

This project consists of:

- **Frontend**: React 19 + TypeScript + Vite application with interactive data visualizations
- **Backend**: Flask 3.0 + Python REST API for COVID-19 data processing
- **Data**: COVID-19 hospitalization data from COVID-NET surveillance system
- **Features**: Data table with advanced filtering, trend analysis, interactive heat map

## Prerequisites

### Windows

1. **Python 3.11+**: Download from [python.org](https://python.org/downloads/)

   - During installation, check "Add Python to PATH"
   - Verify: Open Command Prompt and run `python --version`

2. **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)

   - Choose LTS version
   - Verify: Open Command Prompt and run `node --version` and `npm --version`

3. **Git**: Download from [git-scm.com](https://git-scm.com/)
   - Use default settings during installation
   - Verify: Open Command Prompt and run `git --version`

### macOS

1. **Python 3.11+**:

   - Install via Homebrew: `brew install python`
   - Or download from [python.org](https://python.org/downloads/)
   - Verify: `python3 --version`

2. **Node.js 18+**:

   - Install via Homebrew: `brew install node`
   - Or download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version` and `npm --version`

3. **Git**:
   - Install via Homebrew: `brew install git`
   - Or comes pre-installed on newer macOS versions
   - Verify: `git --version`

### Linux (Ubuntu/Debian)

1. **Python 3.11+**:

   ```bash
   sudo apt update
   sudo apt install python3 python3-pip python3-venv
   ```

   - Verify: `python3 --version`

2. **Node.js 18+**:

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

   - Verify: `node --version` and `npm --version`

3. **Git**:
   ```bash
   sudo apt install git
   ```
   - Verify: `git --version`

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ishmamanwar/pjmf-assignment.git
cd pjmf-assignment
```

### 2. Backend Setup (Flask Server)

#### Windows

```cmd
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

#### macOS/Linux

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

#### Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env file with your preferred editor
# Default values should work for local development
```

**Note**: The virtual environment is **required** to isolate project dependencies from your system Python installation, preventing conflicts between different projects.

### 3. Frontend Setup (React App)

#### All Platforms

```bash
cd client
npm install
```

#### Environment Configuration (Optional)

```bash
# Copy environment template (optional - fallback values are provided)
cp env.example .env.local

# Edit .env.local file to customize API URL if needed
# Default: VITE_API_BASE_URL=http://127.0.0.1:5001/api
```

**Note**: The frontend will automatically use `http://127.0.0.1:5001/api` as fallback if no environment file is configured.

## Running the Application

### 1. Start the Backend Server

#### Windows

```cmd
cd server
.venv\Scripts\activate
python run.py
```

#### macOS/Linux

```bash
cd server
source .venv/bin/activate
python run.py
```

**Expected Output:**

```
Starting PJMF Flask Server - COVID-19 Data Dashboard...
COVID data: ../data/rows.json
Server will be available at: http://127.0.0.1:5001

API endpoints:
   GET    /api/health

--- COVID-19 Hospitalization Data API ---
   GET    /api/covid
   GET    /api/covid/state/<state>
   GET    /api/covid/state/<state>/summary
   GET    /api/covid/trends
   GET    /api/covid/search
   GET    /api/covid/filters
   GET    /api/covid/health
   GET    /api/covid/all-records

Query parameters:
   ?page=1, ?per_page=50, ?sort_by=date, ?sort_order=desc
   ?state=<state>, ?season=<season>, ?age_category=<age>
   ?sex=<sex>, ?race=<race>, ?min_rate=<num>, ?max_rate=<num>
   ?start_date=<YYYY-MM-DD>, ?end_date=<YYYY-MM-DD>
```

### 2. Start the Frontend Development Server

#### All Platforms

```bash
cd client
npm run dev
```

**Expected Output:**

```
  VITE v7.1.3  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3. Access the Application

- **Frontend**: Open [http://localhost:5173](http://localhost:5173) in your browser
- **Backend API**: Available at [http://127.0.0.1:5001/api](http://127.0.0.1:5001/api)

## Application Features

### Pages

1. **Home**: Welcome page with dashboard overview
2. **Data**: Interactive data table with:
   - State search bar
   - Advanced filtering (season, demographics, date ranges)
   - Sortable columns
   - Pagination
3. **Trends**: Data visualization with charts showing:
   - Hospitalization rate trends over time
   - Month-to-month comparisons
4. **Heat Map**: Interactive USA map showing:
   - State-level hospitalization rates
   - Color-coded visualization
   - Demographic and temporal filtering

### Data Features

- **Advanced Search**: Filter by state, season, age category, sex, race/ethnicity, rate ranges, and date ranges
- **Sorting**: Sort by any column in ascending or descending order
- **Pagination**: Navigate through large datasets efficiently
- **Trend Analysis**: Visualize patterns over time with interactive charts
- **Geographic Visualization**: Heat map showing state-level data

## Project Structure

```
pjmf-assignment/
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/              # API integration (COVID data)
│   │   │   └── covid/        # COVID-specific API hooks
│   │   ├── components/       # Reusable React components
│   │   │   ├── AdvancedFilters/
│   │   │   ├── Header/
│   │   │   ├── HeatMapFilters/
│   │   │   └── Modal/
│   │   ├── helpers/          # Utility functions
│   │   ├── pages/            # Page components
│   │   │   ├── Data/         # Data table page
│   │   │   ├── HeatMap/      # Interactive map page
│   │   │   ├── Home/         # Welcome page
│   │   │   └── Trends/       # Charts and visualization
│   │   └── styles/           # CSS styles with PJMF design tokens
│   ├── package.json          # Node.js dependencies
│   └── env.example           # Frontend environment template
├── server/                    # Flask backend
│   ├── app/
│   │   ├── routes/           # API route definitions
│   │   │   └── covid.py      # COVID data endpoints
│   │   ├── services/         # Business logic
│   │   │   └── covid_service.py
│   │   └── utils/            # Utility functions
│   │       └── covid_data_parser.py
│   ├── requirements.txt       # Python dependencies
│   ├── run.py                # Server entry point
│   └── env.example           # Backend environment template
├── data/                      # Data storage
│   └── rows.json             # COVID-19 hospitalization data
└── README.md                 # This file
```

## API Endpoints

### Health Check

| Method | Endpoint      | Description              |
| ------ | ------------- | ------------------------ |
| GET    | `/api/health` | Application health check |

### COVID-19 Data

| Method | Endpoint                           | Description                       |
| ------ | ---------------------------------- | --------------------------------- |
| GET    | `/api/covid`                       | Get paginated COVID data          |
| GET    | `/api/covid/all-records`           | Get all records (for aggregation) |
| GET    | `/api/covid/state/<state>`         | Get data for specific state       |
| GET    | `/api/covid/state/<state>/summary` | Get summary statistics for state  |
| GET    | `/api/covid/trends`                | Get trend analysis data           |
| GET    | `/api/covid/search`                | Advanced search with filters      |
| GET    | `/api/covid/filters`               | Get available filter options      |
| GET    | `/api/covid/health`                | COVID data service health check   |

### Query Parameters

- **Pagination**: `?page=1&per_page=50`
- **Sorting**: `?sort_by=date&sort_order=desc`
- **Filtering**: `?state=<state>&season=<season>&age_category=<age>`
- **Demographics**: `?sex=<sex>&race=<race>`
- **Rate Range**: `?min_rate=<num>&max_rate=<num>`
- **Date Range**: `?start_date=<YYYY-MM-DD>&end_date=<YYYY-MM-DD>`

## Development

### Backend Development

- The Flask server runs in debug mode by default
- Changes to Python files will automatically reload the server
- API endpoints are defined in `server/app/routes/covid.py`
- Business logic is in `server/app/services/covid_service.py`
- Data parsing utilities in `server/app/utils/covid_data_parser.py`

### Frontend Development

- React app uses Vite for fast development
- Hot module replacement enabled
- TypeScript for type safety
- Components follow PJMF design system with custom CSS tokens
- Charts built with @mui/x-charts
- Interactive map using @mirawision/usa-map-react

### Data Management

- COVID-19 data is stored in `data/rows.json`
- Data is parsed from Socrata JSON format
- Backend provides filtering, sorting, and aggregation
- Frontend caches data for better performance

## Troubleshooting

### Common Issues

#### Port Already in Use

If you get "port already in use" errors:

- **Backend**: Change the port in `server/.env` file (default: 5001)
- **Frontend**: Vite will automatically suggest an alternative port (default: 5173)

#### Python Virtual Environment Issues

- Ensure you're in the `server` directory
- Activate the virtual environment before running the server
- Windows: `.venv\Scripts\activate`
- macOS/Linux: `source .venv/bin/activate`

#### Node Modules Issues

- Delete `client/node_modules` folder
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

#### CORS Issues

- Ensure the backend server is running
- The backend has CORS enabled by default for all origins
- Check console for specific CORS error messages

#### Environment Variable Issues

- Frontend: API base URL fallback is `http://127.0.0.1:5001/api`
- Backend: Default values are provided for all environment variables
- Verify `.env` files are properly formatted (no spaces around `=`)

#### Data Loading Issues

- Ensure `data/rows.json` exists and is readable
- Check server console for data parsing errors
- Verify file permissions on data directory

### Getting Help

- Check the console output for error messages
- Verify all environment variables are set correctly
- Ensure both frontend and backend servers are running
- Check that the data file `data/rows.json` exists and is readable
- Verify Python virtual environment is activated
- Check Node.js and Python versions meet requirements

## Technologies Used

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **@mui/x-charts** - Data visualization
- **@mirawision/usa-map-react** - Interactive USA map
- **Axios** - HTTP client
- **CSS3** with PJMF design tokens

### Backend

- **Flask 3.0** - Web framework
- **Python 3.11+** - Programming language
- **Flask-CORS** - Cross-origin resource sharing

### Data & Development

- **JSON** - Data storage format
- **Git** - Version control
- **npm** - Frontend package management
- **pip** - Python package management
- **Virtual environments** - Dependency isolation

## Author

Created by **Ishmam Anwar** as part of the PJMF assignment.

## License

This project is part of the PJMF assignment.
