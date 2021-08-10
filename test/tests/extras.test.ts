import { createTsProgram, getEmitResultFromProgram } from "../utils";
import { projectsPaths } from "./config";
import path from "path";
import ts from "typescript";
import * as config from "./config";
import { execSync } from "child_process";

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
          require("sdf0s39rf3333d@fake-module");
        },
        { virtual: true }
      );
      try {
        const program = createTsProgram({ tsInstance: ts, tsConfigFile }, config.builtTransformerPath);
        const res = getEmitResultFromProgram(program);
        expect(res[indexFile].js).toMatch(`var _identifier_1 = require("./id")`);
      } finally {
        jest.dontMock("ts-node");
      }
    });

    test(`Register script transforms with ts-node`, () => {
      const res = execSync("ts-node src/index.ts", { cwd: projectRoot }).toString();
      expect(res).toMatch(/^null($|\r?\n)/);
    });
  });
});
