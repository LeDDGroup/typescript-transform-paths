import ts from "typescript";
import { nxTransformerPlugin } from "typescript-transform-paths";
import path from "path";
import { projectsPaths } from "../config";
import { execSync } from "child_process";
import { readFileSync, rmSync } from "fs";
import * as transformerModule from "typescript-transform-paths/dist/transformer";

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`NX Transformer`, () => {
  describe("Plugin", () => {
    let mockedTransformer: jest.SpyInstance;

    const program: any = { x: 1 };

    beforeAll(async () => {
      mockedTransformer = jest.spyOn(transformerModule, "default").mockReturnValue(<any>(() => {}));
    });
    afterAll(() => {
      mockedTransformer.mockClear();
    });
    beforeEach(() => {
      mockedTransformer.mockReset();
    });

    test(`Before properly routes transform`, () => {
      const config: any = { a: 2 };

      nxTransformerPlugin.before(config, program);

      expect(mockedTransformer).toBeCalledTimes(1);
      expect(mockedTransformer.mock.lastCall).toHaveLength(2);

      const [recProgram, recConfig] = mockedTransformer.mock.lastCall;
      expect(recProgram).toBe(program);
      expect(recConfig).toStrictEqual(config);
    });

    test(`After properly routes transform`, () => {
      const config: any = { a: 2, afterDeclarations: true };

      nxTransformerPlugin.afterDeclarations(config, program);

      expect(mockedTransformer).toBeCalledTimes(1);
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
      execSync("yarn run build", { cwd: projectRoot });

      try {
        const file = readFileSync(`${projectRoot}/dist/library1/packages/library1/src/index.d.ts`, "utf8");
        expect(file).toMatch(/import { name as library2Name } from "..\/..\/library2\/src";/);
      } finally {
        rmSync(`${projectRoot}/dist`, { recursive: true, force: true });
      }
    });
  });
});
