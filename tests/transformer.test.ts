// noinspection ES6UnusedImports
import {} from 'ts-expose-internals'
import * as path from 'path';
import { join } from 'path';
import { createProgram, EmittedFiles, getEmitResult } from './helpers';
import * as TS from 'typescript';


/* ****************************************************************************************************************** *
 * Constants & Config
 * ****************************************************************************************************************** */

const ts = require('ttypescript') as typeof TS;
const fixturesPath = join(__dirname, '__fixtures');


/* ****************************************************************************************************************** *
 * Helpers
 * ****************************************************************************************************************** */

const makeRelative = (fileName: string, p: string) => {
  let rel = ts.normalizePath(path.relative(path.dirname(fileName), path.join(fixturesPath, p)));
  if (rel[0] !== '.') rel = `./${rel}`
  return `"${rel}"`
}

const getExpected = (fileName: string, original: string): string =>
  original
    .replace(/"@(.*)"/g, (_, p) => makeRelative(fileName, p))
    .replace(/"#utils\/(.*)"/g, (_, p) =>
      makeRelative(fileName, path.join((p === 'hello' ? 'secondary' : 'utils'), p))
    )
    .replace('"path"', '"https://external.url/path.js"')
    .replace('"circular/a"', '"../circular/a"');


/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`Transformer`, () => {
  describe('Normal paths', () => {
    const tsConfigFile = path.join(fixturesPath, 'tsconfig.json');
    let originalFiles: EmittedFiles = {};
    let transformedFiles: EmittedFiles = {};

    const program = createProgram(tsConfigFile, true);
    const programWithTransformer = createProgram(tsConfigFile, false);
    const fileNames = program.getRootFileNames() as string[];

    beforeAll(() => {
      originalFiles = getEmitResult(program);
      transformedFiles = getEmitResult(programWithTransformer);
    });

    describe.each(fileNames.map(p => [ p.slice(fixturesPath.length), p ]))(`%s`, (_, file) => {
      let expected: EmittedFiles[string];
      let transformed: EmittedFiles[string];

      beforeAll(() => {
        transformed = transformedFiles[file];
        expected = {
          js: getExpected(file, originalFiles[file].js),
          dts: getExpected(file, originalFiles[file].dts)
        };
      });

      it(`js matches`, () => expect(transformed.js).toEqual(expected.js));
      it(`dts matches`, () => expect(transformed.dts).toEqual(expected.dts));
    });
  });

  describe('Paths with rootDirs', () => {
    const tsConfig = ts.normalizePath(path.join(fixturesPath, 'root-paths/tsconfig.json'));
    const indexFile = ts.normalizePath(path.join(fixturesPath, 'root-paths/index.ts'));

    test(`(useRootDirs: true) re-maps for rootDirs`, () => {
      const program = createProgram(tsConfig, false, undefined, { useRootDirs: true });

      const { js, dts } = getEmitResult(program)[indexFile];

      expect(js).toMatch(`export * from "./hello"`);
      expect(js).toMatch(`export * from "./sum"`);
      expect(dts).toMatch(`export * from "./hello"`);
      expect(dts).toMatch(`export * from "./sum"`);
    });

    test(`(useRootDirs: false) ignores rootDirs`, () => {
      const program = createProgram(tsConfig, false, undefined, { useRootDirs: false });

      const { js, dts } = getEmitResult(program)[indexFile];

      expect(js).toMatch(`export * from "../secondary/hello"`);
      expect(js).toMatch(`export * from "../utils/sum"`);
      expect(dts).toMatch(`export * from "../secondary/hello"`);
      expect(dts).toMatch(`export * from "../utils/sum"`);
    });
  });
});
