// server.js
import http from 'http';
import dotenv from 'dotenv';

import app from './app.js';
import { connectDB, loadInitialData } from './services/mongo.js';

dotenv.config();

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startServer() {
  await connectDB();
  await loadInitialData();

  server.listen(PORT, () => {
    console.log(`🚀  Server listening on http://localhost:${PORT}...`);
  });
}

startServer();
