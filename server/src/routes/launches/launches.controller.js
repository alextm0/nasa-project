import { getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById, getLaunchById } from "../../models/launches.model.js";

async function httpGetAllLaunches(req, res) {
  const allLaunches = await getAllLaunches();
  return res.status(200).json(allLaunches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.destination) {
    return res.status(400).json({
      error: 'Missing required launch property',
    })
  }

  launch.launchDate = new Date(launch.launchDate);
  if(isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date'
    })
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  // If launch doesn't exist
  const existsLaunch = await existsLaunchWithId(launchId);
  if(!existsLaunch) {
    return res.status(404).json({
      error: 'Launch not found!'
    });
  }

  const currentLaunch = await getLaunchById(launchId);
  if(!currentLaunch.upcoming) {
    return res.status(400).json({
      error: 'Launch already aborted!'
    });
  }

  const isAborted = await abortLaunchById(launchId);
  if(!isAborted) {
    res.status(400).json({
      error: 'Launch not aborted!'
    });
  }

  return res.status(200).json({
    ok: true
  });
}

export {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
};