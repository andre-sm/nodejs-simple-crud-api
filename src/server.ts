import http from 'http';
import dotenv from 'dotenv';
import { handleRequests } from './routes/routes';

dotenv.config();
const port = process.env.PORT || 4000;

const server = http.createServer();
server.on('request', (req, res) => handleRequests(req, res));
server.listen(port);
