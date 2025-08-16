import escapeStringRegexp from "escape-string-regexp";
import { execSync } from "node:child_process";
import path from "node:path";
import test, { describe } from "node:test";
import ts from "typescript";
import * as config from "../config";
import { projectsPaths } from "../config";
import { createTsProgram, getEmitResultFromProgram, ModuleNotFoundError } from "../utils";
import { stripVTControlCharacters } from "node:util";

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`Extra Tests`, () => {
  const projectRoot = ts.normalizePath(path.join(projectsPaths, "extras"));
  const indexFile = ts.normalizePath(path.join(projectRoot, "src/index.ts"));
  const tsConfigFile = ts.normalizePath(path.join(projectRoot, "tsconfig.json"));

  describe(`Built Tests`, () => {
    // see: https://github.com/LeDDGroup/typescript-transform-paths/issues/130
    // test(`Transformer works without ts-node being present`, (t) => {
    //   jest.doMock(
    //     "ts-node",
    //     () => {
    //       throw new ModuleNotFoundError("ts-node");
    //     },
    //     { virtual: true },
    //   );
    //   try {
    //     const program = createTsProgram({ tsInstance: ts, tsConfigFile }, config.builtTransformerPath);
    //     const res = getEmitResultFromProgram(program);
    //     t.assert.match(res[indexFile].js, new RegExp(escapeStringRegexp(`var _identifier_1 = require("./id")`)));
    //     expect(res[indexFile].js).toMatch(`var _identifier_1 = require("./id")`);
    //   } finally {
    //     jest.dontMock("ts-node");
    //   }
    // });

    describe(`ts-node register script`, () => {
      test(`Works with --transpileOnly`, (t) => {
        const res = execSync("yarn g:ts-node --transpileOnly src/index.ts", { cwd: projectRoot }).toString();
        t.assert.equal(stripVTControlCharacters(res.trim()), "null");
      });

      test(`Works with --typeCheck`, (t) => {
        const res = execSync("yarn g:ts-node --typeCheck src/index.ts", { cwd: projectRoot }).toString();
        t.assert.equal(stripVTControlCharacters(res.trim()), "null");
      });
    });
  });
});
