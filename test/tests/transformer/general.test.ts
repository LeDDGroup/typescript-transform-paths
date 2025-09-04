// noinspection ES6UnusedImports
import * as path from "node:path";
import { describe, before, test } from "node:test";
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

  for (const [s, tsInstance] of tsModules)
    describe(`TypeScript ${s}`, () => {
      let originalFiles: EmittedFiles = {};
      let transformedFiles: EmittedFiles = {};

      const program = createTsProgram({ tsInstance: tsInstance as typeof ts, tsConfigFile, disablePlugin: true });
      const programWithTransformer = createTsProgram({ tsInstance: tsInstance as typeof ts, tsConfigFile });
      const fileNames = program.getRootFileNames() as string[];

      before(() => {
        originalFiles = getEmitResultFromProgram(program);
        transformedFiles = getEmitResultFromProgram(programWithTransformer);
      });

      for (const file of fileNames!) {
        describe(file, () => {
          let expected: EmittedFiles[string];
          let transformed: EmittedFiles[string];

          before(() => {
            transformed = transformedFiles[file];
            expected = {
              js: getExpected(tsInstance, file, originalFiles[file].js, projectRoot),
              dts: getExpected(tsInstance, file, originalFiles[file].dts, projectRoot),
            };
          });

          test(`js matches`, (t) => t.assert.strictEqual(transformed.js, expected.js));
          test(`dts matches`, (t) => t.assert.strictEqual(transformed.dts, expected.dts));
        });
      }
    });
});
