import path from "node:path";
import ts, { CompilerOptions } from "typescript";
import { RunMode, TsNodeState, TsTransformPathsConfig, TsTransformPathsContext, VisitorContext } from "./types";
import { nodeVisitor } from "./visitor";
import { createHarmonyFactory } from "./harmony";
import { Minimatch } from "minimatch";
import { createSyntheticEmitHost, getTsNodeRegistrationProperties } from "./utils/ts-helpers";
import { TransformerExtras } from "ts-patch";

function getTsProperties(args: Parameters<typeof transformer>) {
  let fileNames: readonly string[] | undefined;
  let compilerOptions: CompilerOptions;
  let runMode: RunMode;
  let tsNodeState: TsNodeState | undefined;

  const { 0: program, 2: extras, 3: manualTransformOptions } = args;

  const tsInstance = extras?.ts ?? ts;

  if (program) compilerOptions = program.getCompilerOptions();
  const tsNodeProps = getTsNodeRegistrationProperties(tsInstance);

  /* Determine RunMode & Setup */
  // Note: ts-node passes a Program with the paths property stripped, so we do some comparison to determine if it's the caller
  const isTsNode =
    tsNodeProps && (!program || compilerOptions!.configFilePath === tsNodeProps.compilerOptions.configFilePath);

  // RunMode: Program
  if (program && !isTsNode) {
    runMode = RunMode.Program;
    compilerOptions = compilerOptions!;
  }
  // RunMode: Manual
  else if (manualTransformOptions) {
    runMode = RunMode.Manual;
    fileNames = manualTransformOptions.fileNames;
    compilerOptions = manualTransformOptions.compilerOptions!;
  }
  // RunMode: TsNode
  else if (isTsNode) {
    fileNames = tsNodeProps.fileNames;
    runMode = RunMode.TsNode;

    tsNodeState =
      !program ||
      (fileNames.length > 1 && program?.getRootFileNames().length === 1) ||
      (!compilerOptions!.paths && tsNodeProps!.compilerOptions.paths)
        ? TsNodeState.Stripped
        : TsNodeState.Full;

    compilerOptions =
      tsNodeState === TsNodeState.Full
        ? compilerOptions!
        : {
            ...program?.getCompilerOptions(),
            ...tsNodeProps!.compilerOptions,
          };
  } else {
    throw new Error(
      `Cannot transform without a Program, ts-node instance, or manual parameters supplied. ` +
        `Make sure you're using ts-patch or ts-node with transpileOnly.`,
    );
  }

  return { tsInstance, compilerOptions, fileNames, runMode, tsNodeState };
}

export default function transformer(
  program?: ts.Program,
  pluginConfig?: TsTransformPathsConfig,
  transformerExtras?: TransformerExtras,
  /** Supply if manually transforming with compiler API via 'transformNodes' / 'transformModule' */
  manualTransformOptions?: {
    compilerOptions?: ts.CompilerOptions;
    fileNames?: string[];
  },
) {
  return (transformationContext: ts.TransformationContext) => {
    // prettier-ignore
    const {
      tsInstance,
      compilerOptions,
      fileNames,
      runMode,
      tsNodeState
    } = getTsProperties([ program, pluginConfig, transformerExtras, manualTransformOptions ]);

    const rootDirs = compilerOptions.rootDirs?.filter(path.isAbsolute);
    const config: TsTransformPathsConfig = pluginConfig ?? {};
    const getCanonicalFileName = tsInstance.createGetCanonicalFileName(tsInstance.sys.useCaseSensitiveFileNames);

    /* Add supplements for various run modes */
    let emitHost = transformationContext.getEmitHost();
    if (!emitHost || tsNodeState === TsNodeState.Stripped) {
      if (!fileNames)
        throw new Error(
          `No EmitHost found and could not determine files to be processed. Please file an issue with a reproduction!`,
        );
      emitHost = createSyntheticEmitHost(compilerOptions, tsInstance, getCanonicalFileName, fileNames as string[]);
    }

    /* Create Visitor Context */
    const { configFile, paths } = compilerOptions;
    const { tryParsePatterns } = tsInstance;
    const [tsVersionMajor, tsVersionMinor] = tsInstance.versionMajorMinor.split(".").map((v) => +v);

    if (!tsVersionMajor || !tsVersionMinor) throw new Error("Expected version to be parsed");

    const tsTransformPathsContext: TsTransformPathsContext = {
      compilerOptions,
      config,
      elisionMap: new Map(),
      tsFactory: transformationContext.factory,
      program,
      rootDirs,
      transformationContext,
      tsInstance,
      tsVersionMajor,
      tsVersionMinor,
      emitHost,
      runMode,
      tsNodeState,
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
        originalSourceFile: ts.getParseTreeNode(sourceFile, ts.isSourceFile) || sourceFile,
        getVisitor() {
          return nodeVisitor.bind(this);
        },
        factory: createHarmonyFactory(tsTransformPathsContext),
      };

      return tsInstance.visitEachChild(sourceFile, visitorContext.getVisitor(), transformationContext);
    };
  };
}
