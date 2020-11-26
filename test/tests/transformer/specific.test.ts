// noinspection ES6UnusedImports
import {} from "ts-expose-internals";
import * as path from "path";
import { createTsProgram, EmittedFiles, getEmitResult } from "../../utils";
import { projectsPaths, ts, tsModules } from "../config";

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`Transformer -> Specific Cases`, () => {
  const projectRoot = ts.normalizePath(path.join(projectsPaths, "specific"));
  const tsConfigFile = ts.normalizePath(path.join(projectsPaths, "specific/tsconfig.json"));
  const genFile = ts.normalizePath(path.join(projectRoot, "generated/dir/gen-file.ts"));
  const srcFile = ts.normalizePath(path.join(projectRoot, "src/dir/src-file.ts"));
  const indexFile = ts.normalizePath(path.join(projectRoot, "src/index.ts"));
  const typeElisionIndex = ts.normalizePath(path.join(projectRoot, "src/type-elision/index.ts"));

  describe.each(tsModules)(`TypeScript %s`, (s, tsInstance) => {
    let rootDirsEmit: EmittedFiles;
    let normalEmit: EmittedFiles;
    const tsVersion = +tsInstance.versionMajorMinor.split(".").slice(0, 2).join("");

    beforeAll(() => {
      const program = createTsProgram({ tsInstance, tsConfigFile, pluginOptions: { useRootDirs: false } });
      normalEmit = getEmitResult(program);

      const rootDirsProgram = createTsProgram({ tsInstance, tsConfigFile, pluginOptions: { useRootDirs: true } });
      rootDirsEmit = getEmitResult(rootDirsProgram);
    });

    test(`(useRootDirs: true) Re-maps for rootDirs`, () => {
      expect(rootDirsEmit[genFile].dts).toMatch(`import "./src-file"`);
      expect(rootDirsEmit[srcFile].dts).toMatch(`import "./gen-file"`);
      expect(rootDirsEmit[indexFile].dts).toMatch(`export { B } from "./dir/gen-file"`);
      expect(rootDirsEmit[indexFile].dts).toMatch(`export { A } from "./dir/src-file"`);
    });

    test(`Does not resolve external modules`, () => {
      expect(normalEmit[indexFile].dts).toMatch(`import "ts-expose-internals";`);
      expect(rootDirsEmit[indexFile].dts).toMatch(`import "ts-expose-internals";`);
    });

    test(`Type elision works properly`, () => {
      expect(normalEmit[typeElisionIndex].js).toMatch(/import { ConstB } from "\.\/a";\s*export { ConstB };/);
      expect(normalEmit[typeElisionIndex].dts).toMatch(
        /import { ConstB, TypeA } from "\.\/a";\s*import { TypeA as TypeA2 } from "\.\/a";\s*export { ConstB, TypeA };\s*export { TypeA2 };/
      );
    });

    (tsVersion >= 38 ? test : test.skip)(`Import type-only transforms`, () => {
      expect(normalEmit[indexFile].dts).toMatch(`import type { A as ATypeOnly } from "./dir/src-file"`);
    });

    test(`Copies comments in async import`, () => {
      expect(normalEmit[indexFile].js).toMatch(`import(/* webpackChunkName: "Comment" */ "./dir/src-file");`);
      expect(normalEmit[indexFile].js).toMatch(
        /\/\/ comment 1\r?\n\s*\r?\n\/\*\r?\n\s*comment 2\r?\n\s*\*\/\r?\n\s*"\.\.\/generated\/dir\/gen-file"/
      );
    });

    test(`(useRootDirs: false) Ignores rootDirs`, () => {
      expect(normalEmit[genFile].dts).toMatch(`import "../../src/dir/src-file"`);
      expect(normalEmit[srcFile].dts).toMatch(`import "../../generated/dir/gen-file"`);
      expect(normalEmit[indexFile].dts).toMatch(`export { B } from "../generated/dir/gen-file"`);
      expect(normalEmit[indexFile].dts).toMatch(`export { A } from "./dir/src-file"`);
    });
  });
});
