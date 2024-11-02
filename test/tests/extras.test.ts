import { createTsProgram, getEmitResultFromProgram, ModuleNotFoundError } from "../utils";
import { projectsPaths } from "../config";
import path from "node:path";
import ts from "typescript";
import * as config from "../config";
import { execSync } from "node:child_process";

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`Extra Tests`, () => {
  const projectRoot = ts.normalizePath(path.join(projectsPaths, "extras"));
  const indexFile = ts.normalizePath(path.join(projectRoot, "src/index.ts"));
  const tsConfigFile = ts.normalizePath(path.join(projectRoot, "tsconfig.json"));

  describe(`Built Tests`, () => {
    // see: https://github.com/LeDDGroup/typescript-transform-paths/issues/130
    test(`Transformer works without ts-node being present`, () => {
      jest.doMock(
        "ts-node",
        () => {
          throw new ModuleNotFoundError("ts-node");
        },
        { virtual: true },
      );
      try {
        const program = createTsProgram({ tsInstance: ts, tsConfigFile }, config.builtTransformerPath);
        const res = getEmitResultFromProgram(program);
        expect(res[indexFile].js).toMatch(`var _identifier_1 = require("./id")`);
      } finally {
        jest.dontMock("ts-node");
      }
    });

    describe(`ts-node register script`, () => {
      /** Yarn sometimes outputs bold text, which makes these tests flakey */
      function stripAnsi(str: string) {
        // eslint-disable-next-line no-control-regex
        return str.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "");
      }

      test(`Works with --transpileOnly`, () => {
        const res = execSync("yarn g:ts-node --transpileOnly src/index.ts", { cwd: projectRoot }).toString();
        expect(stripAnsi(res.trim())).toEqual("null");
      });

      test(`Works with --typeCheck`, () => {
        const res = execSync("yarn g:ts-node --typeCheck src/index.ts", { cwd: projectRoot }).toString();
        expect(stripAnsi(res.trim())).toEqual("null");
      });
    });
  });
});
