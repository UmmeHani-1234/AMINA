const {Router} = require('express');
const launchesRouter = Router();
const {
    httpGetAllLaunches,
    httpAddNewLaunches,
    httpAbortLaunch,
    } = require('./launches.controller');

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunches)
launchesRouter.delete('/:id', httpAbortLaunch);


module.exports = launchesRouter;