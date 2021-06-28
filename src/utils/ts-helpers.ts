import { SourceFile } from "typescript";
import path from "path";
import { VisitorContext } from "../types";

/* ****************************************************************************************************************** */
// region: TS Helpers
/* ****************************************************************************************************************** */

/**
 * Determine output file path for source file
 */
export function getOutputDirForSourceFile(context: VisitorContext, sourceFile: SourceFile): string {
  const {
    tsInstance,
    emitHost,
    outputFileNamesCache,
    compilerOptions,
    tsInstance: { getOwnEmitOutputFilePath, getOutputExtension },
  } = context;

  if (outputFileNamesCache.has(sourceFile)) return outputFileNamesCache.get(sourceFile)!;

  const outputPath = getOwnEmitOutputFilePath(sourceFile.fileName, emitHost, getOutputExtension(sourceFile, compilerOptions));
  if (!outputPath)
    throw new Error(
      `Could not resolve output path for ${sourceFile.fileName}. Please report a GH issue at: ` +
        `https://github.com/LeDDGroup/typescript-transform-paths/issues`
    );

  const res = path.dirname(outputPath);

  outputFileNamesCache.set(sourceFile, res);

  return tsInstance.normalizePath(res);
}

/**
 * Determine if moduleName matches config in paths
 */
export function isModulePathsMatch(context: VisitorContext, moduleName: string): boolean {
  const {
    pathsPatterns,
    tsInstance: { matchPatternOrExact },
  } = context;
  // TODO - Remove typecast after ts v4.4
  return !!matchPatternOrExact(pathsPatterns as any, moduleName);
}

// endregion
