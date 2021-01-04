// noinspection ES6UnusedImports
import {} from "ts-expose-internals";
import * as path from "path";
import { createTsProgram, EmittedFiles, getEmitResult } from "../../utils";
import { projectsPaths, ts, tsModules, tTypeScript } from "../config";
import { TsTransformPathsConfig } from "../../../src/types";

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

// TODO - In the future, remove this and create a separate small short test for TTS using a single SourceFile,
//        as we only need to test that it runs the transformer. No other behaviour will differ.
let testTsModules = <const>[...tsModules, ["Latest (ttypescript)", tTypeScript]];

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
  const baseConfig: TsTransformPathsConfig = { exclude: ["**/excluded/**", "excluded-file.*"] };

  describe.each(testTsModules)(`TypeScript %s`, (s, tsInstance) => {
    let rootDirsEmit: EmittedFiles;
    let normalEmit: EmittedFiles;
    const tsVersion = +tsInstance.versionMajorMinor.split(".").slice(0, 2).join("");

    beforeAll(() => {
      const program = createTsProgram({
        tsInstance,
        tsConfigFile,
        pluginOptions: {
          ...baseConfig,
          useRootDirs: false,
        },
      });
      normalEmit = getEmitResult(program);

      const rootDirsProgram = createTsProgram({
        tsInstance,
        tsConfigFile,
        pluginOptions: {
          ...baseConfig,
          useRootDirs: true,
        },
      });
      rootDirsEmit = getEmitResult(rootDirsProgram);
    });

    test(`(useRootDirs: true) Re-maps for rootDirs`, () => {
      expect(rootDirsEmit[genFile].dts).toMatch(`import "./src-file"`);
      expect(rootDirsEmit[srcFile].dts).toMatch(`import "./gen-file"`);
      expect(rootDirsEmit[indexFile].dts).toMatch(`export { B } from "./dir/gen-file"`);
      expect(rootDirsEmit[indexFile].dts).toMatch(`export { A } from "./dir/src-file"`);
    });

    test(`(useRootDirs: false) Ignores rootDirs`, () => {
      expect(normalEmit[genFile].dts).toMatch(`import "../../src/dir/src-file"`);
      expect(normalEmit[srcFile].dts).toMatch(`import "../../generated/dir/gen-file"`);
      expect(normalEmit[indexFile].dts).toMatch(`export { B } from "../generated/dir/gen-file"`);
      expect(normalEmit[indexFile].dts).toMatch(`export { A } from "./dir/src-file"`);
    });

      test(`(exclude) Doesn't transform for exclusion patterns`, () => {
        expect(rootDirsEmit[indexFile].dts).toMatch(
          /export { BB } from "#exclusion\/ex";\s*export { DD } from "#root\/excluded-file";/
        );
      });
    });

    describe(`Tags`, () => {
      test(`(@no-transform-path) Doesn't transform path`, () => {
        const regex = /^import \* as skipTransform\d from "#root\/index"/gm;
        const expectedLength = tsInstance.versionMajorMinor === '3.6' ? 8 : 16;
        const matches = [
          ...(normalEmit[tagFile].dts.match(regex) ?? []),
          ...(rootDirsEmit[tagFile].dts.match(regex) ?? []),
          ...(normalEmit[tagFile].js.match(regex) ?? []),
          ...(rootDirsEmit[tagFile].js.match(regex) ?? []),
        ];
        expect(matches).toHaveLength(expectedLength);
      });

      test(`(@transform-path) Transforms path with explicit value`, () => {
        const regex1 = /^import \* as explicitTransform\d from "\.\/dir\/src-file"/gm;
        const regex2 = /^import \* as explicitTransform\d from "http:\/\/www\.go\.com\/react\.js"/gm;
        const expectedLength = tsInstance.versionMajorMinor === '3.6' ? 4 : 8;

        const matches1 = [
          ...(normalEmit[tagFile].dts.match(regex1) ?? []),
          ...(rootDirsEmit[tagFile].dts.match(regex1) ?? []),
          ...(normalEmit[tagFile].js.match(regex1) ?? []),
          ...(rootDirsEmit[tagFile].js.match(regex1) ?? []),
        ];
        expect(matches1).toHaveLength(expectedLength);

        const matches2 = [
          ...(normalEmit[tagFile].dts.match(regex2) ?? []),
          ...(rootDirsEmit[tagFile].dts.match(regex2) ?? []),
          ...(normalEmit[tagFile].js.match(regex2) ?? []),
          ...(rootDirsEmit[tagFile].js.match(regex2) ?? []),
        ];
        expect(matches2).toHaveLength(expectedLength);
      });
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
  });
});
