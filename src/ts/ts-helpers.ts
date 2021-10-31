import TS from "typescript";
import { GetCanonicalFileName, SourceFile } from "typescript";
import { VisitorContext } from "../types";
import type { REGISTER_INSTANCE } from "ts-node";

/* ****************************************************************************************************************** */
// region: TS Helpers
/* ****************************************************************************************************************** */

/**
 * Determine output file path for source file
 */
export function getOutputPathForSourceFile(context: VisitorContext, sourceFile: SourceFile): string {
  const {
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
      : getOwnEmitOutputFilePath(sourceFile.fileName, emitHost, getOutputExtension(sourceFile, compilerOptions));

  if (!outputPath)
    throw new Error(
      `Could not resolve output path for ${sourceFile.fileName}. Please report a GH issue at: ` +
        `https://github.com/LeDDGroup/typescript-transform-paths/issues`
    );

  outputFileNamesCache.set(sourceFile, outputPath);

  return outputPath;
}

/**
 * Create barebones EmitHost (for no-Program / ts-node transform)
 */
export function createSyntheticEmitHost(
  compilerOptions: TS.CompilerOptions,
  tsInstance: typeof TS,
  getCanonicalFileName: GetCanonicalFileName,
  fileNames: string[]
) {
  return {
    getCompilerOptions: () => compilerOptions,
    getCurrentDirectory: tsInstance.sys.getCurrentDirectory,
    getCommonSourceDirectory: () =>
      tsInstance.getCommonSourceDirectoryOfConfig(
        { options: compilerOptions, fileNames: fileNames } as TS.ParsedCommandLine,
        !tsInstance.sys.useCaseSensitiveFileNames
      ),
    getCanonicalFileName,
  } as unknown as TS.EmitHost;
}

/**
 * Get ts-node register info
 */
export function getTsNodeRegistrationProperties(tsInstance: typeof TS) {
  let tsNodeSymbol: typeof REGISTER_INSTANCE;
  try {
    tsNodeSymbol = require("ts-node")?.["REGISTER_INSTANCE"];
  } catch {
    return undefined;
  }

  if (!global.process[tsNodeSymbol]) return undefined;

  const { config, options } = global.process[tsNodeSymbol]!;

  const { configFilePath } = config.options;
  const pcl = configFilePath
    ? tsInstance.getParsedCommandLineOfConfigFile(configFilePath, {}, <any>tsInstance.sys)
    : void 0;

  const fileNames = pcl?.fileNames || config.fileNames;
  const compilerOptions = Object.assign(config.options, options.compilerOptions, { outDir: pcl?.options.outDir });

  return { compilerOptions, fileNames, tsNodeConfig: config };
}

/**
 * Copies comment range from srcNode to destNode
 */
export function copyNodeComments(tsInstance: typeof TS, srcSourceFile: TS.SourceFile, srcNode: TS.Node, destNode: TS.Node) {
  // TS has a bugs which cause getLeadingTriviaWidth & getLeadingCommentRanges to exceed the proper boundaries.
  // This tends to happen in scenarios where there are more than one comment.
  //   - It often causes the final comment to include the full node text as well
  //   - Single line comments can be combined into single range (ie: `//comment1\n//comment2`)
  //
  // Otherwise, the proper method would be to use something like the following:
  // const commentRanges = tsInstance.getLeadingCommentRanges(srcNode.getFullText(), 0);
  //
  // NOTE: If TS fixes this, we still cannot change the logic unless we no longer support the older versions with the bugs
  // As of now, I have not filed nor was I able to find a bug report for this

  const fullText = srcNode.getFullText(srcSourceFile);
  const commendEndPos = fullText.length - srcNode.getText(srcSourceFile).length;
  const commentText = fullText.substr(0, commendEndPos);

  const commentRegex = /(?:\/\*([\s\S]*?)\*\/|\/\/([^\r\n]*))(\r?\n?)/gs;

  let match: RegExpExecArray | null;
  while (match = commentRegex.exec(commentText)) {
    const caption = match[1] || match[2];
    const isMultiLine = !!match[1];
    const hasTrailingNewLine = !!match[3];
    const kind = isMultiLine ? tsInstance.SyntaxKind.MultiLineCommentTrivia : tsInstance.SyntaxKind.SingleLineCommentTrivia;

    tsInstance.addSyntheticLeadingComment(destNode, kind, caption, hasTrailingNewLine);
  }
}

/**
 * Determine if moduleName matches config in paths
 */
export function getTsPathsMatch(context: VisitorContext, moduleName: string): string | TS.Pattern | undefined {
  const {
    pathsPatterns,
    tsInstance: { matchPatternOrExact },
  } = context;
  return pathsPatterns && matchPatternOrExact(pathsPatterns, moduleName);
}

/**
 * Throw if unsupported version
 */
export function checkTsSupport(tsInstance: typeof TS) {
  const [ major, minor ] = tsInstance.versionMajorMinor.split('.');
  if (+major < 4 || (+major === 4 && +minor < 2))
    throw new Error(`The latest version of 'typescript-transform-paths' requires TS version 4.2.2 or higher. Either upgrade TS or use v3 of the plugin.`);
}

export function getOutputExtension(
  tsInstance: typeof TS,
  compilerOptions: TS.CompilerOptions,
  sourceFile: TS.SourceFile,
  isDeclaration: boolean
) {
  return isDeclaration ? '.d.ts' : tsInstance.getOutputExtension(sourceFile, compilerOptions);
}

// endregion
