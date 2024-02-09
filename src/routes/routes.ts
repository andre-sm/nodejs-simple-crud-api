import { IncomingMessage, ServerResponse } from 'http';
import {
  addUser, getAllUsers, getUser, editUser, deleteUser,
} from '../controllers/user-controller';

const handleRequests = (req: IncomingMessage, res: ServerResponse): void => {
  try {
    const { url, method } = req;
    const urlParts = url?.split('/').filter(Boolean) as string[];
    const clearUrl = url?.endsWith('/') ? url.slice(0, -1) : url;

    const isValidURLStart = urlParts[0] === 'api' && urlParts[1] === 'users';
    const userId = urlParts[2];

    if (method === 'GET' && clearUrl === '/api/users') {
      getAllUsers(req, res);
    } else if (method === 'GET' && isValidURLStart && userId && urlParts.length === 3) {
      getUser(req, res, userId);
    } else if (method === 'POST' && clearUrl === '/api/users') {
      addUser(req, res);
    } else if (method === 'PUT' && isValidURLStart && userId && urlParts.length === 3) {
      editUser(req, res, userId);
    } else if (method === 'DELETE' && isValidURLStart && userId && urlParts.length === 3) {
      deleteUser(req, res, userId);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end('Endpoint doesn\'t exist');
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end('Internal server error');
  }
};

export { handleRequests };
