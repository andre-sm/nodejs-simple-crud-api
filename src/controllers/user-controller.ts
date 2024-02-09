import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { User } from '../models/user-models';
import * as store from '../services/store';
import * as utils from '../utils/index';

const getAllUsers = (req: IncomingMessage, res: ServerResponse): void => {
  try {
    const users = store.getAllUsers();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end('Internal server error');
  }
};

const getUser = (req: IncomingMessage, res: ServerResponse, userId: string): void => {
  try {
    const isValidId = uuidValidate(userId);

    if (!isValidId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end('User Id is invalid');
    } else {
      const user = store.getUser(userId);
      if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end('User doesn\'t exist');
      }
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end('Internal server error');
  }
};

const addUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const parsedBody = await utils.readRequestBody(req);

    const { username, age, hobbies } = parsedBody;
    const { isValid, message } = utils.validateRequiredFields(username, age, hobbies);

    if (!isValid) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(message));
    } else {
      const userId = uuidv4();
      const userData: User = {
        id: userId, username, age, hobbies,
      };

      store.addUser(userData);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(userData));
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end('Internal server error');
  }
};

const editUser = async (req: IncomingMessage, res: ServerResponse, id: string): Promise<void> => {
  try {
    const isValidId = uuidValidate(id);

    if (!isValidId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end('User Id is invalid');
    } else {
      const parsedBody = await utils.readRequestBody(req);
      const { username, age, hobbies } = parsedBody;

      const { isValid, message } = utils.validateRequiredFields(username, age, hobbies);

      if (!isValid) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
      } else {
        const userData: User = {
          id, username, age, hobbies,
        };
        const updatedUser = store.updateUser(userData);

        if (updatedUser) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedUser));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end('User doesn\'t exist');
        }
      }
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end('Internal server error');
  }
};

const deleteUser = (req: IncomingMessage, res: ServerResponse, userId: string): void => {
  try {
    const isValidId = uuidValidate(userId);

    if (!isValidId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end('User Id is invalid');
    } else {
      const isdeleted = store.deleteUser(userId);

      if (isdeleted) {
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end('User doesn\'t exist');
      }
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end('Internal server error');
  }
};

export {
  getAllUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
};
