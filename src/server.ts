import http from 'http';
import { handleRequests } from './routes/routes';

const server = http.createServer();
server.on('request', (req, res) => handleRequests(req, res));
server.listen(3000);
