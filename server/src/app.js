import express from 'express';
import cors from 'cors'; 
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import api from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Versioning
app.use('/v1', api);

// Frontend Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// match everything else
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;