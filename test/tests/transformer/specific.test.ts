// noinspection ES6UnusedImports
import * as path from "node:path";
import {
  createTsProgram,
  EmittedFiles,
  getEmitResultFromProgram,
  getManualEmitResult,
  getTsNodeEmitResult,
} from "../../utils";
import { projectsPaths, ts, tsModules } from "../../config";
import { TsTransformPathsConfig } from "typescript-transform-paths";
import TS from "typescript";

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const baseConfig: TsTransformPathsConfig = { exclude: ["**/excluded/**", "excluded-file.*"] };

/* Test Mapping */
const modes = ["program", "manual", "ts-node"] as const;
const testConfigs: { label: string; tsInstance: any; mode: (typeof modes)[number]; tsSpecifier: string }[] = [];
for (const cfg of tsModules)
  testConfigs.push(...modes.map((mode) => ({ label: cfg[0], tsInstance: cfg[1], mode, tsSpecifier: cfg[2] })));

/* File Paths */
const projectRoot = ts.normalizePath(path.join(projectsPaths, "specific"));
const tsConfigFile = ts.normalizePath(path.join(projectsPaths, "specific/tsconfig.json"));
const genFile = ts.normalizePath(path.join(projectRoot, "generated/dir/gen-file.ts"));
const srcFile = ts.normalizePath(path.join(projectRoot, "src/dir/src-file.ts"));
const indexFile = ts.normalizePath(path.join(projectRoot, "src/index.ts"));
const tagFile = ts.normalizePath(path.join(projectRoot, "src/tags.ts"));
const typeElisionIndex = ts.normalizePath(path.join(projectRoot, "src/type-elision/index.ts"));
const subPackagesFile = ts.normalizePath(path.join(projectRoot, "src/sub-packages.ts"));
const moduleAugmentFile = ts.normalizePath(path.join(projectRoot, "src/module-augment.ts"));

/* ****************************************************************************************************************** *
 * Types
 * ****************************************************************************************************************** */

