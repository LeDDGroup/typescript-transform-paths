import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(fileURLToPath(import.meta.url));

/** @type {import('./src/compatibility/node-register')} */
const { nodeRegister } = require('./dist/compatibility/node-register');

/** @type {import('ts-node')} */
import tsNode from 'ts-node';

const tsNodeInstance = nodeRegister();

export const { resolve, getFormat, transformSource } = tsNode.createEsmHooks(tsNodeInstance);
