import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user-models';
import * as store from '../services/store';
import * as utils from '../utils/index';

export const addUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
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
