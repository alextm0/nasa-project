import fs from 'fs';
import { parse } from 'csv-parse';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

import { Planet } from './planets.mongo.js';

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === "CONFIRMED"
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.1
    && planet['koi_prad'] < 1.6; 
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    // 1. Open the CSV file
    const stream = fs.createReadStream(path.join(__dirname, '..', 'data', 'kepler_data.csv'));

    // 2. Set up the parser
    const parser = parse({
      comment: '#',       // skip lines beginning with #
      columns: true,      // use first row as keys
      skip_empty_lines: true
    });

    stream
      .pipe(parser)             
      .on('data', async (row) => {
        if(isHabitablePlanet(row)) {
          savePlanet(row);
        }
      })
      .on('error', err => {
        console.error('Error:', err);
        reject();
      })
      .on('end', async () => {
        const countPlanetsFound = (await getAllHabitablePlanets()).length;
        console.log('Total habitable planets found:', countPlanetsFound);
        resolve();
      });
  });
};

async function getAllHabitablePlanets() {
  return await Planet.find({}, {
    '_id': 0,
    '__v': 0,
  });
}

async function savePlanet(planet) {
  try {
    await Planet.updateOne({
      keplerName: planet.kepler_name
    }, {
      keplerName: planet.kepler_name,
    }, {
      upsert: true,
    });
  } catch (error) {
    console.error('Could not save planet', error);
  }
}

export {
  loadPlanetsData,
  getAllHabitablePlanets
}