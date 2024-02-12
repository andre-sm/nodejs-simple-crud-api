import http, { IncomingMessage, ServerResponse } from 'http';
import cluster from 'cluster';
import os from 'os';
import { handleRequests } from './routes/routes';
import { User, ClusterMessage } from './models/user-models';
import { updateStore } from './services/store';

const createMultiServer = (port: string | number) => {
  try {
    const numberOfCPU = os.availableParallelism();

    if (cluster.isPrimary) {
      console.log(`Primary ${process.pid} is running`);
      let store: User[] = [];
      const workerIDs: number[] = [];
      let lastWorkerIndex = 0;

      const numberOfCPUArr = Array(numberOfCPU - 1).fill(1);

      numberOfCPUArr.forEach(() => {
        const worker = cluster.fork();
        workerIDs.push(worker.id);

        worker.on('message', (msg) => {
          if (msg.type === 'state') {
            store = msg.data;
          }
        });
      });

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

        const worker = cluster.workers && cluster.workers[workerIDs[lastWorkerIndex]];
        worker?.send({ type: 'update', data: store });

        lastWorkerIndex = (lastWorkerIndex === workerIDs.length - 1) ? 0 : lastWorkerIndex + 1;
      });

      server.listen(port, () => {
        console.log(`Primary server listening on port ${port}`);
      });
    } else {
      console.log(`Worker ${process.pid} started`);

      process.on('message', (msg: ClusterMessage) => {
        updateStore(msg.data);
      });

      const server = http.createServer();
      server.on('request', (req, res) => {
        handleRequests(req, res);
      });

      const workerId = cluster.worker?.id as number;
      const workerPort = +port + workerId;
      server.listen(workerPort, () => {
        console.log(`Worker server listening on port ${workerPort}`);
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export default createMultiServer;
