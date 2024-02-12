# Node.js CRUD API

### Description

A simple CRUD API server implemented using vanilla Node.js. The API server works in two scenarios: Single server mode and Multi server mode. Multi mode starts multiple instances of the server using the Node.js Cluster API while implemented load balancer distributes incoming requests between them.

### Installation

#### 1. Clone repository
```
git clone https://github.com/andre-sm/nodejs-simple-crud-api.git
```
####  2. Go to the project directory
```
cd nodejs-simple-crud-api
```
####  3. Switch to `dev` branch
```
git checkout dev
```
####  4. Install dependencies
```
npm install
```
####  5. Rename .env.example file to .env and modify PORT if needed
####  6. Run the server
```
# single-server development mode
npm run start:dev

# single-server production mode
npm run start:prod

# multi-server development mode with a load balancer
npm run start:multi

# multi-server production mode with a load balancer
npm run start:multi:prod
```

####  7. Run the tests
```
npm run test

```

### CRUD API Endpoints

| Method    | Endpoint             | Description           |
|-----------|----------------------|-----------------------|
| `GET`     | `api/users`          | Get all users         |
| `GET`     | `api/users/{userId}` | Get user by id        |
| `POST`    | `api/users`          | Add new user          |
| `PUT`     | `api/users/{userId}` | Update existing user  |
| `DELETE`  | `api/users/{userId}` | Delete existing user  |
