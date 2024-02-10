import request from 'supertest';
import server from '../server';

const endpoint = '/api/users';
const userData = {
  username: 'Andy',
  age: 35,
  hobbies: ['quiz', 'coding'],
};
const invalidUserString = '{ "username": "Andy", "age": 35, "hobbies": ["quiz", "coding", }';
let userId = '';

describe('Correct error handling tests', () => {
  afterAll((done: jest.DoneCallback) => {
    server.close();
    done();
  });

  test("should return error message if provided endpoint doesn't match with existing. Case 1", async () => {
    const response = await request(server).get('/api/user');
    expect(response.statusCode).toBe(404);
    expect(response.body).toBe("Endpoint doesn't exist");
  });

  test("should return error message if provided endpoint doesn't match with existing. Case 2", async () => {
    const response = await request(server).get('/api/users/current-user/account');
    expect(response.statusCode).toBe(404);
    expect(response.body).toBe("Endpoint doesn't exist");
  });

  test('should return new user record and 201 status code', async () => {
    const response = await request(server).post(endpoint).send(userData).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

    const { id, ...userDataWithoutId } = response.body;
    userId = id;
    expect(userDataWithoutId).toEqual(userData);
  });

  test('should return error message if uuid is invalid and 400 status code', async () => {
    const response = await request(server).get(`${endpoint}/${userId.slice(0, -1)}123`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('User Id is invalid');
  });

  test('should return error message if invalid json string is provided and 500 status code', async () => {
    const response = await request(server)
      .post(endpoint)
      .send(invalidUserString)
      .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe('Internal server error');
  });

  test("PUT request should return 404 status code if user doesn't exist", async () => {
    const response = await request(server)
      .put(`${endpoint}/${userId.slice(0, -1)}3`)
      .send(userData)
      .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(404);
    expect(response.body).toBe("User doesn't exist");
  });

  test("DELETE request should return 404 status code if user doesn't exist", async () => {
    const response = await request(server)
      .delete(`${endpoint}/${userId.slice(0, -1)}3`)
      .send(userData);
    expect(response.statusCode).toBe(404);
    expect(response.body).toBe("User doesn't exist");
  });
});
