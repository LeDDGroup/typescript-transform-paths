// noinspection ES6UnusedImports
import {} from "ts-expose-internals";
import path from "path";
import ts from "typescript";
import { cast } from "./utils";
import { TsTransformPathsConfig, TsTransformPathsContext, TypeScriptThree, VisitorContext } from "./types";
import { nodeVisitor } from "./visitor";
import { createHarmonyFactory } from "./utils/harmony-factory";
import { Minimatch } from "minimatch";
import { createSyntheticEmitHost, getTsNodeRegistrationProperties } from "./utils/ts-helpers";
import { TransformerExtras } from "ts-patch";

/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */

function getTsProperties(args: Parameters<typeof transformer>) {
  let tsInstance: typeof ts;
  let compilerOptions: ts.CompilerOptions;
  let fileNames: readonly string[] | undefined;
  let isTsNode = false;

  const { 0: program, 2: extras, 3: manualTransformOptions } = args;

  tsInstance = extras?.ts ?? ts;
  compilerOptions = manualTransformOptions?.compilerOptions!;

  if (program) {
    compilerOptions ??= program.getCompilerOptions();
  } else if (manualTransformOptions) {
    fileNames = manualTransformOptions.fileNames;
  } else {
    const tsNodeProps = getTsNodeRegistrationProperties(tsInstance);
    if (!tsNodeProps)
      throw new Error(
        `Cannot transform without a Program, ts-node instance, or manual parameters supplied. ` +
          `Make sure you're using ts-patch or ts-node with transpileOnly.`
      );
    isTsNode = true;
    compilerOptions = tsNodeProps.compilerOptions;
    fileNames = tsNodeProps.fileNames;
  }

  return { tsInstance, compilerOptions, fileNames, isTsNode };
}

// endregion

/* ****************************************************************************************************************** */
// region: Transformer
/* ****************************************************************************************************************** */

export default function transformer(
  program?: ts.Program,
  pluginConfig?: TsTransformPathsConfig,
  transformerExtras?: TransformerExtras,
  /**
   * Supply if manually transforming with compiler API via 'transformNodes' / 'transformModule'
   */
  manualTransformOptions?: {
    compilerOptions?: ts.CompilerOptions;
    fileNames?: string[];
  }
) {
  const transformerFactory: ts.TransformerFactory<ts.SourceFile> = (
    transformationContext: ts.TransformationContext
  ) => {
    // prettier-ignore
    const {
      tsInstance,
      compilerOptions,
      fileNames,
      isTsNode
    } = getTsProperties([ program, pluginConfig, transformerExtras, manualTransformOptions ]);

    const rootDirs = compilerOptions.rootDirs?.filter(path.isAbsolute);
    const config: TsTransformPathsConfig = pluginConfig ?? {};
    const getCanonicalFileName = tsInstance.createGetCanonicalFileName(tsInstance.sys.useCaseSensitiveFileNames);

    let emitHost = transformationContext.getEmitHost();
    if (!emitHost) {
      if (!fileNames)
        throw new Error(
          `No EmitHost found and could not determine files to be processed. Please file an issue with a reproduction!`
        );
      emitHost = createSyntheticEmitHost(compilerOptions, tsInstance, getCanonicalFileName, fileNames as string[]);
    } else if (isTsNode) {
      Object.assign(emitHost, { getCompilerOptions: () => compilerOptions });
    }

    const { configFile, paths } = compilerOptions;
    // TODO - Remove typecast when tryParsePatterns is recognized (probably after ts v4.4)
    const { tryParsePatterns } = tsInstance as any;

    const tsTransformPathsContext: TsTransformPathsContext = {
      compilerOptions,
      config,
      elisionMap: new Map(),
      tsFactory: transformationContext.factory,
      program,
      rootDirs,
      transformationContext,
      tsInstance,
      emitHost,
      isTsNode,
      tsThreeInstance: cast<TypeScriptThree>(tsInstance),
      excludeMatchers: config.exclude?.map((globPattern) => new Minimatch(globPattern, { matchBase: true })),
      outputFileNamesCache: new Map(),
      // Get paths patterns appropriate for TS compiler version
      pathsPatterns:
        paths &&
        (tryParsePatterns
          ? // TODO - Remove typecast when pathPatterns is recognized (probably after ts v4.4)
            (configFile?.configFileSpecs as any)?.pathPatterns || tryParsePatterns(paths)
          : tsInstance.getOwnKeys(paths)),
    };

    return (sourceFile: ts.SourceFile) => {
      const visitorContext: VisitorContext = {
        ...tsTransformPathsContext,
        sourceFile,
        isDeclarationFile: sourceFile.isDeclarationFile,
        originalSourceFile: (<typeof ts>tsInstance).getOriginalSourceFile(sourceFile),
        getVisitor() {
          return nodeVisitor.bind(this);
        },
        factory: createHarmonyFactory(tsTransformPathsContext),
      };

      return tsInstance.visitEachChild(sourceFile, visitorContext.getVisitor(), transformationContext);
    };
  };
  return transformerFactory;
}

// endregion
