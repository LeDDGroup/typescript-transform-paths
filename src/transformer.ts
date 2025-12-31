import path from "node:path";

import { Minimatch } from "minimatch";
import type { TransformerExtras } from "ts-patch";
import ts, { type CompilerOptions } from "typescript";

import {
  RunMode,
  TsNodeState,
  type TsTransformPathsConfig,
  type TsTransformPathsContext,
  type VisitorContext,
} from "./types.ts";
import { createSyntheticEmitHost } from "./utils/ts-helpers.ts";
import { nodeVisitor } from "./visitor.ts";

function getTsProperties(args: Parameters<typeof transformer>) {
  let fileNames: readonly string[] | undefined;
  let compilerOptions: CompilerOptions;
  let runMode: RunMode;
  let tsNodeState: TsNodeState | undefined;

  const { 0: program, 2: extras, 3: manualTransformOptions } = args;

  const tsInstance = extras?.ts ?? ts;

  if (program) compilerOptions = program.getCompilerOptions();

  /* Determine RunMode & Setup */
  // RunMode: Program
  if (program) {
    runMode = RunMode.Program;
    compilerOptions = compilerOptions!;
  }
  // RunMode: Manual
  else if (manualTransformOptions) {
    runMode = RunMode.Manual;
    fileNames = manualTransformOptions.fileNames;
    compilerOptions = manualTransformOptions.compilerOptions!;
  } else {
    throw new Error(
      `Cannot transform without a Program or manual parameters supplied. ` +
        `Make sure you're using ts-patch with transpileOnly.`,
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

    if (tsVersionMajor === undefined || tsVersionMinor === undefined) throw new Error("Expected version to be parsed");

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
        factory: (tsTransformPathsContext.tsFactory ?? tsTransformPathsContext.tsInstance) as ts.NodeFactory,
      };

      return tsInstance.visitEachChild(sourceFile, visitorContext.getVisitor(), transformationContext);
    };
  };
}
