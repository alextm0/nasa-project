import { getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById, getLaunchById } from "../../models/launches.model.js";

function httpGetAllLaunches(req, res) {
  const allLaunches = getAllLaunches();
  return res.status(200).json(allLaunches);
}

function httpAddNewLaunch(req, res) {
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

  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  // If launch doesn't exist
  if(!existsLaunchWithId(launchId)) {
    console.log('HERE');
    return res.status(404).json({
      error: 'Launch not found!'
    });
  }

  const currentLaunch = getLaunchById(launchId);
  if(!currentLaunch.upcoming) {
    return res.status(400).json({
      error: 'Launch already aborted!'
    });
  }

  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

export {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
};