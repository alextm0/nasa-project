import fs from 'fs';
import { parse } from 'csv-parse';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const habitablePlanets = [];

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

    function isHabitablePlanet(planet) {
      return planet['koi_disposition'] === "CONFIRMED"
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.1
        && planet['koi_prad'] < 1.6; 
    }

    stream
      .pipe(parser)             
      .on('data', row => {
        if(isHabitablePlanet(row)) {
          habitablePlanets.push(row);
        }
      })
      .on('error', err => {
        console.error('Error:', err);
        reject();
      })
      .on('end', () => {
        console.log('Total habitable planets found:', habitablePlanets.length);
        resolve();
      });
  });
};

function getAllHabitablePlanets() {
  return habitablePlanets;
}

export {
  loadPlanetsData,
  getAllHabitablePlanets
}