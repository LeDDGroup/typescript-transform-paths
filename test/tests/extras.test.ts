import { createTsProgram, getEmitResultFromProgram, getRelativeEmittedFiles, ModuleNotFoundError } from "../utils";
import { projectsPaths } from "../config";
import path from "node:path";
import ts from "typescript";
import * as config from "../config";
import { execSync } from "node:child_process";

beforeEach(() => {
  jest.resetAllMocks();
});

describe(`Extra Tests`, () => {
  const projectRoot = ts.normalizePath(path.join(projectsPaths, "extras"));
  const tsConfigFile = ts.normalizePath(path.join(projectRoot, "tsconfig.json"));

  describe(`Built Tests`, () => {
    // see: https://github.com/LeDDGroup/typescript-transform-paths/issues/130
    test(`Transformer works without ts-node being present`, () => {
      jest.doMock("ts-node", () => {
        throw new ModuleNotFoundError("ts-node");
      });
      const program = createTsProgram({ tsInstance: ts, tsConfigFile }, config.builtTransformerPath);
      const res = getEmitResultFromProgram(program);
      expect(getRelativeEmittedFiles(projectRoot, res)).toMatchInlineSnapshot(`
{
  "src/id.ts": {
    "dts": "export declare const b: any;
",
    "js": "export const b = null;
",
  },
  "src/index.ts": {
    "dts": "export * from "./id";
",
    "js": "export * from "./id";
import { b } from "./id";
console.log(b);
",
  },
}
`);
    });

    describe(`ts-node register script`, () => {
      test(`Works with --transpileOnly`, () => {
        expect(
          execSync("yarn g:ts-node --transpileOnly src/index.ts", { cwd: projectRoot }).toString().trim(),
        ).toMatchInlineSnapshot(`"null"`);
      });

      test(`Works with --typeCheck`, () => {
        expect(
          execSync("yarn g:ts-node --typeCheck src/index.ts", { cwd: projectRoot }).toString().trim(),
        ).toMatchInlineSnapshot(`"null"`);
      });
    });
  });
});
