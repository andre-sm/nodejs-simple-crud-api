import { IncomingMessage, ServerResponse } from 'http';
import { addUser } from '../controllers/user-controller';

const handleRequests = (req: IncomingMessage, res: ServerResponse): void => {
  try {
    const { url, method } = req;

    switch (method) {
      case 'POST':
        if (url === '/api/users') {
          addUser(req, res);
        }
        break;

      default:
        break;
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end('Internal server error');
  }
};

export { handleRequests };
