const launches = new Map();

import { Launch } from './launches.mongo.js';
import { Planet } from './planets.mongo.js';

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  destination: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true
};

saveLaunch(launch);

async function getAllLaunches() {
  return await Launch.find({}, { _id: 0, __v: 0 });
}

async function getLaunchById(launchId) {
  return await Launch.findOne({
    flightNumber: launchId
  });
}

async function getLatestFlightNumber() {
  const latestFlightNumber = await Launch
    .findOne()
    .sort('-flightNumber');

  if(!latestFlightNumber) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestFlightNumber.flightNumber;
}

async function saveLaunch(launch) {
  const planet = await Planet.findOne({
    keplerName: launch.destination
  });

  if(!planet) {
    throw new Error('No matching planet found');
  }

  await Launch.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber
    },
    launch,
    {
      upsert: true
    }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;
  console.log('New flight number:', newFlightNumber, typeof newFlightNumber);

  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: newFlightNumber
  });

  await saveLaunch(newLaunch);
}

async function existsLaunchWithId(launchId) {
  return await Launch.exists({ flightNumber: launchId });
}

async function abortLaunchById(launchId) {
  const abortedLaunch = await Launch.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success: false
    }
  );

  return abortedLaunch.modifiedCount === 1;
} 

export {
  getAllLaunches,
  getLaunchById,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};