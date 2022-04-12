import ts from "typescript";
import type transformer from "../../src";
import type { nxTransformerPlugin } from "../../src";
import { TsTransformPathsConfig } from "../../types";

describe(`NX Transformer Plugin`, () => {
  const configs: TsTransformPathsConfig[] = [
    { before: true, afterDeclarations: false },
    { before: false, afterDeclarations: true, useRootDirs: false },
    { before: true, afterDeclarations: true, exclude: [""] },
    { before: true, afterDeclarations: true, useRootDirs: true },
  ];

  let mockedTransformer: jest.MockedFunction<typeof transformer>;
  let nxTransformerPluginModule: typeof nxTransformerPlugin;

  beforeAll(async () => {
    jest.mock("../../src/transformer");

    nxTransformerPluginModule = (await import("../../src")).nxTransformerPlugin;
    mockedTransformer = (await import("../../src")).default as jest.MockedFunction<typeof transformer>;
  });
  afterAll(() => {
    mockedTransformer.mockReset();
  });

  test.each(configs)("correct behavior for specific config", (pluginConfig) => {
    const program: ts.Program = {} as any;
    nxTransformerPluginModule.before(pluginConfig, program);
    if (pluginConfig.before) {
      expect(mockedTransformer).toBeCalledTimes(1);
      const config = { ...pluginConfig, afterDeclarations: false };
      delete config["before"];
      expect(mockedTransformer).toBeCalledWith(program, config);
    } else {
      expect(mockedTransformer).toBeCalledTimes(0);
    }

    mockedTransformer.mockClear();

    nxTransformerPluginModule.afterDeclarations(pluginConfig, program);
    if (pluginConfig.afterDeclarations) {
      expect(mockedTransformer).toBeCalledTimes(1);
      const config = { ...pluginConfig, afterDeclarations: true };
      delete config["before"];
      expect(mockedTransformer).toBeCalledWith(program, config);
    } else {
      expect(mockedTransformer).toBeCalledTimes(0);
    }

    mockedTransformer.mockClear();
  });
});
