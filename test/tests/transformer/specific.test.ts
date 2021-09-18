/**
 * Note: To make debug testing easier, you can use the following environment variables to control what tests run:
 *
 *   TS_MODULES     - comma separated string of name fields in `tsModules` (config.ts)
 *   MODES          - comma separated string of `modes` (see config heading below)
 *   OUTPUT_MODES   - comma separated string of `outputModes` (see config heading below)
 *
 * Example — only test latest TS, using program and ts-node, with outputMode 'esm':
 *   TS_MODULES=latest;
 *   MODES=program,ts-node;
 *   OUTPUT_MODES=esm;
 */
// noinspection ES6UnusedImports
import {} from "ts-expose-internals";
import * as path from "path";
import {
  createTsProgram,
  EmittedFiles,
  getEmitResultFromProgram,
  getManualEmitResult,
  getTsNodeEmitResult,
} from "../../utils";
import { projectsPaths, ts, tsModules } from "../../config";
import { TsTransformPathsConfig } from "../../../src";
import TS from "typescript";

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const baseConfig: TsTransformPathsConfig = { exclude: ["**/excluded/**", "excluded-file.*"] };

const modes = ["program", "manual", "ts-node"] as const;
const outputModes = ["[default]", "commonjs", "esm"] as const;

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
 * Setup
 * ****************************************************************************************************************** */

const testConfigs = (function prepareConfigs() {
  let { TS_MODULES, MODES, OUTPUT_MODES } = process.env;
  const opt = {
    modules: TS_MODULES?.split(",").map((m) => m.trim().toLowerCase()),
    modes: MODES?.split(",").map((m) => m.trim().toLowerCase()),
    outputModes: OUTPUT_MODES?.split(",").map((m) => m.trim().toLowerCase()),
  };

  const cfgTsModules = !opt.modules ? tsModules : tsModules.filter((m) => opt.modules!.includes(m[0].toLowerCase()));
  const cfgModes = !opt.modes ? modes : modes.filter((m) => opt.modes!.includes(m.toLowerCase()));
  const cfgOutputModes = !opt.outputModes
    ? outputModes
    : outputModes.filter((m) => opt.outputModes!.includes(m.toLowerCase()));

  const res: {
    label: string;
    tsInstance: any;
    mode: typeof modes[number];
    tsSpecifier: string;
    config: TsTransformPathsConfig;
    outputMode: typeof outputModes[number];
  }[] = [];

  cfgTsModules.forEach((cfg) =>
    cfgOutputModes.forEach((outputMode) =>
      res.push(
        ...cfgModes.map((mode) => ({
          label: cfg[0],
          tsInstance: cfg[1],
          mode,
          tsSpecifier: cfg[2],
          config: {
            ...baseConfig,
            outputMode: outputMode === "[default]" ? void 0 : outputMode,
          },
          outputMode,
        }))
      )
    )
  );

  return res;
})();

/* ****************************************************************************************************************** *
 * Types
 * ****************************************************************************************************************** */

