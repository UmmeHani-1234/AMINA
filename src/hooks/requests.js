import planetsData from '../data/planets.json';

const LAUNCHES_KEY = 'amina_launches';
const MISSION_LOGS_KEY = 'amina_mission_logs';

const DEFAULT_LAUNCHES = [
  {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    launchDate: new Date('2024-11-11').toISOString(),
    target: 'Kepler-442 b',
    customers: ['SpaceX', 'NASA'],
    upcoming: true,
    success: true,
  }
];

function getStoredLaunches() {
  try {
    const data = localStorage.getItem(LAUNCHES_KEY);
    if (!data) {
      localStorage.setItem(LAUNCHES_KEY, JSON.stringify(DEFAULT_LAUNCHES));
      return DEFAULT_LAUNCHES;
    }
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_LAUNCHES;
  }
}

function saveStoredLaunches(launches) {
  try {
    localStorage.setItem(LAUNCHES_KEY, JSON.stringify(launches));
  } catch (e) {
    console.error('Failed to save launches to localStorage', e);
  }
}

async function httpGetPlanets() {
  return planetsData;
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const launches = getStoredLaunches();
  return launches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    const launches = getStoredLaunches();
    const highestFlightNum = launches.reduce(
      (max, l) => Math.max(max, Number(l.flightNumber) || 0),
      100
    );
    const newFlightNumber = highestFlightNum + 1;

    const newLaunch = {
      ...launch,
      flightNumber: newFlightNumber,
      customers: ['SpaceX', 'NASA'],
      upcoming: true,
      success: true,
      launchDate: new Date(launch.launchDate).toISOString(),
    };

    launches.push(newLaunch);
    saveStoredLaunches(launches);

    return {
      ok: true,
      status: 201,
      json: async () => newLaunch,
    };
  } catch (err) {
    return {
      ok: false,
    };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    const launches = getStoredLaunches();
    const targetFlightNumber = Number(id);
    const targetLaunch = launches.find(l => l.flightNumber === targetFlightNumber);

    if (!targetLaunch) {
      return {
        ok: false,
        status: 404,
      };
    }

    targetLaunch.upcoming = false;
    targetLaunch.success = false;
    saveStoredLaunches(launches);

    return {
      ok: true,
      status: 200,
      json: async () => targetLaunch,
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
    };
  }
}

function getAllStoredMissionLogs() {
  try {
    const data = localStorage.getItem(MISSION_LOGS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function httpGetMissionLogs() {
  const logs = getAllStoredMissionLogs();
  return logs.slice(0, 20);
}

async function httpAddMissionLog(log) {
  try {
    const logs = getAllStoredMissionLogs();
    const newLog = {
      ...log,
      timestamp: new Date().toISOString(),
      scenario: log.scenario || 'normal',
      target: log.target || '07',
    };
    logs.unshift(newLog);
    if (logs.length > 100) {
      logs.length = 100;
    }
    localStorage.setItem(MISSION_LOGS_KEY, JSON.stringify(logs));
    return {
      ok: true,
      status: 201,
      json: async () => newLog,
    };
  } catch (error) {
    return { ok: false };
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
  httpGetMissionLogs,
  httpAddMissionLog,
};