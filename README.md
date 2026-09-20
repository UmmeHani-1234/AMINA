# AMINA Mission Control Dashboard

AMINA (Autonomous Mission Intelligence & Navigation Architecture) is a mission control dashboard for space missions, rover telemetry, science operations, and launch management built with React and Arwes Sci-Fi Cyberpunk UI.

---

## Project Structure

```
amina-mission-control-dashboard/
├── public/                 # Static assets, images, and audio effects
├── src/                    # React frontend application
│   ├── components/         # Header, Footer, Clickable buttons, Centered
│   ├── context/            # MissionContext state provider
│   ├── data/               # Kepler confirmed habitable planets dataset
│   ├── hooks/              # Data hooks & localStorage persistence
│   └── pages/              # Dashboard, Systems, Launch, History, Upcoming
├── Architecture/           # Architecture diagrams and design assets
├── vercel.json             # Vercel SPA rewrite routing configuration
├── package.json            # Scripts and project dependencies
└── README.md
```

---

## Quick Start (Local Development)

### 1. Install Dependencies
```powershell
npm install
```

### 2. Start the Application
```powershell
npm start
```
The app will open automatically at [http://localhost:3000](http://localhost:3000).

### 3. Build for Production
```powershell
npm run build
```
Creates an optimized static production build in the `build/` directory.

---

## Deploy to Vercel

1. Push this project/branch to your GitHub, GitLab, or Bitbucket repository.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import the repository.
3. Vercel automatically detects the **Create React App** framework:
   * **Framework Preset**: `Create React App`
   * **Build Command**: `npm run build`
   * **Output Directory**: `build`
4. If deploying from a specific branch (e.g. `feat/unified-vercel`), either:
   * Select that branch when creating the project, or
   * Go to **Project Settings > Git** in Vercel to set it as the **Production Branch**.
5. Click **Deploy**. Vercel will build and serve your app globally on their Edge CDN.

---

## Key Features

- **Mission Operations Dashboard**: Interactive rover and satellite telemetry, autonomy state machine, and scenario simulators.
- **Planetary Destination Selector**: Curated confirmed habitable exoplanets discovered by NASA's Kepler Space Telescope.
- **Launch Management**: Schedule new missions and abort upcoming launches with automatic browser persistence (`localStorage`).
- **Telemetry & Science Logging**: Real-time event feed with scenario-driven mission alerts.
