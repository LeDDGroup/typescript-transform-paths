import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
  testEnvironment: "node",
  preset: 'ts-jest',
  testRegex: '.*(test)\\.tsx?$',
  moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx', 'json', 'node' ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/test/tsconfig.json'
    }
  },
  modulePaths: [ "<rootDir>" ],
  roots: [ '<rootDir>' ]
}

export default config;