interface TransformedMatchesOpt {
  base?: EmittedFiles[];
  kind?: ("dts" | "js")[];
  noEsmFix?: boolean;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      transformedMatches(expected: RegExp | string, opt?: TransformedMatchesOpt): void;
    }
  }
}

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`Specific Tests`, () => {
  describe.each(testConfigs)(
    `TypeScript $label - Mode: $mode - OutputMode: $outputMode`,
    ({ tsInstance, mode, tsSpecifier, config, outputMode }) => {
      const tsVersion = +tsInstance.versionMajorMinor.split(".").slice(0, 2).join("");
      let normalEmit: EmittedFiles;
      let rootDirsEmit: EmittedFiles;
      let skipDts = false;

      beforeAll(() => {
        switch (mode) {
          case "program":
            const program = createTsProgram({
              tsInstance,
              tsConfigFile,
              pluginOptions: {
                ...config,
                useRootDirs: false,
              },
            });
            normalEmit = getEmitResultFromProgram(program);

            const rootDirsProgram = createTsProgram({
              tsInstance,
              tsConfigFile,
              pluginOptions: {
                ...config,
                useRootDirs: true,
              },
            });
            rootDirsEmit = getEmitResultFromProgram(rootDirsProgram);
            break;
          case "manual": {
            skipDts = true;
            const pcl = tsInstance.getParsedCommandLineOfConfigFile(
              tsConfigFile,
              {},
              <any>tsInstance.sys
            )! as TS.ParsedCommandLine;
            normalEmit = getManualEmitResult({ ...config, useRootDirs: false }, tsInstance, pcl);
            rootDirsEmit = getManualEmitResult({ ...config, useRootDirs: true }, tsInstance, pcl);
            break;
          }
          case "ts-node": {
            const pcl = tsInstance.getParsedCommandLineOfConfigFile(
              tsConfigFile,
              {},
              <any>tsInstance.sys
            )! as TS.ParsedCommandLine;
            skipDts = true;
            normalEmit = getTsNodeEmitResult({ ...config, useRootDirs: false }, pcl, tsSpecifier);
            rootDirsEmit = getTsNodeEmitResult({ ...config, useRootDirs: true }, pcl, tsSpecifier);
          }
        }

        expect.extend({
          transformedMatches(fileName: string, expected: RegExp | string, opt?: TransformedMatchesOpt) {
            const bases = opt?.base ?? [normalEmit, rootDirsEmit];
            const kinds = (opt?.kind ?? ["dts", "js"]).filter((k) => !skipDts || k !== "dts");

            let failed: boolean = false;
            const messages: string[] = [];
            for (const base of bases) {
              for (const kind of kinds) {
                const content = base[fileName][kind];
                const exp = getExpected(kind);
                const isValid = typeof exp === "string" ? content.indexOf(exp) >= 0 : exp.test(content);
                if (!isValid) {
                  failed = true;
                  messages.push(
                    `File: ${fileName}\nKind: ${kind}\nrootDirs: ${base === normalEmit}\n\n` +
                      `Expected: \`${exp}\`\nReceived:\n\t${content.replace(/(\r?\n)+/g, "$1\t")}`
                  );
                }
              }
            }

            return { message: () => messages.join("\n\n"), pass: !failed };

            function getExpected(kind: "dts" | "js") {
              if (!(expected instanceof RegExp) && !opt?.noEsmFix && kind === "js" && outputMode === "esm") {
                const regEx = /"\.(.+?)"/g;
                let res: string = "";

                let match: RegExpExecArray | null;
                let lastIndex = 0;
                while ((match = regEx.exec(expected)) !== null) {
                  let p = match[1];
                  if (!path.extname(p)) p += ".js";
                  res += expected.slice(lastIndex, match.index) + `".${p}"`;
                  lastIndex = res.length;
                }

                return res;
              }

              return expected;
            }
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
            /export { bb } from "#exclusion\/ex";\s*export { dd } from "#root\/excluded-file"/
          );
        });
      });

      describe(`Tags`, () => {
        test(`(@no-transform-path) Doesn't transform path`, () => {
          for (let i = 1; i <= 4; i++)
            expect(tagFile).transformedMatches(`import * as skipTransform${i} from "#root\/index`);
        });

        test(`(@transform-path) Transforms path with explicit value`, () => {
          expect(tagFile).transformedMatches(`import * as explicitTransform1 from "./dir/src-file"`, {
            noEsmFix: true,
          });
          expect(tagFile).transformedMatches(`import * as explicitTransform2 from "http://www.go.com/react.js"`);
          expect(tagFile).transformedMatches(`import * as explicitTransform3 from "./dir/src-file"`, {
            noEsmFix: true,
          });
          expect(tagFile).transformedMatches(`import * as explicitTransform4 from "http://www.go.com/react.js"`);
        });
      });

      (mode === "program" ? test : test.skip)(`Type elision works properly`, () => {
        expect(typeElisionIndex).transformedMatches(
          outputMode === "esm"
            ? /import { ConstB } from "\.\/a\.js";\s*export { ConstB };/
            : /import { ConstB } from "\.\/a";\s*export { ConstB };/,
          { kind: ["js"] }
        );
        expect(typeElisionIndex).transformedMatches(
          /import { ConstB, TypeA } from "\.\/a";\s*import { TypeA as TypeA2 } from "\.\/a";\s*export { ConstB, TypeA };\s*export { TypeA2 };/,
          { kind: ["dts"] }
        );
      });

      (!skipDts && tsVersion >= 38 ? test : test.skip)(`Import type-only transforms`, () => {
        expect(indexFile).transformedMatches(`import type { A as ATypeOnly } from "./dir/src-file"`, { kind: ["dts"] });
      });

      test(`Copies comments in async import`, () => {
        expect(indexFile).transformedMatches(`import(/* webpackChunkName: "Comment" */ "./dir/src-file");`, {
          kind: ["js"],
        });
        expect(indexFile).transformedMatches(
          /\/\/ comment 1\r?\n\s*\r?\n\/\*\r?\n\s*comment 2\r?\n\s*\*\/\r?\n\s*"\.\/dir\/src-file(\.js)?"/,
          { kind: ["js"] }
        );
      });

      test(`Preserves explicit extensions`, () => {
        expect(indexFile).transformedMatches(`export { JsonValue } from "./data.json"`);
        expect(indexFile).transformedMatches(`export { GeneralConstA } from "./general"`);
        expect(indexFile).transformedMatches(`export { GeneralConstB } from "./general.js"`);
      });

      test(`Properly handles implicit index filenames`, () => {
        const implicitMatch = `export { ConstB } from "./type-elision"`;
        const explicitMatch = `export { ConstB } from "./type-elision/index.js"`;

        expect(indexFile).transformedMatches(outputMode === "esm" ? explicitMatch : implicitMatch, { kind: ["js"] });
        expect(indexFile).transformedMatches(implicitMatch, { kind: ["dts"] });
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
          expect(subPackagesFile).transformedMatches(mode !== "program" ? exp.full : exp.js, {
            kind: ["js"],
            noEsmFix: true,
          });
          if (!skipDts) expect(subPackagesFile).transformedMatches(exp.full, { kind: ["dts"] });
        }

        expect(subPackagesFile).transformedMatches(`export { packageCConst as C2 } from "./packages/pkg-c/main"`);
        expect(subPackagesFile).transformedMatches(`export { packageCConst as C3 } from "./packages/pkg-c/main.js"`);
        expect(subPackagesFile).transformedMatches(
          `export { subPackageConst as C4 } from "./packages/pkg-a/sub-pkg/main"`
        );
        expect(subPackagesFile).transformedMatches(
          `export { subPackageConst as C5 } from "./packages/pkg-a/sub-pkg/main.js"`
        );
      });

      (!skipDts ? test : test.skip)(`Resolves module augmentation`, () => {
        expect(moduleAugmentFile).transformedMatches(`declare module "./general" {`, { kind: ["dts"] });
        expect(moduleAugmentFile).transformedMatches(`declare module "./excluded-file" {`, { kind: ["dts"] });
      });
    }
  );
});
