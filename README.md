# AMINA Mission Control Dashboard

AMINA (Autonomous Mission Intelligence & Navigation Architecture) is a mission control dashboard for space missions, rover telemetry, science operations, and launch management.

---

## Project Structure

```
amina-mission-control-dashboard/
├── client/                     # React Frontend (Arwes Sci-Fi Cyberpunk UI)
│   ├── public/                 # Static assets, images, and audio effects
│   ├── src/                    # Components, pages, hooks, context
│   │   ├── components/         # Header, Footer, Clickable buttons, Centered
│   │   ├── context/            # MissionContext state provider
│   │   ├── hooks/              # API requests & hooks
│   │   └── pages/              # Dashboard, Systems, Launch, History, Upcoming
│   └── package.json
├── server/                     # Node.js Express REST API
│   ├── data/                   # Kepler habitable planets CSV dataset
│   ├── src/                    # API routes, controllers, and models
│   │   ├── models/             # In-memory models (launches, planets, mission-logs)
│   │   ├── routes/             # Express routers and controllers
│   │   ├── app.js              # Express app & CORS middleware
│   │   └── server.js           # HTTP server bootstrap
│   └── package.json
├── Architecture/               # Architecture diagrams and design assets
└── package.json                # Root package scripts
```

---

## Quick Start

### 1. Start the Backend Server (Port 8000)
```powershell
cd server
npm install
npm start
```

### 2. Start the Frontend Application (Port 3001)
```powershell
cd client
npm install
npx cross-env PORT=3001 npm start
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/planets` | List Kepler confirmed habitable planets |
| `GET` | `/launches` | List all mission launches |
| `POST` | `/launches` | Schedule a new mission launch |
| `DELETE` | `/launches/:id` | Abort a scheduled launch |
| `GET` | `/mission-logs` | Retrieve recent mission telemetry logs |
| `POST` | `/mission-logs` | Record a new mission log entry |
