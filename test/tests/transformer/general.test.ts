// noinspection ES6UnusedImports
import * as path from "node:path";
import { createTsProgram, EmittedFiles, getEmitResultFromProgram } from "../../utils";
import { ts, tsModules, projectsPaths } from "../../config";

/* ****************************************************************************************************************** *
 * Helpers
 * ****************************************************************************************************************** */

const makeRelative = (tsInstance: typeof ts, fileName: string, p: string, rootDir: string) => {
  let rel = tsInstance.normalizePath(path.relative(path.dirname(fileName), path.join(rootDir, p)));
  if (rel[0] !== ".") rel = `./${rel}`;
  return `"${rel}"`;
};

const getExpected = (tsInstance: typeof ts, fileName: string, original: string, rootDir: string): string =>
  original
    .replaceAll(/"@(.*)"/g, (_, p) => makeRelative(tsInstance, fileName, p, rootDir))
    .replaceAll(/"#utils\/(.*)"/g, (_, p) =>
      makeRelative(tsInstance, fileName, path.join(p === "hello" ? "secondary" : "utils", p), rootDir),
    )
    .replace('"path"', '"https://external.url/path.js"')
    .replace('"circular/a"', '"../circular/a"');

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`Transformer -> General Tests`, () => {
  const projectRoot = path.join(projectsPaths, "general");
  const tsConfigFile = path.join(projectRoot, "tsconfig.json");

  describe.each(tsModules)(`TypeScript %s`, (s, tsInstance) => {
    let originalFiles: EmittedFiles = {};
    let transformedFiles: EmittedFiles = {};

    const program = createTsProgram({ tsInstance: tsInstance as typeof ts, tsConfigFile, disablePlugin: true });
    const programWithTransformer = createTsProgram({ tsInstance: tsInstance as typeof ts, tsConfigFile });
    const fileNames = program.getRootFileNames() as string[];

    beforeAll(() => {
      originalFiles = getEmitResultFromProgram(program);
      transformedFiles = getEmitResultFromProgram(programWithTransformer);
    });

    describe.each(fileNames!.map((p) => [p.slice(projectRoot.length), p]))(`%s`, (_, file) => {
      let expected: EmittedFiles[string];
      let transformed: EmittedFiles[string];

      beforeAll(() => {
        transformed = transformedFiles[file];
        expected = {
          // @ts-expect-error TS(2345) FIXME: Argument of type 'typeof ts | typeof ts | typeof import("typescript")' is not assignable to parameter of type 'typeof import("typescript")'.
          js: getExpected(tsInstance, file, originalFiles[file].js, projectRoot),
          // @ts-expect-error TS(2345) FIXME: Argument of type 'typeof ts | typeof ts | typeof import("typescript")' is not assignable to parameter of type 'typeof import("typescript")'.
          dts: getExpected(tsInstance, file, originalFiles[file].dts, projectRoot),
        };
      });

      test(`js matches`, () => expect(transformed.js).toEqual(expected.js));
      test(`dts matches`, () => expect(transformed.dts).toEqual(expected.dts));
    });
  });
});
