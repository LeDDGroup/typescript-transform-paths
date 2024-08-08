import { register } from "typescript-transform-paths";
import { PluginConfig } from "ts-patch";
import * as tsNode from "ts-node";
import * as transformerModule from "typescript-transform-paths/dist/transformer";
import { REGISTER_INSTANCE } from "ts-node";
import { CustomTransformers, PluginImport, Program } from "typescript";

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const pluginOptions = { opt1: true, opt2: 3 };
const otherTransformer = { transform: "fake-transformer@23904" };
const configs = {
  "Implicit before": {},
  "Explicit before": { before: true },
  afterDeclarations: { afterDeclarations: true },
  "Implicit before + afterDeclarations": [{}, { afterDeclarations: true }],
  "Explicit before + afterDeclarations": [{ before: true }, { afterDeclarations: true }],
} as const;
const configMap = Object.entries(configs).map(([label, cfg]) => {
  let hasBefore: boolean = false;
  let hasAfterDeclarations: boolean = false;
  const transformers = [cfg]
    .flat()
    .map((c) => {
      if ((<any>c).before || !(<any>c).afterDeclarations) hasBefore = true;
      if ((<any>c).afterDeclarations) hasAfterDeclarations = true;
      return { transform: "typescript-transform-paths", ...c, ...pluginOptions } as PluginConfig;
    })
    .concat([otherTransformer]);

  return { label, transformers, hasBefore, hasAfterDeclarations };
});

