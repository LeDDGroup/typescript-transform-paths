import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: "node",
  preset: 'ts-jest',
  testRegex: '.*(test|spec)\\.tsx?$',
  moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx', 'json', 'node' ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/test/tsconfig.json'
    }
  },
  modulePaths: [ "<rootDir>" ],
  roots: [ '<rootDir>' ],
}

export default config;
