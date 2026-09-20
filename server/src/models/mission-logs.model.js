const missionLogs = [];

async function getMissionLogs(limit = 20) {
  return missionLogs.slice(0, limit);
}

async function addMissionLog(log) {
  const newLog = {
    ...log,
    timestamp: new Date(),
    scenario: log.scenario || 'normal',
    target: log.target || '07',
  };
  missionLogs.unshift(newLog);
  if (missionLogs.length > 200) {
    missionLogs.pop();
  }
  return newLog;
}

module.exports = { getMissionLogs, addMissionLog };