const instanceSymbol: typeof REGISTER_INSTANCE = tsNode["REGISTER_INSTANCE"];

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`Register script`, () => {
  describe(`Initialize`, () => {
    test(`Registers initial ts-node if none found`, () => {
      const originalTsNodeInstance = global.process[instanceSymbol];
      global.process[instanceSymbol] = void 0;
      let registerSpy: jest.SpyInstance | undefined;
      try {
        registerSpy = jest.spyOn(tsNode, "register");
        expect(global.process[instanceSymbol]).toBeUndefined();

        register.initialize();

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(registerSpy.mock.calls[0]).toHaveLength(0);
        expect(global.process[instanceSymbol]).not.toBeUndefined();
      } finally {
        global.process[instanceSymbol] = originalTsNodeInstance;
        registerSpy?.mockRestore();
      }
    });
    test(`Uses existing ts-node if found`, () => {
      const fakeInstance: any = {};

      const originalTsNodeInstance = global.process[instanceSymbol];
      global.process[instanceSymbol] = fakeInstance;
      let registerSpy: jest.SpyInstance | undefined;
      try {
        registerSpy = jest.spyOn(tsNode, "register");

        const { tsNodeInstance } = register.initialize();

        expect(registerSpy).not.toHaveBeenCalled();
        expect(tsNodeInstance).toBe(fakeInstance);
      } finally {
        global.process[instanceSymbol] = originalTsNodeInstance;
        registerSpy?.mockRestore();
      }
    });

    test(`Returns instance, tsNode, and symbol`, () => {
      const res = register.initialize();
      expect(res.tsNode).toBe(tsNode);
      expect(res.tsNodeInstance).toBe(global.process[instanceSymbol]);
      expect(res.instanceSymbol).toBe(instanceSymbol);
    });
  });

  describe(`Register`, () => {
    test(`Throws without ts-node`, () => {
      jest.doMock("ts-node", () => ({}), { virtual: true });
      expect(() => register()).toThrow(`Cannot resolve ts-node`);
      jest.dontMock("ts-node");
    });

    test(`Throws if can't register ts-node`, () => {
      jest.doMock("ts-node", () => ({ register: () => {} }), { virtual: true });
      expect(() => register()).toThrow(`Could not register ts-node instance!`);
      jest.dontMock("ts-node");
    });

    test(`No transformers in tsConfig exits quietly`, () => {
      const originalInitialize = register.initialize;
      const initializeSpy = jest.spyOn(register, "initialize");
      try {
        initializeSpy.mockImplementation(() => {
          const res = originalInitialize();
          delete res.tsNodeInstance.config.options.plugins;
          return res;
        });
        expect(register()).toBeUndefined();
      } finally {
        initializeSpy.mockRestore();
      }
    });

    describe.each([
      "Existing Transformer Config",
      "Existing Transformer Config Factory",
      "No Existing Transformers",
    ] as const)(`%s`, (configKind) => {
      const fakeExistingTransformer = function fakeExistingTransformer(): any {};
      const fakeTransformer = function fakeTransformer(): any {};
      const fakeTransformerConfig = {
        before: [fakeExistingTransformer],
        after: [fakeExistingTransformer],
        afterDeclarations: [fakeExistingTransformer],
      };
      const transformerFactoryFn = jest.fn().mockReturnValue(fakeTransformerConfig);
      const fakeProgram: any = {};

      let existingTransformers: CustomTransformers | ((p: Program) => CustomTransformers) | undefined;
      switch (configKind) {
        case "Existing Transformer Config Factory":
          existingTransformers = transformerFactoryFn;
          break;
        case "Existing Transformer Config":
          existingTransformers = { ...fakeTransformerConfig };
          break;
        case "No Existing Transformers":
          existingTransformers = void 0;
      }

      describe.each(configMap)(`$label`, ({ transformers, hasBefore, hasAfterDeclarations }) => {
        let mockTransformer: jest.SpyInstance;
        let initializeSpy: jest.SpyInstance;
        let registerResult: tsNode.RegisterOptions;
        let instanceRegistrationResult: tsNode.Service;
        let mergedTransformers: CustomTransformers;

        beforeAll(() => {
          mockTransformer = jest.spyOn(transformerModule, "default").mockReturnValue(fakeTransformer);

          global.process[instanceSymbol] = void 0;

          const originalInitialize = register.initialize;
          initializeSpy = jest.spyOn(register, "initialize");
          initializeSpy.mockImplementation(() => {
            const res = originalInitialize();
            if (existingTransformers) res.tsNodeInstance.options.transformers = existingTransformers;
            else delete res.tsNodeInstance.options.transformers;

            res.tsNodeInstance.config.options.plugins = transformers as PluginImport[];
            return res;
          });

          const originalTsNodeInstance = global.process[instanceSymbol];
          registerResult = register()!;
          instanceRegistrationResult = global.process[instanceSymbol]!;
          global.process[instanceSymbol] = originalTsNodeInstance;

          mergedTransformers =
            typeof registerResult.transformers === "function"
              ? registerResult.transformers(fakeProgram)
              : registerResult.transformers!;
        });
        afterAll(() => {
          initializeSpy.mockRestore();
          mockTransformer.mockRestore();
          transformerFactoryFn.mockClear();
        });

        test(`Registers with ts-node`, () => {
          expect(registerResult?.transformers).not.toBeUndefined();
          expect(instanceRegistrationResult.options).toStrictEqual(registerResult);
        });

        if (existingTransformers === transformerFactoryFn)
          test(`Factory config instantiated with program`, () => {
            expect(transformerFactoryFn).toHaveBeenCalledTimes(1);
            expect(transformerFactoryFn).toHaveBeenCalledWith(fakeProgram);
          });

        test(`Registers correct transformers`, () => {
          const expectedBefore = [
            ...(hasBefore ? [fakeTransformer] : []),
            ...(existingTransformers ? fakeTransformerConfig.before : []),
          ];
          const expectedAfter = existingTransformers ? fakeTransformerConfig.after : [];
          const expectedAfterDeclarations = [
            ...(hasAfterDeclarations ? [fakeTransformer] : []),
            ...(existingTransformers ? fakeTransformerConfig.afterDeclarations : []),
          ];

          const expected = {
            ...(expectedBefore.length && { before: expectedBefore }),
            ...(expectedAfter.length && { after: expectedAfter }),
            ...(expectedAfterDeclarations.length && { afterDeclarations: expectedAfterDeclarations }),
          };

          expect(mergedTransformers).toStrictEqual(expected);
        });

        test(`Transformer instantiated w/ proper config${
          existingTransformers === transformerFactoryFn ? " & Program" : ""
        }`, () => {
          const callTimes = +hasBefore + +hasAfterDeclarations;
          expect(mockTransformer).toHaveBeenCalledTimes(callTimes);

          const afterDeclarationsConfig = transformers.find(
            (t) => t.transform === "typescript-transform-paths" && t.afterDeclarations,
          );
          const beforeConfig = transformers.find(
            (t) => t.transform === "typescript-transform-paths" && !t.afterDeclarations,
          );

          if (hasBefore) expect(beforeConfig).not.toBeUndefined();
          if (hasAfterDeclarations) expect(afterDeclarationsConfig).not.toBeUndefined();

          const expectedCfg = [beforeConfig, afterDeclarationsConfig].filter((c) => !!c);
          for (let i = 0; i < callTimes; i++) {
            expect(mockTransformer.mock.calls[i][0]).toBe(
              existingTransformers === transformerFactoryFn ? fakeProgram : void 0,
            );
            expect(mockTransformer.mock.calls[i][1]).toBe(expectedCfg[i]);
          }
        });
      });
    });
  });
});
