# PJMF Assignment

A full-stack web application built with React (TypeScript) frontend and Flask (Python) backend for managing users.

## Project Overview

This project consists of:

- **Frontend**: React 19 + TypeScript + Vite application
- **Backend**: Flask 3.0 + Python REST API
- **Data**: JSON-based data storage
- **Features**: User CRUD operations, search, and filtering

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

### 3. Frontend Setup (React App)

#### All Platforms

```bash
cd client
npm install
```

#### Environment Configuration

```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local file with your preferred editor
# Default values should work for local development
```

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
Starting PJMF Flask Server...
Using data from: ../data/users.json
Server will be available at: http://127.0.0.1:5001
API endpoints:
   GET    /api/health
   GET    /api/users
   GET    /api/users/<id>
   POST   /api/users
   PUT    /api/users/<id>
   DELETE /api/users/<id>
Query parameters:
   ?search=<query>  - Search by name or role
   ?role=<role>     - Filter by role
```

### 2. Start the Frontend Development Server

#### All Platforms

```bash
cd client
npm run dev
```

**Expected Output:**

```
  VITE v7.1.2  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3. Access the Application

- **Frontend**: Open [http://localhost:5173](http://localhost:5173) in your browser
- **Backend API**: Available at [http://127.0.0.1:5001/api](http://127.0.0.1:5001/api)

## Project Structure

```
pjmf-assignment/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API integration
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── styles/        # CSS styles
│   ├── package.json       # Node.js dependencies
│   └── env.example        # Frontend environment template
├── server/                 # Flask backend
│   ├── app/
│   │   ├── routes/        # API route definitions
│   │   └── services/      # Business logic
│   ├── requirements.txt    # Python dependencies
│   ├── run.py             # Server entry point
│   └── env.example        # Backend environment template
├── data/                   # Data storage
│   └── users.json         # User data
└── README.md              # This file
```

## API Endpoints

| Method | Endpoint          | Description                                       |
| ------ | ----------------- | ------------------------------------------------- |
| GET    | `/api/health`     | Health check endpoint                             |
| GET    | `/api/users`      | Get all users (with optional search/role filters) |
| GET    | `/api/users/<id>` | Get user by ID                                    |
| POST   | `/api/users`      | Create new user                                   |
| PUT    | `/api/users/<id>` | Update existing user                              |
| DELETE | `/api/users/<id>` | Delete user                                       |

### Query Parameters

- `?search=<query>` - Search users by name or role
- `?role=<role>` - Filter users by specific role

## Development

### Backend Development

- The Flask server runs in debug mode by default
- Changes to Python files will automatically reload the server
- API endpoints are defined in `server/app/routes/`
- Business logic is in `server/app/services/`

### Frontend Development

- React app uses Vite for fast development
- Hot module replacement enabled
- TypeScript for type safety
- Components in `client/src/components/`
- Pages in `client/src/pages/`

### Data Management

- User data is stored in `data/users.json`
- The backend reads from this file on startup
- Changes are persisted to the file

## Troubleshooting

### Common Issues

#### Port Already in Use

If you get "port already in use" errors:

- **Backend**: Change the port in `server/.env` file
- **Frontend**: Vite will automatically suggest an alternative port

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
- Check that the frontend environment variable `VITE_API_BASE_URL` points to the correct backend URL
- The backend has CORS enabled by default

### Getting Help

- Check the console output for error messages
- Verify all environment variables are set correctly
- Ensure both frontend and backend servers are running
- Check that the data file `data/users.json` exists and is readable

## Technologies Used

- **Frontend**: React 19, TypeScript, Vite, CSS3
- **Backend**: Flask 3.0, Python 3.11+, Flask-CORS
- **Data**: JSON file storage
- **Development**: Git, npm, pip, virtual environments

## License

This project is part of the PJMF assignment.
