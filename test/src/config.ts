import path from 'path';

/* ****************************************************************************************************************** */
// region: Config
/* ****************************************************************************************************************** */

export const tsModules = <const>[
  ['Latest', 'typescript-latest'],
  ['4.2.2', 'typescript-42'],
];

export const modes = ['program', 'manual', 'ts-node'] as const;

export const projectsPath = path.join(__dirname, '../projects');
export const rootPath = path.resolve(__dirname, '../../');

Error.stackTraceLimit = 120;

export const testCallName = '_test';
export const expectCallName = '_expect';

// endregion
