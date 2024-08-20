import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";

import ts from "typescript";

import { nxTransformerPlugin } from "typescript-transform-paths";
import * as transformerModule from "../../dist/transformer";

import { projectsPaths } from "../config";
import { readTree } from "../utils";

describe(`NX Transformer`, () => {
  describe("Plugin", () => {
    let mockedTransformer: jest.SpyInstance;

    const program = { x: 1 };

    beforeAll(async () => {
      // @ts-expect-error TS(2345) FIXME: Argument of type '() => void' is not assignable to parameter of type '(transformationContext: TransformationContext) => (sourceFile: SourceFile) => SourceFile'.
      mockedTransformer = jest.spyOn(transformerModule, "default").mockReturnValue(() => {});
    });
    afterAll(() => {
      mockedTransformer.mockClear();
    });
    beforeEach(() => {
      mockedTransformer.mockReset();
    });

    test(`Before properly routes transform`, () => {
      const config = { a: 2 };

      // @ts-expect-error TS(2559) FIXME: Type '{ a: number; }' has no properties in common with type 'Omit<TsTransformPathsConfig, "transform">'.
      nxTransformerPlugin.before(config, program);

      expect(mockedTransformer).toHaveBeenCalledTimes(1);
      expect(mockedTransformer.mock.lastCall).toHaveLength(2);

      const [recProgram, recConfig] = mockedTransformer.mock.lastCall;
      expect(recProgram).toBe(program);
      expect(recConfig).toStrictEqual(config);
    });

    test(`After properly routes transform`, () => {
      const config = { a: 2, afterDeclarations: true };

      // @ts-expect-error TS(2345) FIXME: Argument of type '{ x: number; }' is not assignable to parameter of type 'Program'.
      nxTransformerPlugin.afterDeclarations(config, program);

      expect(mockedTransformer).toHaveBeenCalledTimes(1);
      expect(mockedTransformer.mock.lastCall).toHaveLength(2);

      const [recProgram, recConfig] = mockedTransformer.mock.lastCall;
      expect(recProgram).toBe(program);
      expect(recConfig).toStrictEqual({ ...config, afterDeclarations: true });
    });
  });

  describe(`(e2e) Works in NX project`, () => {
    const projectRoot = ts.normalizePath(path.join(projectsPaths, "nx"));

    // TODO - Investigate ways to do without emit
    test(`Transformer works for emitted declaration`, () => {
      execSync("yarn build", { cwd: projectRoot });

      try {
        expect(readTree(path.join(projectRoot, "dist"))).toMatchSnapshot();
      } finally {
        rmSync(`${projectRoot}/dist`, { recursive: true, force: true });
      }
    });
  });
});
