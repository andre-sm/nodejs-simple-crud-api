import { IncomingMessage } from 'http';
import { UserReqBody } from '../models/user-models';

const readRequestBody = (req: IncomingMessage): Promise<UserReqBody> => new Promise((res, rej) => {
  const bodyBuffer: Buffer[] = [];
  req.on('data', (chunk) => bodyBuffer.push(chunk));
  req.on('end', () => {
    try {
      const body = Buffer.concat(bodyBuffer).toString();
      const parsedBody: UserReqBody = JSON.parse(body);
      res(parsedBody);
    } catch (error) {
      rej(new Error('An Error occurred while reading request body'));
    }
  });

  req.on('error', () => {
    rej(new Error('An Error occurred while parsing request body'));
  });
});

export {
  readRequestBody,
};
