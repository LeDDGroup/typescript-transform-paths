import { projectsPath, rootPath } from '../../src/config';
import path from 'path';
import type TS from 'typescript';
import { normalizePath } from 'typescript';
import { execSync } from 'child_process';
import { createTsProgram, getEmitResultFromProgram } from '../../src';

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const tsNodePath = path.resolve(rootPath, 'node_modules/.bin/ts-node');

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`[Project: 'extras'] Extra Tests`, () => {
  const projectRoot = normalizePath(path.join(projectsPath, 'extras'));
  const indexFile = normalizePath(path.join(projectRoot, 'src/index.ts'));
  const tsConfigFile = normalizePath(path.join(projectRoot, 'tsconfig.json'));

  describe.each(envOptions.tsModules)(`[TS %s]`, (_, tsSpecifier) => {
    const ts: typeof TS = require(tsSpecifier);

    // see: https://github.com/LeDDGroup/typescript-transform-paths/issues/130
    test(`Transformer works without ts-node being present`, () => {
      jest.doMock(
        'ts-node',
        () => {
          require('sdf0s39rf3333d@fake-module');
        },
        { virtual: true }
      );
      try {
        const program = createTsProgram({ tsInstance: ts, tsConfigFile });
        const res = getEmitResultFromProgram(ts, program);
        expect(res[indexFile].js).toMatch(`const _identifier_1 = require("./id")`);
      } finally {
        jest.dontMock('ts-node');
      }
    });
  });

  (envOptions.testTarget === 'dist' ? test : test.skip)(`Register script transforms with ts-node`, () => {
    const res = execSync(`${tsNodePath} src/index.ts`, { cwd: projectRoot }).toString();
    expect(res).toMatch(/^null($|\r?\n)/);
  });

  test(`Transformer throws with lower version`, () => {
    const ts = require('typescript-latest');
    const originalMajorMinor = ts.versionMajorMinor;
    (<any>ts).versionMajorMinor = '4.1.0';
    try {
      expect(() => {
        const program = createTsProgram({ tsInstance: ts, tsConfigFile });
        getEmitResultFromProgram(ts, program);
      }).toThrow(`The latest version of 'typescript-transform-paths' requires TS version `);
    } finally {
      (<any>ts).versionMajorMinor = originalMajorMinor;
    }
  });
});
