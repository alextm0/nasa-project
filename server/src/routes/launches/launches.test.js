import request from 'supertest';
import app from '../../app.js';

import { connectDB, disconnectDB, loadInitialData } from '../../services/mongo.js';

describe('Launches API', () => {
  beforeAll(async () => {
    await connectDB();
    await loadInitialData();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => { 
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
      expect(response.statusCode).toBe(200);
     });
  });
  
  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'USS',
      rocket: 'NCC 1701-D',
      destination: 'Kepler-1652 b',
      launchDate: 'January 4, 2028'
    };
  
    const launchDataWithoutDate = {
      mission: 'USS',
      rocket: 'NCC 1701-D',
      destination: 'Kepler-1652 b'
    };
  
    const launchDataWithInvalidDate = {
      mission: 'USS',
      rocket: 'NCC 1701-D',
      destination: 'Kepler-1652 b',
      launchDate: 'invalid date'
    };
  
    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201)
  
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
  
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
  
    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'Missing required launch property'
      });
    });
  
    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'Invalid launch date'
      });
    });
  });
});

