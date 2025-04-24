// server.js
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { getAllHabitablePlanets, loadPlanetsData } from './models/planets.model.js';
import app from './app.js';

// Load env vars
dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  console.error('Missing MONGO_URL in environment');
  process.exit(1);
}

const server = http.createServer(app);

async function startServer() {
  try {
    // Mongoose 6+ uses these under the hood:
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }

  // Load any pre-required data (e.g. your planets)
  try {
    await loadPlanetsData();
    console.log(`Loaded ${getAllHabitablePlanets().length} habitable planets`);
  } catch (err) {
    console.error('Error loading planets data:', err);
    process.exit(1);
  }

  // Start HTTP server
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}...`);
  });
}

startServer();
