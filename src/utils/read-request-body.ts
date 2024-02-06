import { IncomingMessage } from 'http';
import { UserRequestBody } from '../models/user-models';

export const readRequestBody = (req: IncomingMessage): Promise<UserRequestBody> => {
  try {
    return new Promise((res, rej) => {
      const bodyBuffer: Buffer[] = [];
      req.on('data', (chunk) => bodyBuffer.push(chunk));
      req.on('end', () => {
        const body = Buffer.concat(bodyBuffer).toString();
        const parsedBody: UserRequestBody = JSON.parse(body);
        res(parsedBody);
      });

      req.on('error', (error) => {
        rej(error);
      });
    });
  } catch (error) {
    throw Error('An Error occurred while parsing request body');
  }
};
