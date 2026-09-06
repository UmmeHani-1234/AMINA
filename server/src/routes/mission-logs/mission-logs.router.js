const { Router } = require('express');
const { httpGetMissionLogs, httpAddMissionLog } = require('./mission-logs.controller');

const missionLogsRouter = Router();
missionLogsRouter.get('/', httpGetMissionLogs);
missionLogsRouter.post('/', httpAddMissionLog);

module.exports = missionLogsRouter;
