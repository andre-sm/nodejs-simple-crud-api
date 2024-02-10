import request from 'supertest';
import server from '../server';

const endpoint = '/api/users';
const userData = {
  username: 'Andy',
  age: 35,
  hobbies: ['quiz', 'coding'],
};
let userId = '';

describe('CRUD operations API tests', () => {
  afterAll((done: jest.DoneCallback) => {
    server.close();
    done();
  });

  test('GET request should return an empty array and 200 status code', async () => {
    const response = await request(server).get(endpoint);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST request should return new user record and 201 status code', async () => {
    const response = await request(server).post(endpoint).send(userData).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

    const { id, ...userDataWithoutId } = response.body;
    userId = id;
    expect(userDataWithoutId).toEqual(userData);
  });

  test('GET request should return existing user by its id and 200 status code', async () => {
    const response = await request(server).get(`${endpoint}/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ...userData, id: userId });
  });

  test('PUT request should return updated user data and 200 status code', async () => {
    const response = await request(server)
      .put(`${endpoint}/${userId}`)
      .send({ ...userData, age: 33 })
      .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ...userData, id: userId, age: 33 });
  });

  test('DELETE request should return 204 status code if user was deleted', async () => {
    const response = await request(server).delete(`${endpoint}/${userId}`);
    expect(response.statusCode).toBe(204);
  });

  test("GET request should return 404 status code if user doesn't exist", async () => {
    const response = await request(server).get(`${endpoint}/${userId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toBe("User doesn't exist");
  });
});
