import http from 'http';
import cluster from 'cluster';
import os from 'os';

const createMultiServer = (port: string | number) => {
  const numberOfCPU = os.availableParallelism();

  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 1; i < numberOfCPU; i += 1) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`worker ${worker.process.pid} died`);
    });

    const server = http.createServer();
    server.on('request', (req, res) => console.log(res));
    server.listen(port);
  } else {
    console.log(`Worker ${process.pid} started`);

    for (let i = 1; i < numberOfCPU; i += 1) {
      const server = http.createServer();
      server.on('request', (req, res) => console.log(res));
      server.listen(+port + i);
    }
  }
};

export default createMultiServer;
