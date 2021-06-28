import ts, { ParsedCommandLine, Program } from "typescript";
import path from "path";
import { VisitorContext } from "../types";

/* ****************************************************************************************************************** */
// region: TS Helpers
/* ****************************************************************************************************************** */

/**
 * Generates a ParsedCommandLine for Program
 */
export function createParsedCommandLineForProgram(tsInstance: typeof ts, program: Program): ParsedCommandLine {
  const compilerOptions = program.getCompilerOptions();
  const maybePcl: ParsedCommandLine | undefined = compilerOptions.configFilePath
    ? tsInstance.getParsedCommandLineOfConfigFile(compilerOptions.configFilePath, {}, tsInstance.sys as any)
    : void 0;

  return (
    maybePcl ??
    tsInstance.parseJsonConfigFileContent(
      { files: program.getRootFileNames(), compilerOptions },
      tsInstance.sys as any,
      program.getCurrentDirectory()
    )
  );
}

/**
 * Determine output file path for source file
 */
export function getOutputFile(context: VisitorContext, fileName: string): string {
  const { tsInstance, parsedCommandLine, outputFileNamesCache, program, compilerOptions } = context;
  if (outputFileNamesCache.has(fileName)) return outputFileNamesCache.get(fileName)!;

  let res: string | undefined = void 0;
  const [tsMajor, tsMinor] = tsInstance.versionMajorMinor.split(".");

  // TS 3.7+ supports getOutputFileNames
  if (isTsProjectSourceFile(context, fileName) && (+tsMajor >= 4 || +tsMinor >= 7)) {
    try {
      res = tsInstance.getOutputFileNames(parsedCommandLine, fileName, tsInstance.sys?.useCaseSensitiveFileNames)[0];
    } catch (e) {
      console.warn(
        `Failed to resolve output name for ${fileName}. Please report a GH issue at: ` +
          `https://github.com/LeDDGroup/typescript-transform-paths/issues`
      );
      debugger;
    }
  }

  if (!res) res = manualResolve();

  outputFileNamesCache.set(fileName, res);

  return tsInstance.normalizePath(res);

  function manualResolve(): string {
    const srcDir = program.getCommonSourceDirectory();
    const destDir = compilerOptions.outDir ?? srcDir;
    return path.resolve(destDir, path.relative(srcDir, fileName));
  }
}

/**
 * Determine if moduleName matches config in paths
 */
export function isModulePathsMatch(context: VisitorContext, moduleName: string): boolean {
  const { pathsPatterns, tsInstance: { matchPatternOrExact }} = context
  // TODO - Remove typecast after ts v4.4
  return !!matchPatternOrExact((pathsPatterns as any), moduleName);
}

export function isTsProjectSourceFile(context: VisitorContext, filePath: string): boolean {
  const { tsInstance, program } = context;
  return !!program.getRootFileNames().find((f) => tsInstance.normalizePath(filePath) === tsInstance.normalizePath(f));
}

// endregion
