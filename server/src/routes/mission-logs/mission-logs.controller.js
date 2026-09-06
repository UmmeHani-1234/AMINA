const { addMissionLog, getMissionLogs } = require('../../models/mission-logs.model');

async function httpGetMissionLogs(req, res) {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const logs = await getMissionLogs(limit);
  return res.status(200).json(logs);
}

async function httpAddMissionLog(req, res) {
  const { time, message, type, scenario, battery, target } = req.body;
  if (!time || !message || !type) {
    return res.status(400).json({ error: 'time, message, and type are required' });
  }

  const log = await addMissionLog({ time, message, type, scenario, battery, target });
  return res.status(201).json(log);
}

module.exports = { httpGetMissionLogs, httpAddMissionLog };
