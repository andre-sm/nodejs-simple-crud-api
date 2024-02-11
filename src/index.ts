import dotenv from 'dotenv';
import createMultiServer from './multi-server';
import createSingleServer from './single-server';

dotenv.config();
const port = process.env.PORT || 4000;
const isMultiServerMode = process.argv.includes('--multi');

if (isMultiServerMode) {
  createMultiServer(port);
} else {
  createSingleServer(port);
}
