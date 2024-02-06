import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user-models';
import { readRequestBody } from '../utils/read-request-body';

export const addUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const parsedBody = await readRequestBody(req);

    const { username, age, hobbies } = parsedBody;

    const userId = uuidv4();
    const userData: User = {
      id: userId, username, age, hobbies,
    };

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(userData));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end('Internal server error');
  }
};
