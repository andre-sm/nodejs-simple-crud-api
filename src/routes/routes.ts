import { IncomingMessage, ServerResponse } from 'http';
import {
  addUser, getAllUsers, getUser, editUser,
} from '../controllers/user-controller';

const handleRequests = (req: IncomingMessage, res: ServerResponse): void => {
  try {
    const { url, method } = req;
    const urlParts = url?.split('/').filter(Boolean) as string[];
    const userId = urlParts[2];

    switch (method) {
      case 'GET':
        if (url === '/api/users') {
          getAllUsers(req, res);
        }

        if (urlParts[0] === 'api' && urlParts[1] === 'users' && userId) {
          getUser(req, res, urlParts[2]);
        }
        break;

      case 'POST':
        if (url === '/api/users') {
          addUser(req, res);
        }
        break;

      case 'PUT':
        if (urlParts[0] === 'api' && urlParts[1] === 'users' && userId) {
          editUser(req, res, userId);
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