declare global {
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- no way to extend type definitions without using the same declaration as the original types
    interface Matchers<R> {
      transformedMatches(expected: RegExp | string, opt?: { base?: EmittedFiles[]; kind?: ("dts" | "js")[] }): void;
    }
  }
}

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`Specific Tests`, () => {
  describe.each(testConfigs)(`TypeScript $label - Mode: $mode`, ({ tsInstance, mode, tsSpecifier }) => {
    const tsVersion = +tsInstance.versionMajorMinor.split(".").slice(0, 2).join("");
    let normalEmit: EmittedFiles;
    let rootDirsEmit: EmittedFiles;
    let skipDts = false;

    beforeAll(() => {
      switch (mode) {
        case "program": {
          const program = createTsProgram({
            tsInstance,
            tsConfigFile,
            pluginOptions: {
              ...baseConfig,
              useRootDirs: false,
            },
          });
          normalEmit = getEmitResultFromProgram(program);

          const rootDirsProgram = createTsProgram({
            tsInstance,
            tsConfigFile,
            pluginOptions: {
              ...baseConfig,
              useRootDirs: true,
            },
          });
          rootDirsEmit = getEmitResultFromProgram(rootDirsProgram);
          break;
        }
        case "manual": {
          skipDts = true;
          const pcl = tsInstance.getParsedCommandLineOfConfigFile(
            tsConfigFile,
            {},
            <any>tsInstance.sys,
          )! as TS.ParsedCommandLine;
          normalEmit = getManualEmitResult({ ...baseConfig, useRootDirs: false }, tsInstance, pcl);
          rootDirsEmit = getManualEmitResult({ ...baseConfig, useRootDirs: true }, tsInstance, pcl);
          break;
        }
        case "ts-node": {
          const pcl = tsInstance.getParsedCommandLineOfConfigFile(
            tsConfigFile,
            {},
            <any>tsInstance.sys,
          )! as TS.ParsedCommandLine;
          skipDts = true;
          normalEmit = getTsNodeEmitResult({ ...baseConfig, useRootDirs: false }, pcl, tsSpecifier);
          rootDirsEmit = getTsNodeEmitResult({ ...baseConfig, useRootDirs: true }, pcl, tsSpecifier);
        }
      }

      expect.extend({
        transformedMatches(
          fileName: string,
          expected: RegExp | string,
          opt?: { base?: EmittedFiles[]; kind?: ("dts" | "js")[] },
        ) {
          const bases = opt?.base ?? [normalEmit, rootDirsEmit];
          const kinds = (opt?.kind ?? ["dts", "js"]).filter((k) => !skipDts || k !== "dts");

          let failed: boolean = false;
          const messages: string[] = [];
          for (const base of bases) {
            for (const kind of kinds) {
              const content = base[fileName][kind];
              const isValid = typeof expected === "string" ? content.includes(expected) : expected.test(content);
              if (!isValid) {
                failed = true;
                messages.push(
                  `File: ${fileName}\nKind: ${kind}\nrootDirs: ${base === normalEmit}\n\n` +
                    `Expected: \`${expected}\`\nReceived:\n\t${content.replaceAll(/(\r?\n)+/g, "$1\t")}`,
                );
              }
            }
          }

          return { message: () => messages.join("\n\n"), pass: !failed };
        },
      });
    });

    describe(`Options`, () => {
      test(`(useRootDirs: true) Re-maps for rootDirs`, () => {
        expect(genFile).transformedMatches(`import "./src-file"`, { base: [rootDirsEmit] });
        expect(srcFile).transformedMatches(`import "./gen-file"`, { base: [rootDirsEmit] });
        expect(indexFile).transformedMatches(`export { b } from "./dir/gen-file"`, { base: [rootDirsEmit] });
        expect(indexFile).transformedMatches(`export { a } from "./dir/src-file"`, { base: [rootDirsEmit] });
      });

      test(`(useRootDirs: false) Ignores rootDirs`, () => {
        expect(genFile).transformedMatches(`import "../../src/dir/src-file"`, { base: [normalEmit] });
        expect(srcFile).transformedMatches(`import "../../generated/dir/gen-file"`, { base: [normalEmit] });
        expect(indexFile).transformedMatches(`export { b } from "../generated/dir/gen-file"`, { base: [normalEmit] });
        expect(indexFile).transformedMatches(`export { a } from "./dir/src-file"`, { base: [normalEmit] });
      });

      test(`(exclude) Doesn't transform for exclusion patterns`, () => {
        expect(indexFile).transformedMatches(
          /export { bb } from "#exclusion\/ex";\s*export { dd } from "#root\/excluded-file"/,
        );
      });
    });

    describe(`Tags`, () => {
      test(`(@no-transform-path) Doesn't transform path`, () => {
        for (let i = 1; i <= 4; i++)
          expect(tagFile).transformedMatches(`import * as skipTransform${i} from "#root/index`);
      });

      test(`(@transform-path) Transforms path with explicit value`, () => {
        expect(tagFile).transformedMatches(`import * as explicitTransform1 from "./dir/src-file"`);
        expect(tagFile).transformedMatches(`import * as explicitTransform2 from "http://www.go.com/react.js"`);
        expect(tagFile).transformedMatches(`import * as explicitTransform3 from "./dir/src-file"`);
        expect(tagFile).transformedMatches(`import * as explicitTransform4 from "http://www.go.com/react.js"`);
      });
    });

    (mode === "program" ? test : test.skip)(`Type elision works properly`, () => {
      expect(typeElisionIndex).transformedMatches(/import { ConstB } from "\.\/a";\s*export { ConstB };/, {
        kind: ["js"],
      });
      expect(typeElisionIndex).transformedMatches(
        /import { ConstB, TypeA } from "\.\/a";\s*import { TypeA as TypeA2 } from "\.\/a";\s*export { ConstB, TypeA };\s*export { TypeA2 };/,
        { kind: ["dts"] },
      );

      if (tsVersion >= 50) {
        /* Import type-only keyword on import specifier */
        expect(typeElisionIndex).transformedMatches(/import { ConstB as __ } from "\.\/a";\s*export { __ };/, {
          kind: ["js"],
        });

        expect(typeElisionIndex).transformedMatches(
          /import { type TypeAndConst, ConstB as __ } from "\.\/a";\s*export { TypeAndConst, __ };/,
          { kind: ["dts"] },
        );

        /* Export Import type-only keyword on import specifier */
        expect(typeElisionIndex).transformedMatches(
          /import { TypeAndConst as TypeAndConst2, ConstB as ___ } from "\.\/a";\s*export { type TypeAndConst2, ___ };/,
          { kind: ["dts"] },
        );

        expect(typeElisionIndex).transformedMatches(
          /import { TypeAndConst as TypeAndConst2, ConstB as ___ } from "\.\/a";\s*export { ___ };/,
          { kind: ["js"] },
        );

        /* Unreferenced w/ type-only keyword on import specifier */
        expect(typeElisionIndex).not.transformedMatches(
          /import { ConstB as _{4}, type TypeAndConst as TypeAndConst3 } from "\.\/a";\s/,
          { kind: ["dts"] },
        );

        expect(typeElisionIndex).not.transformedMatches(/import { ConstB as _{4} } from "\.\/a";\s/, { kind: ["js"] });
      }
    });

    (!skipDts && tsVersion >= 38 ? test : test.skip)(`Import type-only transforms`, () => {
      expect(indexFile).transformedMatches(`import type { A as ATypeOnly } from "./dir/src-file"`, { kind: ["dts"] });
    });

    test(`Copies comments in async import`, () => {
      expect(indexFile).transformedMatches(`import(/* webpackChunkName: "Comment" */ "./dir/src-file");`, {
        kind: ["js"],
      });
      expect(indexFile).transformedMatches(
        /\/\/ comment 1\r?\n\s*\/\*\r?\n\s*comment 2\r?\n\s*\*\/\r?\n\s*"\.\/dir\/src-file"/,
        { kind: ["js"] },
      );
    });

    test(`Preserves explicit extensions`, () => {
      expect(indexFile).transformedMatches(`export { JsonValue } from "./data.json"`);
      expect(indexFile).transformedMatches(`export { GeneralConstA } from "./general"`);
      expect(indexFile).transformedMatches(`export { GeneralConstB } from "./general.js"`);
    });

    test(`Does not output implicit index filenames`, () => {
      expect(indexFile).transformedMatches(`export { ConstB } from "./type-elision"`);
    });

    test(`Resolves sub-modules properly`, () => {
      const a = {
        js: `export { packageAConst } from "./packages/pkg-a"`,
        full: `export { packageAConst, PackageAType } from "./packages/pkg-a"`,
      };
      const b = {
        js: `export { packageBConst } from "./packages/pkg-b"`,
        full: `export { packageBConst, PackageBType } from "./packages/pkg-b"`,
      };
      const c = {
        js: `export { packageCConst } from "./packages/pkg-c"`,
        full: `export { packageCConst, PackageCType } from "./packages/pkg-c"`,
      };
      const sub = {
        js: `export { subPackageConst } from "./packages/pkg-a/sub-pkg"`,
        full: `export { SubPackageType, subPackageConst } from "./packages/pkg-a/sub-pkg"`,
      };

      for (const exp of [a, b, c, sub]) {
        expect(subPackagesFile).transformedMatches(mode === "program" ? exp.js : exp.full, { kind: ["js"] });
        if (!skipDts) expect(subPackagesFile).transformedMatches(exp.full, { kind: ["dts"] });
      }

      expect(subPackagesFile).transformedMatches(`export { packageCConst as C2 } from "./packages/pkg-c/main"`);
      expect(subPackagesFile).transformedMatches(`export { packageCConst as C3 } from "./packages/pkg-c/main.js"`);
      expect(subPackagesFile).transformedMatches(
        `export { subPackageConst as C4 } from "./packages/pkg-a/sub-pkg/main"`,
      );
      expect(subPackagesFile).transformedMatches(
        `export { subPackageConst as C5 } from "./packages/pkg-a/sub-pkg/main.js"`,
      );
    });

    (!skipDts && tsVersion >= 38 ? test : test.skip)(`Resolves nested imports`, () => {
      expect(subPackagesFile).transformedMatches(
        `export ${
          tsVersion < 49 ? `declare ` : ""
        }type ImportWithChildren = import("./packages/pkg-a").PassThru<import("./packages/pkg-b").PackageBType>`,
        { kind: ["dts"] },
      );
    });

    (skipDts ? test.skip : test)(`Resolves module augmentation`, () => {
      expect(moduleAugmentFile).transformedMatches(`declare module "./general" {`, { kind: ["dts"] });
      expect(moduleAugmentFile).transformedMatches(`declare module "./excluded-file" {`, { kind: ["dts"] });
    });
  });
});
