// noinspection ES6UnusedImports
import {} from "ts-expose-internals";
import * as path from "path";
import { join } from "path";
import { createProgram, EmittedFiles, getEmitResult } from "./helpers";
import * as TS from "typescript";

/* ****************************************************************************************************************** *
 * Constants & Config
 * ****************************************************************************************************************** */

const ts = require("ttypescript") as typeof TS;
const fixturesPath = join(__dirname, "__fixtures");

/* ****************************************************************************************************************** *
 * Helpers
 * ****************************************************************************************************************** */

const makeRelative = (fileName: string, p: string, rootDir: string) => {
  let rel = ts.normalizePath(
    path.relative(path.dirname(fileName), path.join(rootDir, p))
  );
  if (rel[0] !== ".") rel = `./${rel}`;
  return `"${rel}"`;
};

const getExpected = (
  fileName: string,
  original: string,
  rootDir: string
): string =>
  original
    .replace(/"@(.*)"/g, (_, p) => makeRelative(fileName, p, rootDir))
    .replace(/"#utils\/(.*)"/g, (_, p) =>
      makeRelative(
        fileName,
        path.join(p === "hello" ? "secondary" : "utils", p),
        rootDir
      )
    )
    .replace('"path"', '"https://external.url/path.js"')
    .replace('"circular/a"', '"../circular/a"');

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`Transformer`, () => {
  describe("Bulk files", () => {
    const bulkPath = path.join(fixturesPath, "bulk");
    const tsConfigFile = path.join(bulkPath, "tsconfig.json");
    let originalFiles: EmittedFiles = {};
    let transformedFiles: EmittedFiles = {};

    const program = createProgram(tsConfigFile, true);
    const programWithTransformer = createProgram(tsConfigFile, false);
    const fileNames = program.getRootFileNames() as string[];

    beforeAll(() => {
      originalFiles = getEmitResult(program);
      transformedFiles = getEmitResult(programWithTransformer);
    });

    describe.each(fileNames.map((p) => [p.slice(bulkPath.length), p]))(
      `%s`,
      (_, file) => {
        let expected: EmittedFiles[string];
        let transformed: EmittedFiles[string];

        beforeAll(() => {
          transformed = transformedFiles[file];
          expected = {
            js: getExpected(file, originalFiles[file].js, bulkPath),
            dts: getExpected(file, originalFiles[file].dts, bulkPath),
          };
        });

        it(`js matches`, () => expect(transformed.js).toEqual(expected.js));
        it(`dts matches`, () => expect(transformed.dts).toEqual(expected.dts));
      }
    );
  });

  describe("Specific tests", () => {
    const specificPath = ts.normalizePath(path.join(fixturesPath, "specific"));
    const tsConfig = ts.normalizePath(
      path.join(fixturesPath, "specific/tsconfig.json")
    );
    const genFile = ts.normalizePath(
      path.join(specificPath, "generated/dir/gen-file.ts")
    );
    const srcFile = ts.normalizePath(
      path.join(specificPath, "src/dir/src-file.ts")
    );
    const indexFile = ts.normalizePath(path.join(specificPath, "src/index.ts"));

    let rootDirsEmit: EmittedFiles;
    let normalEmit: EmittedFiles;

    beforeAll(() => {
      const program = createProgram(tsConfig, false, undefined, {
        useRootDirs: false,
      });
      normalEmit = getEmitResult(program);

      const rootDirsProgram = createProgram(tsConfig, false, undefined, {
        useRootDirs: true,
      });
      rootDirsEmit = getEmitResult(rootDirsProgram);
    });

    test(`(useRootDirs: true) Re-maps for rootDirs`, () => {
      expect(rootDirsEmit[genFile].dts).toMatch(`import "./src-file"`);
      expect(rootDirsEmit[srcFile].dts).toMatch(`import "./gen-file"`);
      expect(rootDirsEmit[indexFile].dts).toMatch(
        `export { B } from "./dir/gen-file"`
      );
      expect(rootDirsEmit[indexFile].dts).toMatch(
        `export { A } from "./dir/src-file"`
      );
    });

    test(`Does not resolve external modules`, () => {
      expect(normalEmit[indexFile].dts).toMatch(
        `import "ts-expose-internals";`
      );
      expect(rootDirsEmit[indexFile].dts).toMatch(
        `import "ts-expose-internals";`
      );
    });

    test(`(useRootDirs: false) Ignores rootDirs`, () => {
      expect(normalEmit[genFile].dts).toMatch(
        `import "../../src/dir/src-file"`
      );
      expect(normalEmit[srcFile].dts).toMatch(
        `import "../../generated/dir/gen-file"`
      );
      expect(normalEmit[indexFile].dts).toMatch(
        `export { B } from "../generated/dir/gen-file"`
      );
      expect(normalEmit[indexFile].dts).toMatch(
        `export { A } from "./dir/src-file"`
      );
    });
  });
});
