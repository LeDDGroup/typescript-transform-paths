/**
 * The following test suite does not use the Underscore Test framework. In a some respects, it is less comprehensive,
 * however it also affords a secondary approach as well as testing ts-node and manual transformation. For these reasons,
 * its current setup provides additional coverage and should therefore be left outside of the UT framework.
 */
import * as path from 'path';
import {
  createTsProgram,
  EmittedFiles,
  getEmitResultFromProgram,
  getManualEmitResult,
  getTsNodeEmitResult,
} from '../../src';
import { projectsPath } from '../../src/config';
import type TS from 'typescript';

/* ****************************************************************************************************************** *
 * Helpers
 * ****************************************************************************************************************** */

const makeRelative = (tsInstance: typeof TS, fileName: string, p: string, rootDir: string) => {
  let rel = tsInstance.normalizePath(path.relative(path.dirname(fileName), path.join(rootDir, p)));
  if (rel[0] !== '.') rel = `./${rel}`;
  return `"${rel}"`;
};

const getExpected = (tsInstance: typeof TS, fileName: string, original: string, rootDir: string): string =>
  original
    .replace(/'/g, '"')
    .replace(/"@(.*)"/g, (_, p) => makeRelative(tsInstance, fileName, p, rootDir))
    .replace(/"#utils\/(.*)"/g, (_, p) =>
      makeRelative(tsInstance, fileName, path.join(p === 'hello' ? 'secondary' : 'utils', p), rootDir)
    )
    .replace('"path"', '"https://external.url/path.js"')
    .replace('"circular/a"', '"../circular/a"');

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`[Project: 'general'] - General Tests`, () => {
  const projectRoot = path.join(projectsPath, 'general');
  const tsConfigFile = path.join(projectRoot, 'tsconfig.json');

  describe.each(envOptions.tsModules)(`[TS: %s]`, (s, tsSpecifier) => {
    const ts: typeof TS = require(tsSpecifier);
    const pcl = ts.getParsedCommandLineOfConfigFile(tsConfigFile, {}, <any>ts.sys)! as TS.ParsedCommandLine;
    const fileNames = pcl.fileNames;

    describe.each(envOptions.buildModes)(`Mode: %s`, (mode) => {
      let skipDts: boolean = false;
      let originalFiles: EmittedFiles = {};
      let transformedFiles: EmittedFiles = {};

      switch (mode) {
        case 'program':
          const program = createTsProgram({ tsInstance: ts, tsConfigFile, disablePlugin: true });
          const programWithTransformer = createTsProgram({ tsInstance: ts, tsConfigFile });

          originalFiles = getEmitResultFromProgram(ts, program);
          transformedFiles = getEmitResultFromProgram(ts, programWithTransformer);
          break;
        case 'manual': {
          skipDts = true;
          originalFiles = getManualEmitResult({}, ts, pcl, true);
          transformedFiles = getManualEmitResult({}, ts, pcl);
          break;
        }
        case 'ts-node': {
          skipDts = true;
          originalFiles = getTsNodeEmitResult({}, pcl, tsSpecifier, true);
          transformedFiles = getTsNodeEmitResult({}, pcl, tsSpecifier);
        }
      }

      describe.each(fileNames!.map((p) => [p.slice(projectRoot.length), p]))(`%s`, (_, file) => {
        let expected: EmittedFiles[string];
        let transformed: EmittedFiles[string];

        beforeAll(() => {
          transformed = transformedFiles[file]
          transformed.js = transformed.js.replace(/'/g, '"');
          transformed.dts = transformed.dts?.replace(/'/g, '"');
          expected = {
            js: getExpected(ts, file, originalFiles[file].js, projectRoot),
            ...(!skipDts && { dts: getExpected(ts, file, originalFiles[file].dts!, projectRoot) }),
          };
        });

        test(`js matches`, () => expect(transformed.js).toEqual(expected.js));
        if (!skipDts) test(`dts matches`, () => expect(transformed.dts).toEqual(expected.dts));
      });
    });
  });
});
