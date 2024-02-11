import http, { IncomingMessage, ServerResponse } from 'http';
import cluster from 'cluster';
import os from 'os';
import { handleRequests } from './routes/routes';

const createMultiServer = (port: string | number) => {
  try {
    const numberOfCPU = os.availableParallelism();

    if (cluster.isPrimary) {
      console.log(`Primary ${process.pid} is running`);
      const workerIDs: number[] = [];
      let lastWorkerIndex = 0;

      for (let i = 1; i < numberOfCPU; i += 1) {
        const worker = cluster.fork();
        workerIDs.push(worker.id);
      }

      cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
      });

      const server = http.createServer();
      server.on('request', (originalReq: IncomingMessage, originalRes: ServerResponse) => {
        const { pathname } = new URL(originalReq.url || '', `http://${originalReq.headers.host}`);
        const newPort = (+port + lastWorkerIndex + 1).toString();

        const requestOptions = {
          hostname: 'localhost',
          port: newPort,
          path: pathname,
          method: originalReq.method,
          headers: { ...originalReq.headers, host: `localhost:${newPort}` },
        };

        const proxyRequest = http.request(requestOptions, (proxyResponse) => {
          originalRes.writeHead(proxyResponse.statusCode as number, proxyResponse.headers);
          proxyResponse.pipe(originalRes, { end: true });
        });

        originalReq.pipe(proxyRequest, { end: true });

        lastWorkerIndex = (lastWorkerIndex === workerIDs.length - 1) ? 0 : lastWorkerIndex + 1;
      });

      server.listen(port, () => {
        console.log(`Primary server listening on port ${port}`);
      });
    } else {
      console.log(`Worker ${process.pid} started`);

      const server = http.createServer();
      server.on('request', (req, res) => {
        handleRequests(req, res);
      });

      const workerId = cluster.worker?.id as number;
      server.listen(+port + workerId, () => {
        console.log(`Worker server listening on port ${+port + workerId}`);
      });
    }
  } catch (error) {
    console.error();
  }
};

export default createMultiServer;
