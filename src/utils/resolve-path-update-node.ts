import ts from "typescript";
import tsThree from "../declarations/typescript3";
import path from "path";
import { VisitorContext } from "../types";
import { isBaseDir, isURL } from "./general-utils";

/* ****************************************************************************************************************** */
// region: Config
/* ****************************************************************************************************************** */

const explicitExtensions = [".js", ".jsx", ".cjs", ".mjs"];

// endregion

/* ****************************************************************************************************************** */
// region: Node Updater Utility
/* ****************************************************************************************************************** */

/**
 * Gets proper path and calls updaterFn to get the new node if it should be updated
 */
export function resolvePathAndUpdateNode(
  context: VisitorContext,
  node: ts.Node,
  moduleName: string,
  updaterFn: (newPath: ts.StringLiteral) => ts.Node | tsThree.Node | undefined
): ts.Node | undefined {
  const { sourceFile, compilerOptions, tsInstance, config, implicitExtensions, factory } = context;
  const tags = getStatementTags();

  // Skip if @no-transform-path specified
  if (tags?.shouldSkip) return node;

  const resolutionResult = resolvePath(tags?.overridePath);

  // Skip if can't be resolved
  if (!resolutionResult || !resolutionResult.outputPath) return node;

  const { outputPath, filePath } = resolutionResult;

  // Check if matches exclusion
  if (filePath && context.excludeMatchers)
    for (const matcher of context.excludeMatchers) if (matcher.match(filePath)) return node;

  return updaterFn(factory.createStringLiteral(outputPath)) as ts.Node | undefined;

  /* ********************************************************* *
   * Helpers
   * ********************************************************* */

  function resolvePath(overridePath: string | undefined): { outputPath: string; filePath?: string } | undefined {
    /* Handle overridden path -- ie. @transform-path ../my/path) */
    if (overridePath) {
      return {
        outputPath: filePathToOutputPath(overridePath, path.extname(overridePath)),
        filePath: overridePath,
      };
    }

    /* Have Compiler API attempt to resolve */
    const { resolvedModule, failedLookupLocations } = tsInstance.resolveModuleName(
      moduleName,
      sourceFile.fileName,
      compilerOptions,
      tsInstance.sys
    );

    // No transform for node-modules
    if (resolvedModule?.isExternalLibraryImport) return void 0;

    /* Handle non-resolvable module */
    if (!resolvedModule) {
      const maybeURL = failedLookupLocations[0];
      if (!isURL(maybeURL)) return void 0;
      return { outputPath: maybeURL };
    }

    /* Handle resolved module */
    const { extension, resolvedFileName } = resolvedModule;
    return {
      outputPath: filePathToOutputPath(resolvedFileName, extension),
      filePath: resolvedFileName,
    };
  }

  function filePathToOutputPath(filePath: string, extension: string | undefined) {
    if (path.isAbsolute(filePath)) {
      let sourceFileDir = tsInstance.normalizePath(path.dirname(sourceFile.fileName));
      let moduleDir = path.dirname(filePath);

      /* Handle rootDirs mapping */
      if (config.useRootDirs && context.rootDirs) {
        let fileRootDir = "";
        let moduleRootDir = "";
        for (const rootDir of context.rootDirs) {
          if (isBaseDir(rootDir, filePath) && rootDir.length > moduleRootDir.length) moduleRootDir = rootDir;
          if (isBaseDir(rootDir, sourceFile.fileName) && rootDir.length > fileRootDir.length) fileRootDir = rootDir;
        }

        /* Remove base dirs to make relative to root */
        if (fileRootDir && moduleRootDir) {
          sourceFileDir = path.relative(fileRootDir, sourceFileDir);
          moduleDir = path.relative(moduleRootDir, moduleDir);
        }
      }

      /* Make path relative */
      filePath = tsInstance.normalizePath(path.join(path.relative(sourceFileDir, moduleDir), path.basename(filePath)));
    }

    // Remove extension if implicit
    if (extension && implicitExtensions.includes(extension))
      filePath = filePath.slice(0, -extension.length) + maybeGetExplicitExtension(filePath, extension);

    return filePath[0] === "." || isURL(filePath) ? filePath : `./${filePath}`;
  }

  function maybeGetExplicitExtension(filePath: string, resolvedExtension: string): string {
    const moduleExtension = path.extname(moduleName);
    if (moduleExtension && !explicitExtensions.includes(moduleExtension)) return "";

    return path.basename(moduleName, moduleExtension) === path.basename(filePath, resolvedExtension)
      ? moduleExtension
      : "";
  }

  function getStatementTags() {
    let targetNode = tsInstance.isStatement(node)
      ? node
      : tsInstance.findAncestor(node, tsInstance.isStatement) ?? node;
    targetNode = tsInstance.getOriginalNode(targetNode);

    let jsDocTags: readonly ts.JSDocTag[] | undefined;
    try {
      jsDocTags = tsInstance.getJSDocTags(targetNode);
    } catch {}

    const commentTags = new Map<string, string | undefined>();
    try {
      const trivia = targetNode.getFullText(sourceFile).slice(0, targetNode.getLeadingTriviaWidth(sourceFile));
      const regex = /^\s*\/\/\/?\s*@(transform-path|no-transform-path)(?:[^\S\r\n](.+?))?$/gm;

      for (let match = regex.exec(trivia); match; match = regex.exec(trivia)) commentTags.set(match[1], match[2]);
    } catch {}

    return {
      overridePath:
        commentTags.get("transform-path") ??
        jsDocTags?.find((t) => t.tagName.text.toLowerCase() === "transform-path")?.comment,
      shouldSkip:
        commentTags.has("no-transform-path") ||
        !!jsDocTags?.find((t) => t.tagName.text.toLowerCase() === "no-transform-path"),
    };
  }
}

// endregion
