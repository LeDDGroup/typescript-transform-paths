// noinspection ES6UnusedImports
import * as path from "path";
import { createTsSolutionBuilder, EmittedFiles } from "../utils";
import { projectsPaths, ts } from "../config";

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

  beforeAll(() => {
    const builder = createTsSolutionBuilder({ tsInstance: ts, projectDir });
    emittedFiles = builder.getEmitFiles();
  });

  test(`Specifier for referenced project file resolves properly`, () => {
    expect(emittedFiles[indexFile].js).toMatch(`export { AReffedConst } from "../a/index"`);
    expect(emittedFiles[indexFile].dts).toMatch(`export { AReffedConst } from "../a/index"`);
  });

  test(`Specifier for local file resolves properly`, () => {
    expect(emittedFiles[indexFile].js).toMatch(`export { LocalConst } from "./local/index"`);
    expect(emittedFiles[indexFile].dts).toMatch(`export { LocalConst } from "./local/index"`);
  });
});
