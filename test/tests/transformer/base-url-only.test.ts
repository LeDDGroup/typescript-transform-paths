import assert from "node:assert";
import * as path from "node:path";
import { before, describe, test } from "node:test";

import { projectsPaths, type ts, tsModules } from "../../config.ts";
import { createTsProgram, getEmitResultFromProgram, type EmittedFiles } from "../../utils/index.ts";

describe(`Transformer -> baseUrl-only Tests`, () => {
  const projectRoot = path.join(projectsPaths, "base-url-only");
  const tsConfigFile = path.join(projectRoot, "tsconfig.json");

  for (const [s, tsInstance] of tsModules) {
    describe(`TypeScript ${s}`, () => {
      const indexFile = (tsInstance as typeof ts).normalizePath(path.join(projectRoot, "src/index.ts"));
      let transformedFiles: EmittedFiles = {};

      before(() => {
        const programWithTransformer = createTsProgram({ tsInstance: tsInstance as typeof ts, tsConfigFile });
        transformedFiles = getEmitResultFromProgram(programWithTransformer);
      });

      test(`transforms local baseUrl imports`, () => {
        assert.match(transformedFiles[indexFile].js, /from "\.\/local"/);
        assert.match(transformedFiles[indexFile].js, /from "\.\/nested\/value"/);
      });

      test(`does not transform external package imports`, () => {
        assert.match(transformedFiles[indexFile].dts, /from "typescript"/);
      });
    });
  }
});
