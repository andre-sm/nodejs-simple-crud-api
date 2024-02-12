import http from 'http';
import { handleRequests } from './routes/routes';

const createSingleServer = (port: string | number) => {
  const server = http.createServer();
  server.on('request', (req, res) => handleRequests(req, res));

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

export default createSingleServer;
