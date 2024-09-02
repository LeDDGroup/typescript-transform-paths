import ts, { GetCanonicalFileName, SourceFile } from "typescript";
import path from "node:path";
import { VisitorContext } from "../types";
import type { REGISTER_INSTANCE } from "ts-node";

/* ****************************************************************************************************************** */
// region: TS Helpers
/* ****************************************************************************************************************** */

/** Determine output file path for source file */
export function getOutputDirForSourceFile(context: VisitorContext, sourceFile: SourceFile): string {
  const {
    tsInstance,
    emitHost,
    outputFileNamesCache,
    compilerOptions,
    tsInstance: { getOwnEmitOutputFilePath, getOutputExtension },
  } = context;

  if (outputFileNamesCache.has(sourceFile)) return outputFileNamesCache.get(sourceFile)!;

  // Note: In project references, resolved path is different from path. In that case, our output path is already
  // determined in resolvedPath
  const outputPath =
    sourceFile.path && sourceFile.resolvedPath && sourceFile.path !== sourceFile.resolvedPath
      ? sourceFile.resolvedPath
      : getOwnEmitOutputFilePath(
          sourceFile.fileName,
          emitHost,
          getOutputExtension(sourceFile.fileName, compilerOptions),
        );

  if (!outputPath)
    throw new Error(
      `Could not resolve output path for ${sourceFile.fileName}. Please report a GH issue at: ` +
        `https://github.com/LeDDGroup/typescript-transform-paths/issues`,
    );

  const res = path.dirname(outputPath);

  outputFileNamesCache.set(sourceFile, res);

  return tsInstance.normalizePath(res);
}

/** Determine if moduleName matches config in paths */
export function isModulePathsMatch(context: VisitorContext, moduleName: string): boolean {
  const {
    pathsPatterns,
    tsInstance: { matchPatternOrExact },
  } = context;
  return !!(pathsPatterns && matchPatternOrExact(pathsPatterns as readonly string[], moduleName));
}

/** Create barebones EmitHost (for no-Program transform) */
export function createSyntheticEmitHost(
  compilerOptions: ts.CompilerOptions,
  tsInstance: typeof ts,
  getCanonicalFileName: GetCanonicalFileName,
  fileNames: string[],
) {
  return {
    getCompilerOptions: () => compilerOptions,
    getCurrentDirectory: tsInstance.sys.getCurrentDirectory,
    getCommonSourceDirectory: () =>
      tsInstance.getCommonSourceDirectoryOfConfig(
        { options: compilerOptions, fileNames: fileNames } as ts.ParsedCommandLine,
        !tsInstance.sys.useCaseSensitiveFileNames,
      ),
    getCanonicalFileName,
  } as ts.EmitHost;
}

/** Get ts-node register info */
export function getTsNodeRegistrationProperties(tsInstance: typeof ts) {
  let tsNodeSymbol: typeof REGISTER_INSTANCE;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    tsNodeSymbol = require("ts-node")?.["REGISTER_INSTANCE"];
  } catch {
    return;
  }

  if (!global.process[tsNodeSymbol]) return;

  const { config, options } = global.process[tsNodeSymbol]!;

  const { configFilePath } = config.options;
  // @ts-expect-error TS(2345) FIXME: Argument of type 'System' is not assignable to parameter of type 'ParseConfigFileHost'.
  const pcl = configFilePath ? tsInstance.getParsedCommandLineOfConfigFile(configFilePath, {}, tsInstance.sys) : void 0;

  const fileNames = pcl?.fileNames || config.fileNames;
  const compilerOptions = Object.assign({}, config.options, options.compilerOptions, { outDir: pcl?.options.outDir });

  return { compilerOptions, fileNames, tsNodeOptions: options };
}

// endregion
