// services/mongo.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import {
  loadPlanetsData,
  getAllHabitablePlanets,
} from '../models/planets.model.js';

dotenv.config();

const { MONGO_URL } = process.env;
if (!MONGO_URL) {
  console.error('❌ Missing MONGO_URL in environment');
  process.exit(1);
}

/**
 * Connects to MongoDB using mongoose.
 */
export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

// Disconnect from MongoDB
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Error disconnecting from MongoDB:', err);
    process.exit(1);
  }
}

/**
 * Loads any initial data your app needs (e.g. planets).
 */
export async function loadInitialData() {
  try {
    await loadPlanetsData();
    const planets = await getAllHabitablePlanets();
    console.log(`✅ Loaded ${planets.length} habitable planets`);
  } catch (err) {
    console.error('❌ Error loading initial data:', err);
    process.exit(1);
  }
}
