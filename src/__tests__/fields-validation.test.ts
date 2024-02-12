import request from 'supertest';
import http from 'http';
import { handleRequests } from '../routes/routes';

const server = http.createServer(handleRequests);

const endpoint = '/api/users';
const userData = {
  username: 'Andy',
  age: 35,
  hobbies: ['quiz', 'coding'],
};

describe('Tests error messages for required fields validation', () => {
  afterAll((done: jest.DoneCallback) => {
    server.close();
    done();
  });

  test('should return specific message if username doesn\'t exist', async () => {
    const errorMessage = 'Error: User name is required';
    const response = await request(server)
      .post(endpoint)
      .send({ age: 35, hobbies: ['quiz', 'coding'] })
      .set('Content-Type', 'application/json');
    expect(response.body).toBe(errorMessage);
  });

  test('should return specific message if username is empty string', async () => {
    const errorMessage = 'Error: User name is required';
    const response = await request(server)
      .post(endpoint)
      .send({ ...userData, username: '' })
      .set('Content-Type', 'application/json');
    expect(response.body).toBe(errorMessage);
  });

  test('should return specific message if username isn\'t a string', async () => {
    const errorMessage = 'Error: User name must be a string';
    const response = await request(server)
      .post(endpoint)
      .send({ ...userData, username: 37 })
      .set('Content-Type', 'application/json');
    expect(response.body).toBe(errorMessage);
  });

  test('should return specific message if age doesn\'t exist', async () => {
    const errorMessage = 'Error: User age is required';
    const response = await request(server)
      .post(endpoint)
      .send({ username: 'Andy', hobbies: ['quiz', 'coding'] })
      .set('Content-Type', 'application/json');
    expect(response.body).toBe(errorMessage);
  });

  test('should return specific message if age isn\'t a number', async () => {
    const errorMessage = 'Error: User age must be a number';
    const response = await request(server)
      .post(endpoint)
      .send({ ...userData, age: '37' })
      .set('Content-Type', 'application/json');
    expect(response.body).toBe(errorMessage);
  });

  test('should return specific message if age is 0', async () => {
    const errorMessage = 'Error: User age shouldn\'t be 0';
    const response = await request(server)
      .post(endpoint)
      .send({ ...userData, age: 0 })
      .set('Content-Type', 'application/json');
    expect(response.body).toBe(errorMessage);
  });

  test('should return specific message if hobbies don\'t exist', async () => {
    const errorMessage = 'Error: User hobbies are required';
    const response = await request(server)
      .post(endpoint)
      .send({ username: 'Andy', age: 35 })
      .set('Content-Type', 'application/json');
    expect(response.body).toBe(errorMessage);
  });

  test('should return specific message if hobbies don\'t an array', async () => {
    const errorMessage = 'Error: User hobbies must be an array';
    const response = await request(server)
      .post(endpoint)
      .send({ ...userData, hobbies: 'coding' });
    expect(response.body).toBe(errorMessage);
  });

  test('should return specific message if hobbies include not string value or empty string', async () => {
    const errorMessage = 'Error: User hobbies must contain non-empty strings only';
    const response = await request(server)
      .post(endpoint)
      .send({ ...userData, hobbies: ['', 37] })
      .set('Content-Type', 'application/json');
    expect(response.body).toBe(errorMessage);
  });

  test('should return specific message if username, age and hobbies don\'t exist', async () => {
    const errorMessage
      = 'Errors: User name is required, User age is required, User hobbies are required';
    const response = await request(server).post(endpoint).send({}).set('Content-Type', 'application/json');
    expect(response.body).toBe(errorMessage);
  });

  test('should return specific message if username is a number, age is a string and hobbies include non-string values', async () => {
    const errorMessage
    = 'Errors: User name must be a string, User age must be a number, User hobbies must contain non-empty strings only';
    const response = await request(server)
      .post(endpoint)
      .send({ username: [], age: '37', hobbies: [37, ''] })
      .set('Content-Type', 'application/json');
    expect(response.body).toBe(errorMessage);
  });
});
