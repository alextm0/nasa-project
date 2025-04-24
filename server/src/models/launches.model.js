import axios from 'axios';

import { Launch } from './launches.mongo.js';
import { Planet } from './planets.mongo.js';

const DEFAULT_FLIGHT_NUMBER = 100;

async function populateLaunches() {
  console.log('Downloading launch data...');
  const response = await axios.post(process.env.SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            customers: 1
          }
        }
      ]
    }
  });

  if(response.status !== 200) {
    console.log('Error downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;
  for(const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      destination: launchDoc['name'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers
    };

    await saveLaunch(launch);
    console.log(`Saving launch ${launch.flightNumber} with mission ${launch.mission}...`);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1
  });

  if(firstLaunch) {
    console.log('Launch data already loaded');
    return;
  }

  await populateLaunches();
  console.log(`Successfully loaded the launches!`);
}

async function getAllLaunches(skip, limit) {
  return await Launch
    .find({}, {
      _id: 0,
      __v: 0
    })
    .skip(skip)
    .limit(limit)
    .sort({ flightNumber: 1 });
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
  const planet = await Planet.findOne({
    keplerName: launch.destination
  });

  if(!planet) {
    throw new Error('No matching planet found');
  } 

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

async function findLaunch(filter) {
  return await Launch.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId
  });
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
  loadLaunchesData,
  getAllLaunches,
  getLaunchById,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};