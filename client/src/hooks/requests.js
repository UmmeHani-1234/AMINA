const API_URL = 'http://localhost:8000'

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  return response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a,b) => {
    return a.flightNumber - b.flightNumber;
  });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try{
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    })
  } catch(err) {
    return {
      ok: false,
    };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try{
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete"
    });
  } catch(err){
    console.log(err);
    return {
      ok: false,
    };
  }
}

async function httpGetMissionLogs() {
  try {
    const response = await fetch(`${API_URL}/mission-logs?limit=20`);
    if (!response.ok) throw new Error('Mission log request failed');
    return response.json();
  } catch (error) {
    return [];
  }
}

async function httpAddMissionLog(log) {
  try {
    return await fetch(`${API_URL}/mission-logs`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
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