import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(fileURLToPath(import.meta.url));

/** @type {import('./dist/register')} */
const { register } = require('./dist/register');

/** @type {import('ts-node/dist/esm')} */
import esm  from 'ts-node/dist/esm';

const options = register();

export const {
  resolve,
  getFormat,
  transformSource,
} = esm.registerAndCreateEsmHooks(options);
