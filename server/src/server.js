import http from 'http';
import dotenv from 'dotenv';

import { getAllHabitablePlanets } from './models/planets.model.js'
import {loadPlanetsData} from './models/planets.model.js';

import app from './app.js';

// Loads environment variables from a .env file into process.env
dotenv.config();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function serverStart() {
  await loadPlanetsData();
  
  server.listen(PORT, () => {
    console.log("Number of planets: ", getAllHabitablePlanets().length);
    console.log(`Server listening on port ${PORT}...`);
  });
}

serverStart().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});