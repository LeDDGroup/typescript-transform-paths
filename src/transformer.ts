// noinspection ES6UnusedImports
import {} from "ts-expose-internals";
import path from "path";
import ts from "typescript";
import { TransformerExtras, TsTransformPathsConfig, TsTransformPathsContext, VisitorContext } from "./types";
import { nodeVisitor } from "./visitor";
import { createHarmonyFactory } from "./utils/harmony-factory";
import { Minimatch } from "minimatch";
import { createSyntheticEmitHost, getTsNodeRegistrationProperties } from "./utils/ts-helpers";


/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */

function getTsProperties(args: Parameters<typeof transformer>) {
  let tsInstance: typeof ts;
  let compilerOptions: ts.CompilerOptions;
  let fileNames: readonly string[] | undefined;
  let isTranspileOnly = false;
  let isTsNode = false;

  const [program, pluginConfig, extras, manualTransformOptions] = args;

  tsInstance = extras?.ts ?? ts;
  compilerOptions = manualTransformOptions?.compilerOptions!;
  const config = {
    ...pluginConfig,
    outputMode: pluginConfig?.outputMode === "esm" ? <const>"esm" : <const>"commonjs",
  };

  const tsNodeProps = getTsNodeRegistrationProperties(tsInstance);
  if (tsNodeProps) isTsNode = true;

  if (program) {
    compilerOptions ??= Object.assign({}, program.getCompilerOptions(), tsNodeProps?.compilerOptions);
  } else if (manualTransformOptions) {
    fileNames = manualTransformOptions.fileNames;
  } else {
    if (!tsNodeProps)
      throw new Error(
        `Cannot transform without a Program, ts-node instance, or manual parameters supplied. ` +
          `Make sure you're using ts-patch or ts-node with transpileOnly.`
      );
    isTranspileOnly = true;
    compilerOptions = tsNodeProps.compilerOptions;
    fileNames = tsNodeProps.fileNames;
  }

  return { tsInstance, compilerOptions, fileNames, isTranspileOnly, config, isTsNode };
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
  return (transformationContext: ts.TransformationContext) => {
    // prettier-ignore
    const {
      tsInstance,
      compilerOptions,
      fileNames,
      isTranspileOnly,
      isTsNode,
      config
    } = getTsProperties([ program, pluginConfig, transformerExtras, manualTransformOptions ]);

    const rootDirs = compilerOptions.rootDirs?.filter(path.isAbsolute);
    const getCanonicalFileName = tsInstance.createGetCanonicalFileName(tsInstance.sys.useCaseSensitiveFileNames);

    let emitHost = transformationContext.getEmitHost();
    if (!emitHost) {
      if (!fileNames)
        throw new Error(
          `No EmitHost found and could not determine files to be processed. Please file an issue with a reproduction!`
        );
      emitHost = createSyntheticEmitHost(compilerOptions, tsInstance, getCanonicalFileName, fileNames as string[]);
    } else if (isTranspileOnly) {
      Object.assign(emitHost, { getCompilerOptions: () => compilerOptions });
    }

    const { configFile, paths } = compilerOptions;
    const tryParsePatterns: typeof ts.tryParsePatterns | undefined = tsInstance.tryParsePatterns;

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
      isTranspileOnly,
      isTsNode,
      excludeMatchers: config.exclude?.map((globPattern) => new Minimatch(globPattern, { matchBase: true })),
      outputFileNamesCache: new Map(),
      // Get paths patterns appropriate for TS compiler version
      pathsPatterns:
        paths &&
        (tryParsePatterns
          ? configFile?.configFileSpecs?.pathPatterns || tryParsePatterns(paths)
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
        outputMode: config.outputMode === 'esm' && sourceFile.isDeclarationFile ? 'esm' : 'commonjs'
      };

      return tsInstance.visitEachChild(sourceFile, visitorContext.getVisitor(), transformationContext);
    };
  };
}

// endregion
