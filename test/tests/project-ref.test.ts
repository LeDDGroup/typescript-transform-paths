// noinspection ES6UnusedImports
import * as path from "node:path";
import { before, describe, test } from "node:test";

import { projectsPaths, ts } from "../config.ts";
import { createTsSolutionBuilder, type EmittedFiles } from "../utils/index.ts";

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

/* File Paths */
const projectDir = ts.normalizePath(path.join(projectsPaths, "project-ref"));
const indexFile = ts.normalizePath(path.join(projectDir, "lib/b/index.ts"));

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

// see: https://github.com/LeDDGroup/typescript-transform-paths/issues/125
describe(`Project References`, () => {
  let emittedFiles: EmittedFiles;

  before(() => {
    const builder = createTsSolutionBuilder({ tsInstance: ts, projectDir });
    emittedFiles = builder.getEmitFiles();
  });

  test(`Specifier for referenced project file resolves properly`, (t) => {
    t.assert.match(emittedFiles[indexFile].js, /export { AReffedConst } from "..\/a\/index"/);
    t.assert.match(emittedFiles[indexFile].dts, /export { AReffedConst } from "..\/a\/index"/);
  });

  test(`Specifier for local file resolves properly`, (t) => {
    t.assert.match(emittedFiles[indexFile].js, /export { LocalConst } from ".\/local\/index"/);
    t.assert.match(emittedFiles[indexFile].dts, /export { LocalConst } from ".\/local\/index"/);
  });
});
